package com.learnunblock.app

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent
import android.widget.Toast

/**
 * Receiver requerido para que la app pueda ser configurada como
 * "Device Owner" (Fase 2).
 *
 * NO necesitas activar esto para que la app funcione en la Fase 1.
 * Solo es necesario si más adelante configuras la app vía ADB con:
 *
 *   adb shell dpm set-device-owner com.learnunblock.app/.DeviceOwnerReceiver
 *
 * Esto habilita Lock Task Mode automático (sin pedir confirmación al
 * usuario cada vez), control de apps permitidas, etc.
 */
class DeviceOwnerReceiver : DeviceAdminReceiver() {

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        Toast.makeText(context, "Learn & Unblock: control parental activado", Toast.LENGTH_SHORT).show()
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        Toast.makeText(context, "Learn & Unblock: control parental desactivado", Toast.LENGTH_SHORT).show()
    }
}
