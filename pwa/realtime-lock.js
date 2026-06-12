/**
 * LEARN & UNBLOCK — Real-time Lock System
 * Bloqueo de navegador durante misión
 * Compatible: Android, iOS, Desktop
 */

class RealtimeLock {
  constructor() {
    this.isLocked = false;
    this.lockType = null; // 'fullscreen', 'tab', 'app'
    this.wakeLock = null;
  }

  /**
   * Activar bloqueo: Fullscreen + Prevent Exit
   */
  async activateLock() {
    if (this.isLocked) return;
    
    try {
      // 1. Fullscreen si es móvil
      if (this.isMobile()) {
        const elem = document.documentElement;
        const req = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
        if (req) {
          await req.call(elem);
          console.log('📱 Fullscreen activado');
        }
      }
      
      // 2. Screen Wake Lock (mantener pantalla encendida)
      if ('wakeLock' in navigator) {
        try {
          this.wakeLock = await navigator.wakeLock.request('screen');
          console.log('💡 Wake Lock adquirido');
        } catch (e) {
          console.warn('Wake Lock no disponible:', e);
        }
      }
      
      // 3. Prevent back/close
      this.isLocked = true;
      window.addEventListener('beforeunload', this.handleBeforeUnload);
      
      console.log('🔒 Sistema de bloqueo activado');
    } catch (e) {
      console.warn('Error activando lock:', e);
    }
  }

  /**
   * Desactivar bloqueo
   */
  async deactivateLock() {
    if (!this.isLocked) return;
    
    try {
      // Salir de fullscreen
      if (document.fullscreenElement) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (exit) await exit.call(document);
      }
      
      // Liberar wake lock
      if (this.wakeLock) {
        await this.wakeLock.release();
        this.wakeLock = null;
      }
      
      this.isLocked = false;
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
      
      console.log('🔓 Sistema de bloqueo desactivado');
    } catch (e) {
      console.warn('Error desactivando lock:', e);
    }
  }

  /**
   * Prevenir cierre de tab/navegador durante misión
   */
  handleBeforeUnload = (e) => {
    if (this.isLocked) {
      e.preventDefault();
      e.returnValue = '⚠️ ¡Espera! Completa la misión primero.';
      return '⚠️ ¡Espera! Completa la misión primero.';
    }
  };

  /**
   * Prevenir botón atrás (Android)
   */
  preventBackButton() {
    window.addEventListener('popstate', (e) => {
      if (this.isLocked) {
        e.preventDefault();
        history.pushState(null, null, location.href);
        console.warn('⚠️ Botón atrás bloqueado durante misión');
      }
    });
  }

  /**
   * Detectar si es móvil
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Sincronizar lock con estado del juego
   */
  syncWithGameState() {
    // Hook en startGame()
    const originalStartGame = window.startGame;
    window.startGame = async function() {
      await realtimeLock.activateLock();
      originalStartGame.call(this);
    };
    
    // Hook en endGame()
    const originalEndGame = window.endGame;
    window.endGame = async function() {
      await realtimeLock.deactivateLock();
      originalEndGame.call(this);
    };
  }
}

// Instancia global
const realtimeLock = new RealtimeLock();

// Inicializar después del DOM
document.addEventListener('DOMContentLoaded', () => {
  realtimeLock.preventBackButton();
  realtimeLock.syncWithGameState();
  console.log('🔐 Real-time Lock System inicializado');
});
