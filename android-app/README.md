# Learn & Unblock — App Android (Fase 1)

App nativa que envuelve el juego en un **WebView** y agrega bloqueo de
pantalla tipo kiosko. Esta es la **Fase 1** del proyecto:

✅ App instalable (.apk)
✅ Juego funciona offline (todo está incluido como assets)
✅ Bloqueo de pantalla tipo kiosko mediante **Screen Pinning** (nativo de
   Android, no requiere permisos especiales)
✅ El propio juego activa/desactiva el bloqueo automáticamente al
   iniciar/terminar una misión (`startGame()` / `endGame()`)

⏳ Pendiente para fases siguientes: Device Owner (bloqueo sin que el
usuario confirme nada), panel de padres nativo, conexión con `nexus.py`.

---

## 🛠️ Cómo abrir y compilar el proyecto

1. Instala **Android Studio** (gratis): https://developer.android.com/studio
2. Abre Android Studio → **Open** → selecciona la carpeta `android-app`
   (la que contiene este README y el archivo `settings.gradle.kts`)
3. Espera a que termine el **Gradle Sync** (la primera vez puede tardar
   varios minutos, descarga dependencias)
4. Si pide actualizar el "Gradle Wrapper" o el "Android Gradle Plugin",
   acepta las sugerencias por defecto.

## 📱 Probarla en un celular

1. En el celular: **Ajustes → Acerca del teléfono** → toca 7 veces
   "Número de compilación" para activar **Opciones de desarrollador**
2. **Ajustes → Opciones de desarrollador** → activa **Depuración USB**
3. Conecta el celular a la PC por USB (acepta el permiso en el celular)
4. En Android Studio, selecciona tu celular en la lista de dispositivos
   (arriba) y presiona el botón ▶️ **Run**
5. La app se instalará y abrirá automáticamente

## 🔒 Probar el bloqueo (Screen Pinning)

1. Dentro del juego, presiona "Jugar" para iniciar una misión
2. La app activará automáticamente el modo de "fijar pantalla"
   - **La primera vez**, Android puede mostrar un mensaje explicando
     qué es "Fijar esta app" — esto es normal, es la confirmación de
     seguridad de Android para Lock Task Mode sin Device Owner
3. Mientras está fijada: el botón Home/Recientes queda bloqueado
   (en algunos Android se necesita mantener presionados Atrás + Recientes
   para salir — eso es el comportamiento nativo de Android, no de la app)
4. Al completar la misión (`endGame()`), la app libera automáticamente
   el bloqueo

## 📦 Generar el .apk para instalar en el celular del menor

En Android Studio:
- **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- El archivo quedará en `app/build/outputs/apk/debug/app-debug.apk`
- Pasa ese archivo al celular del menor (por USB, Drive, etc.) y
  ábrelo para instalarlo (puede pedir activar "Instalar apps
  desconocidas" para esa fuente — es normal en instalaciones fuera
  de Play Store)

---

## 🚀 Siguiente paso: Fase 2 (Device Owner / control total)

Para que el bloqueo sea automático y **sin que el menor pueda salir
incluso sin confirmación previa**, hay que convertir esta app en
"Device Owner" del celular. Esto se hace **una sola vez**, normalmente
durante la configuración inicial del celular (o tras un "reseteo de
fábrica"), con este comando desde una PC con `adb` instalado:

```bash
adb shell dpm set-device-owner com.learnunblock.app/.DeviceOwnerReceiver
```

**Requisitos para que ese comando funcione:**
- El celular debe estar recién configurado (sin cuentas de Google
  agregadas todavía), O
- Usar el flujo de "Aprovisionamiento" de Android Enterprise (código QR)

Esto lo abordamos en la Fase 2 — por ahora, la Fase 1 (Screen Pinning)
ya da un bloqueo funcional para la mayoría de los casos de uso.
