// Web Audio Ambient Synthesizer: Tạo âm thanh môi trường thư giãn không cần tải file mp3

let ambientCtx: AudioContext | null = null;
let currentSourceNodes: any[] = [];
let masterGain: GainNode | null = null;
let isPlaying = false;
let currentTrackId: AmbientTrackId = 'rain';

export type AmbientTrackId = 'rain' | 'lofi' | 'zen' | 'sakura';

export interface AmbientTrack {
  id: AmbientTrackId;
  name: string;
  japaneseName: string;
  icon: string;
  description: string;
}

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'rain',
    name: 'Mưa Rơi Mái Đền Kyoto',
    japaneseName: '京都の雨音 (Kyoto Rain)',
    icon: '🌧️',
    description: 'Tiếng mưa rơi rả rích trên mái ngói đền cổ giúp xoa dịu tâm trí và kích thích tập trung sâu.',
  },
  {
    id: 'lofi',
    name: 'Quán Cà Phê Tokyo Lofi',
    japaneseName: '東京カフェ (Tokyo Lofi Beats)',
    icon: '🍵',
    description: 'Hợp âm Lofi ấm áp và tiếng xì xào êm dịu của một buổi chiều ngắm phố phường Tokyo.',
  },
  {
    id: 'zen',
    name: 'Khu Vườn Zen & Ống Tre',
    japaneseName: '禅の庭 (Zen Bamboo Garden)',
    icon: '⛩️',
    description: 'Tiếng nước róc rách và giọt nước gõ nhẹ vào ống tre Shishi-odoshi truyền thống.',
  },
  {
    id: 'sakura',
    name: 'Gió Rừng Hoa Anh Đào',
    japaneseName: '桜のそよ風 (Sakura Breeze)',
    icon: '🌸',
    description: 'Tiếng gió xuân nhẹ nhàng lướt qua rặng hoa anh đào nở rộ vùng núi Phú Sĩ.',
  },
];

function getAmbientContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ambientCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      ambientCtx = new AudioContextClass();
      masterGain = ambientCtx.createGain();
      masterGain.gain.setValueAtTime(0.3, ambientCtx.currentTime);
      masterGain.connect(ambientCtx.destination);
    }
  }
  if (ambientCtx && ambientCtx.state === 'suspended') {
    ambientCtx.resume();
  }
  return ambientCtx;
}

export function stopAmbientSound() {
  currentSourceNodes.forEach((node) => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch (e) {}
  });
  currentSourceNodes = [];
  isPlaying = false;
}

export function setAmbientVolume(vol: number) {
  const ctx = getAmbientContext();
  if (ctx && masterGain) {
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), ctx.currentTime);
  }
}

export function playAmbientSound(trackId: AmbientTrackId) {
  const ctx = getAmbientContext();
  if (!ctx || !masterGain) return;

  stopAmbientSound();
  currentTrackId = trackId;
  isPlaying = true;

  if (trackId === 'rain') {
    playRainSynthesizer(ctx, masterGain);
  } else if (trackId === 'lofi') {
    playLofiSynthesizer(ctx, masterGain);
  } else if (trackId === 'zen') {
    playZenGardenSynthesizer(ctx, masterGain);
  } else if (trackId === 'sakura') {
    playSakuraBreezeSynthesizer(ctx, masterGain);
  }
}

// 1. Kyoto Rain Synth (Pink noise + lowpass filter)
function playRainSynthesizer(ctx: AudioContext, destination: GainNode) {
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.11;
    b6 = white * 0.115926;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(900, ctx.currentTime);

  whiteNoise.connect(filter);
  filter.connect(destination);
  whiteNoise.start();

  currentSourceNodes.push(whiteNoise, filter);
}

// 2. Tokyo Lofi Chords Synth (Warm Rhodes-like soft chords loop)
function playLofiSynthesizer(ctx: AudioContext, destination: GainNode) {
  const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23], // G7
  ];

  let chordIdx = 0;
  const loopInterval = 3.2; // seconds per chord

  const playNextChord = () => {
    if (!isPlaying || currentTrackId !== 'lofi') return;
    const currentChord = chords[chordIdx % chords.length];
    chordIdx++;

    currentChord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + loopInterval - 0.1);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + loopInterval);
    });

    const timeout = setTimeout(playNextChord, loopInterval * 1000);
    currentSourceNodes.push({ stop: () => clearTimeout(timeout) });
  };

  playNextChord();
}

// 3. Zen Garden Bamboo & Water (Low sine resonance + periodic water drops)
function playZenGardenSynthesizer(ctx: AudioContext, destination: GainNode) {
  // Constant gentle brook stream
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.04;
  }
  const streamSource = ctx.createBufferSource();
  streamSource.buffer = noiseBuffer;
  streamSource.loop = true;

  const streamFilter = ctx.createBiquadFilter();
  streamFilter.type = 'bandpass';
  streamFilter.frequency.setValueAtTime(600, ctx.currentTime);
  streamFilter.Q.setValueAtTime(2, ctx.currentTime);

  streamSource.connect(streamFilter);
  streamFilter.connect(destination);
  streamSource.start();
  currentSourceNodes.push(streamSource, streamFilter);

  // Periodic Bamboo Water Drop (Suikinkutsu)
  const playBambooDrop = () => {
    if (!isPlaying || currentTrackId !== 'zen') return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);

    const nextDelay = (Math.random() * 2.5 + 2.0) * 1000;
    const timeout = setTimeout(playBambooDrop, nextDelay);
    currentSourceNodes.push({ stop: () => clearTimeout(timeout) });
  };

  playBambooDrop();
}

// 4. Sakura Breeze (Gentle modulating wind)
function playSakuraBreezeSynthesizer(ctx: AudioContext, destination: GainNode) {
  const bufferSize = ctx.sampleRate * 3;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.08;
  }
  const breezeSource = ctx.createBufferSource();
  breezeSource.buffer = noiseBuffer;
  breezeSource.loop = true;

  const breezeFilter = ctx.createBiquadFilter();
  breezeFilter.type = 'bandpass';
  breezeFilter.frequency.setValueAtTime(450, ctx.currentTime);
  breezeFilter.Q.setValueAtTime(1.5, ctx.currentTime);

  // LFO to modulate breeze intensity
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // Slow cycle
  lfoGain.gain.setValueAtTime(250, ctx.currentTime);

  lfo.connect(breezeFilter.frequency);
  breezeSource.connect(breezeFilter);
  breezeFilter.connect(destination);

  breezeSource.start();
  lfo.start();
  currentSourceNodes.push(breezeSource, lfo, breezeFilter);
}
