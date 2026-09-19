// Web Audio API enterprise tone synthesizer for Paytm Autopilot
class SoundSystem {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('paytm_sound_enabled') === 'true';
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('paytm_sound_enabled', String(this.enabled));
    }
    if (this.enabled) {
      this.playTone(520, 'sine', 0.12, 0.04);
    }
    return this.enabled;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.05) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext policy or unsupported
    }
  }

  public playBoot() {
    if (!this.enabled) return;
    [329.63, 440.0, 554.37, 659.25].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.35, 0.04);
      }, idx * 120);
    });
  }

  public playNavigate() {
    this.playTone(680, 'sine', 0.08, 0.03);
  }

  public playAction() {
    this.playTone(440, 'triangle', 0.15, 0.04);
  }

  public playVerified() {
    if (!this.enabled) return;
    [587.33, 880.0].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.28, 0.05);
      }, idx * 100);
    });
  }

  public playEscalation() {
    if (!this.enabled) return;
    [400, 320].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sawtooth', 0.22, 0.04);
      }, idx * 140);
    });
  }
}

export const soundFx = new SoundSystem();
