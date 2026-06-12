package com.learnunblock.app

import android.app.admin.DevicePolicyManager
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.view.KeyEvent
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var wakeLock: PowerManager.WakeLock? = null
    private var isMissionLocked = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        setupWebView()
        hideSystemBars()

        webView.loadUrl("file:///android_asset/game/index.html")
    }

    // ═══════════════════════════════════════════════
    // CONFIGURACIÓN DEL WEBVIEW
    // ═══════════════════════════════════════════════
    private fun setupWebView() {
        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        // Puente JS <-> Android: el juego llama a estas funciones
        // mediante AndroidApp.activarBloqueo() / AndroidApp.desactivarBloqueo()
        webView.addJavascriptInterface(WebAppInterface(), "AndroidApp")

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()
    }

    /**
     * Interfaz expuesta al JavaScript del juego.
     * En index.html / android-bridge.js se llama:
     *   AndroidApp.activarBloqueo()   -> al iniciar la misión
     *   AndroidApp.desactivarBloqueo() -> al completar la misión
     */
    inner class WebAppInterface {
        @JavascriptInterface
        fun activarBloqueo() {
            runOnUiThread { startMissionLock() }
        }

        @JavascriptInterface
        fun desactivarBloqueo() {
            runOnUiThread { stopMissionLock() }
        }
    }

    // ═══════════════════════════════════════════════
    // BLOQUEO DE PANTALLA (KIOSKO)
    // ═══════════════════════════════════════════════

    /**
     * Activa el modo kiosko.
     *
     * - Si la app es "Device Owner" (Fase 2 configurada vía ADB),
     *   startLockTask() bloquea la pantalla SIN pedir confirmación:
     *   el botón Home, recientes y notificaciones quedan deshabilitados
     *   hasta que se llame a stopLockTask().
     *
     * - Si la app NO es Device Owner (instalación normal, Fase 1),
     *   Android pedirá una confirmación la primera vez ("Screen Pinning"):
     *   el usuario debe mantener presionado el botón de Recientes/Overview.
     *   Después de esa confirmación, el comportamiento es similar.
     */
    private fun startMissionLock() {
        if (isMissionLocked) return
        try {
            startLockTask()
            isMissionLocked = true
            acquireWakeLock()
            Toast.makeText(this, "🔒 Misión iniciada: bloqueo activado", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(this, "No se pudo activar el bloqueo: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun stopMissionLock() {
        if (!isMissionLocked) return
        try {
            stopLockTask()
        } catch (e: Exception) {
            // Puede lanzar excepción si el sistema ya salió del lock task
        }
        isMissionLocked = false
        releaseWakeLock()
        Toast.makeText(this, "🔓 Misión completada: bloqueo desactivado", Toast.LENGTH_SHORT).show()
    }

    /**
     * Bloquea el botón "Atrás" mientras la misión está en curso.
     * En Lock Task Mode, Android ya impide salir de la app, pero esto
     * evita además que el WebView navegue hacia atrás dentro del juego.
     */
    override fun onBackPressed() {
        if (isMissionLocked) {
            // No hacer nada: ignorar el botón atrás durante la misión
            return
        }
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        // Bloquear botón de volumen/menu como salida "fácil" durante la misión
        // (el botón Home y Recientes ya quedan bloqueados por Lock Task Mode
        // cuando la app es Device Owner; en modo Screen Pinning normal,
        // Android los bloquea automáticamente también).
        if (isMissionLocked && keyCode == KeyEvent.KEYCODE_BACK) {
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    // ═══════════════════════════════════════════════
    // PANTALLA COMPLETA / WAKE LOCK
    // ═══════════════════════════════════════════════
    private fun hideSystemBars() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(false)
            window.insetsController?.let { controller ->
                controller.hide(
                    android.view.WindowInsets.Type.statusBars() or
                    android.view.WindowInsets.Type.navigationBars()
                )
                controller.systemBarsBehavior =
                    android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_FULLSCREEN
            )
        }
    }

    private fun acquireWakeLock() {
        val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = pm.newWakeLock(
            PowerManager.SCREEN_BRIGHT_WAKE_LOCK or PowerManager.ON_AFTER_RELEASE,
            "LearnUnblock:MissionWakeLock"
        )
        wakeLock?.acquire(10 * 60 * 1000L /* máx 10 min de seguridad */)
    }

    private fun releaseWakeLock() {
        wakeLock?.let { if (it.isHeld) it.release() }
        wakeLock = null
    }

    override fun onDestroy() {
        releaseWakeLock()
        super.onDestroy()
    }

    /**
     * Helper: ¿la app es Device Owner? (Fase 2)
     * Útil para mostrar en el panel de padres si el control total
     * está activo o no.
     */
    fun isDeviceOwner(): Boolean {
        val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        return dpm.isDeviceOwnerApp(packageName)
    }
}
