/**
 * LEARN & UNBLOCK — Audio Integration
 * Integración de sonidos en el flujo del juego
 * Se incluye en index.html después de audio-system.js
 */

// Hook: Inicializar audio en primer click/touch
document.addEventListener('DOMContentLoaded', () => {
  console.log('📡 Audio integration loaded');
});

// ═══════════════════════════════════════════════
// HOOKS DEL JUEGO
// ═══════════════════════════════════════════════

// En onShot() cuando acierto
function onShotAudioHook_Correct() {
  audioEngine.playCorrect();
}

// En onShot() cuando fallo
function onShotAudioHook_Wrong() {
  audioEngine.playWrong();
}

// En endGame() / screen-reward
function endGameAudioHook_Victory() {
  audioEngine.playVictory();
}

// En registerAnswer() cuando sube nivel
function levelUpAudioHook() {
  audioEngine.playLevelUp();
}

// UI clicks (botones)
function uiClickAudioHook() {
  audioEngine.playUIBeep();
}

// ═══════════════════════════════════════════════
// CONTROL DE VOLUMEN EN PANEL DE PADRES
// ═══════════════════════════════════════════════

function initAudioControls() {
  const container = document.createElement('div');
  container.className = 'panel';
  container.innerHTML = `
    <div class="panel-title">🔊 Control de Sonido</div>
    <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
      <button id="audio-toggle" class="btn btn-sm" style="background:rgba(0,245,255,.1);color:var(--cyan);border:1px solid var(--cyan);">
        🔊 Sonido ON
      </button>
      <div style="flex:1; min-width:150px;">
        <label style="display:block;margin-bottom:8px;font-size:.65rem;color:rgba(255,255,255,.45);">Volumen</label>
        <input id="audio-slider" type="range" min="0" max="100" value="${Math.round(audioEngine.volume * 100)}" 
          style="width:100%;cursor:pointer;" />
      </div>
      <span id="audio-val" style="font-size:.85rem;color:rgba(255,255,255,.6);min-width:40px;">100%</span>
    </div>
  `;
  
  const panelParent = document.getElementById('screen-parent');
  const firstPanel = panelParent.querySelector('.panel');
  if (firstPanel) {
    firstPanel.parentNode.insertBefore(container, firstPanel);
  }
  
  // Eventos
  document.getElementById('audio-toggle').onclick = () => {
    audioEngine.toggleMute();
    const btn = document.getElementById('audio-toggle');
    btn.textContent = audioEngine.muted ? '🔇 Sonido OFF' : '🔊 Sonido ON';
    btn.style.opacity = audioEngine.muted ? '0.5' : '1';
  };
  
  document.getElementById('audio-slider').oninput = (e) => {
    const val = parseInt(e.target.value) / 100;
    audioEngine.setVolume(val);
    document.getElementById('audio-val').textContent = parseInt(e.target.value) + '%';
  };
  
  // Sincronizar estado visual
  const btn = document.getElementById('audio-toggle');
  btn.style.opacity = audioEngine.muted ? '0.5' : '1';
}

// Llamar después de renderParent()
const originalRenderParent = window.renderParent;
window.renderParent = function() {
  originalRenderParent.call(this);
  initAudioControls();
};
