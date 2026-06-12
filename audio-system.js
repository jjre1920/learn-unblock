/**
 * LEARN & UNBLOCK — Audio System
 * Sonidos procedurales con Web Audio API
 * Compatible: Android, iOS, Desktop
 */

class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.initialized = false;
    this.muted = false;
    this.volume = 0.6;
    this.loadVolumeSettings();
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.volume;
      this.initialized = true;
      console.log('✅ Audio Engine inicializado');
    } catch (e) {
      console.warn('⚠️ Web Audio API no disponible:', e);
    }
  }

  playCorrect() {
    if (!this.initialized || this.muted) return;
    const now = this.audioContext.currentTime;
    const duration = 0.4;
    
    const osc1 = this.audioContext.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(600, now);
    osc1.frequency.exponentialRampToValueAtTime(1200, now + duration * 0.6);
    
    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1200, now);
    osc2.frequency.exponentialRampToValueAtTime(2400, now + duration * 0.6);
    
    const env = this.audioContext.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.8, now + 0.05);
    env.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc1.connect(env);
    osc2.connect(env);
    env.connect(this.masterGain);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  playWrong() {
    if (!this.initialized || this.muted) return;
    const now = this.audioContext.currentTime;
    const duration = 0.35;
    
    const osc = this.audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + duration);
    
    const env = this.audioContext.createGain();
    env.gain.setValueAtTime(0.7, now);
    env.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(env);
    env.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  playVictory() {
    if (!this.initialized || this.muted) return;
    const now = this.audioContext.currentTime;
    const notes = [
      { freq: 523.25, time: 0.0 },
      { freq: 659.25, time: 0.15 },
      { freq: 783.99, time: 0.3 },
    ];
    
    notes.forEach(note => {
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = note.freq;
      
      const env = this.audioContext.createGain();
      env.gain.setValueAtTime(0, now + note.time);
      env.gain.linearRampToValueAtTime(0.6, now + note.time + 0.05);
      env.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.25);
      
      osc.connect(env);
      env.connect(this.masterGain);
      
      osc.start(now + note.time);
      osc.stop(now + note.time + 0.25);
    });
  }

  playLevelUp() {
    if (!this.initialized || this.muted) return;
    const now = this.audioContext.currentTime;
    const notes = [
      { freq: 440, delay: 0.0 },
      { freq: 554, delay: 0.1 },
      { freq: 659, delay: 0.2 },
      { freq: 880, delay: 0.3 },
    ];
    
    notes.forEach(note => {
      const osc = this.audioContext.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = note.freq;
      
      const env = this.audioContext.createGain();
      env.gain.setValueAtTime(0, now + note.delay);
      env.gain.linearRampToValueAtTime(0.5, now + note.delay + 0.02);
      env.gain.exponentialRampToValueAtTime(0.01, now + note.delay + 0.15);
      
      osc.connect(env);
      env.connect(this.masterGain);
      
      osc.start(now + note.delay);
      osc.stop(now + note.delay + 0.15);
    });
  }

  playUIBeep() {
    if (!this.initialized || this.muted) return;
    const now = this.audioContext.currentTime;
    const duration = 0.1;
    
    const osc = this.audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1000;
    
    const env = this.audioContext.createGain();
    env.gain.setValueAtTime(0.3, now);
    env.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(env);
    env.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.initialized && this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
    this.saveVolumeSettings();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.initialized && this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
    }
    localStorage.setItem('audio_muted', this.muted);
  }

  saveVolumeSettings() {
    localStorage.setItem('audio_volume', this.volume);
  }

  loadVolumeSettings() {
    const saved = localStorage.getItem('audio_volume');
    if (saved) this.volume = parseFloat(saved);
    this.muted = localStorage.getItem('audio_muted') === 'true';
  }
}

const audioEngine = new AudioEngine();

document.addEventListener('click', () => {
  if (!audioEngine.initialized) audioEngine.init();
}, { once: true });

document.addEventListener('touchstart', () => {
  if (!audioEngine.initialized) audioEngine.init();
}, { once: true });
