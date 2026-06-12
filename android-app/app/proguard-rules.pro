# Reglas de ProGuard/R8 — vacío por ahora.
# Si más adelante activas isMinifyEnabled = true, agrega aquí
# reglas para mantener clases usadas por reflexión (WebView JS interface, etc.)

-keepclassmembers class com.learnunblock.app.MainActivity$WebAppInterface {
   public *;
}
