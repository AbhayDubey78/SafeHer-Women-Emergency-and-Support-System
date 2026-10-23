// Web Audio API Service for emergency siren alarm sound generator and fake call ringtone

class AudioService {
  private audioCtx: AudioContext | null = null;
  private sirenOscillator: OscillatorNode | null = null;
  private sirenGainNode: GainNode | null = null;
  private sirenInterval: number | null = null;
  private isSirenActive = false;

  private ringtoneInterval: number | null = null;
  private isRingtoneActive = false;

  private initCtx() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play Emergency Alarm / Siren Sound (Wailing Siren effect)
  public startSiren() {
    if (this.isSirenActive) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      this.isSirenActive = true;
      this.sirenOscillator = this.audioCtx.createOscillator();
      this.sirenGainNode = this.audioCtx.createGain();

      this.sirenOscillator.type = 'sawtooth';
      this.sirenOscillator.frequency.setValueAtTime(600, this.audioCtx.currentTime);

      this.sirenGainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.sirenOscillator.connect(this.sirenGainNode);
      this.sirenGainNode.connect(this.audioCtx.destination);

      this.sirenOscillator.start();

      // Wailing frequency cycle (600Hz to 1200Hz)
      let high = false;
      this.sirenInterval = window.setInterval(() => {
        if (!this.audioCtx || !this.sirenOscillator) return;
        const targetFreq = high ? 600 : 1300;
        this.sirenOscillator.frequency.exponentialRampToValueAtTime(
          targetFreq,
          this.audioCtx.currentTime + 0.6
        );
        high = !high;
      }, 700);
    } catch (err) {
      console.warn('Audio play error:', err);
    }
  }

  public stopSiren() {
    this.isSirenActive = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.sirenOscillator) {
      try {
        this.sirenOscillator.stop();
        this.sirenOscillator.disconnect();
      } catch (e) {
        // ignore
      }
      this.sirenOscillator = null;
    }
  }

  public toggleSiren(): boolean {
    if (this.isSirenActive) {
      this.stopSiren();
      return false;
    } else {
      this.startSiren();
      return true;
    }
  }

  // Simulate Phone Ringtone for Fake Call feature
  public startRingtone() {
    if (this.isRingtoneActive) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      this.isRingtoneActive = true;
      const playBeep = () => {
        if (!this.audioCtx || !this.isRingtoneActive) return;
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';

        osc1.frequency.setValueAtTime(440, this.audioCtx.currentTime); // A4
        osc2.frequency.setValueAtTime(480, this.audioCtx.currentTime); // Standard phone ring dual tone

        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc1.start();
        osc2.start();

        osc1.stop(this.audioCtx.currentTime + 1.8);
        osc2.stop(this.audioCtx.currentTime + 1.8);
      };

      playBeep();
      this.ringtoneInterval = window.setInterval(playBeep, 3000);
    } catch (e) {
      console.warn('Ringtone play error:', e);
    }
  }

  public stopRingtone() {
    this.isRingtoneActive = false;
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  // Play short confirmation click / button ping sound
  public playClickSound() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch (e) {
      // ignore
    }
  }
}

export const audioService = new AudioService();
