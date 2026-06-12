/**
 * LEARN & UNBLOCK — Android Bridge
 * Conecta el flujo del juego con el bloqueo nativo de Android
 * (modo kiosko / Lock Task Mode) definido en MainActivity.kt.
 *
 * Solo tiene efecto cuando el juego corre dentro de la app Android
 * (window.AndroidApp existe). En un navegador normal no hace nada.
 */

(function () {
  function hasAndroidBridge() {
    return typeof window.AndroidApp !== 'undefined';
  }

  // Activar bloqueo nativo al iniciar una misión
  const originalStartGame = window.startGame;
  window.startGame = function () {
    if (hasAndroidBridge()) {
      try {
        window.AndroidApp.activarBloqueo();
        console.log('🔒 Bloqueo nativo Android activado');
      } catch (e) {
        console.warn('No se pudo activar el bloqueo nativo:', e);
      }
    }
    if (typeof originalStartGame === 'function') {
      originalStartGame.call(this);
    }
  };

  // Desactivar bloqueo nativo al terminar la misión
  const originalEndGame = window.endGame;
  window.endGame = function () {
    if (hasAndroidBridge()) {
      try {
        window.AndroidApp.desactivarBloqueo();
        console.log('🔓 Bloqueo nativo Android desactivado');
      } catch (e) {
        console.warn('No se pudo desactivar el bloqueo nativo:', e);
      }
    }
    if (typeof originalEndGame === 'function') {
      originalEndGame.call(this);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (hasAndroidBridge()) {
      console.log('🤖 Android Bridge conectado');
    } else {
      console.log('🌐 Ejecutando en navegador (sin bridge nativo)');
    }
  });
})();
