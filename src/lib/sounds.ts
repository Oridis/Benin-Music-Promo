/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SoundType = 'chime' | 'pop' | 'bell' | 'digital';

export interface SoundConfig {
  enabled: boolean;
  theme: SoundType;
  volume: number;
}

export const SOUND_THEMES: { value: SoundType; label: string; description: string }[] = [
  { value: 'chime', label: 'Carillon Béninois', description: 'Une mélodie douce et harmonieuse de trois cloches' },
  { value: 'pop', label: 'Bulle Goutte', description: 'Un son pop discret et rapide, idéal pour le chat' },
  { value: 'bell', label: 'Cloche de Cristal', description: 'Une résonance cristalline et élégante de cloche' },
  { value: 'digital', label: 'Bip Futuriste', description: 'Un double bip numérique et moderne pour la tech' }
];

export const playNotificationSound = (type: SoundType = 'chime', volume: number = 0.1) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const actualVol = Math.max(0, Math.min(1, volume));

    const playChime = () => {
      const now = ctx.currentTime;
      // Chime notes: G5 (783.99 Hz), C6 (1046.50 Hz), E6 (1318.51 Hz)
      const notes = [783.99, 1046.50, 1318.51];
      const delays = [0, 0.08, 0.16];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delays[idx]);
        
        gain.gain.setValueAtTime(0, now + delays[idx]);
        gain.gain.linearRampToValueAtTime(actualVol, now + delays[idx] + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delays[idx] + 0.35);
        
        osc.start(now + delays[idx]);
        osc.stop(now + delays[idx] + 0.4);
      });
    };

    const playPop = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.09);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(actualVol * 1.5, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      
      osc.start(now);
      osc.stop(now + 0.1);
    };

    const playBell = () => {
      const now = ctx.currentTime;
      // Rich crystalline harmonics for a pristine bell sound
      const frequencies = [659.25, 987.77, 1318.51, 1975.53]; // E5, B5, E6, B6
      const gains = [1.0, 0.4, 0.25, 0.1];
      
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(actualVol * gains[idx], now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
        
        osc.start(now);
        osc.stop(now + 0.6);
      });
    };

    const playDigital = () => {
      const now = ctx.currentTime;
      const notes = [932.33, 1864.66]; // A#5 and A#6
      const durations = [0.035, 0.055];
      const startTimes = [0, 0.05];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + startTimes[idx]);
        
        gain.gain.setValueAtTime(0, now + startTimes[idx]);
        gain.gain.linearRampToValueAtTime(actualVol, now + startTimes[idx] + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startTimes[idx] + durations[idx]);
        
        osc.start(now + startTimes[idx]);
        osc.stop(now + startTimes[idx] + durations[idx] + 0.01);
      });
    };

    switch (type) {
      case 'chime':
        playChime();
        break;
      case 'pop':
        playPop();
        break;
      case 'bell':
        playBell();
        break;
      case 'digital':
        playDigital();
        break;
      default:
        playChime();
    }
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};
