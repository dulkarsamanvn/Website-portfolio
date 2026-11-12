import { useCallback, useEffect, useRef, useState } from 'react';

function createKeyboardAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext({ latencyHint: 'interactive' });
  const output = context.createGain();
  output.gain.value = 0;
  output.connect(context.destination);

  // A brief switch click: noisy impact, a low keycap thock, and a softer release.
  const duration = 0.075;
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
  const samples = buffer.getChannelData(0);
  let softenedNoise = 0;
  for (let index = 0; index < samples.length; index += 1) {
    const time = index / context.sampleRate;
    const noise = Math.random() * 2 - 1;
    softenedNoise = softenedNoise * 0.6 + noise * 0.4;
    const impact = Math.exp(-time * 240);
    const release = time >= 0.022 ? Math.exp(-(time - 0.022) * 350) : 0;
    const body = Math.sin(2 * Math.PI * 185 * time) * Math.exp(-time * 95);
    const rattle = Math.sin(2 * Math.PI * 920 * time) * Math.exp(-time * 280);
    const edgeFade = Math.min(time / 0.0004, 1) * Math.min((duration - time) / 0.004, 1);
    samples[index] = (noise * (0.56 * impact + 0.12 * release)
      + softenedNoise * (0.2 * impact + 0.06 * release)
      + body * 0.38 + rattle * 0.08) * edgeFade;
  }

  return { context, output, buffer, voices: new Set(), lastPlayed: -Infinity };
}

export default function useKeyboardSound() {
  const [enabled, setEnabled] = useState(false);
  const [available, setAvailable] = useState(() => (
    typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext)
  ));
  const audioRef = useRef(null);
  const enabledRef = useRef(false);
  const activationRef = useRef(0);

  useEffect(() => () => {
    activationRef.current += 1;
    enabledRef.current = false;
    const audio = audioRef.current;
    audioRef.current = null;
    if (audio && audio.context.state !== 'closed') {
      void audio.context.close().catch(() => {});
    }
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!enabledRef.current || !audio || audio.context.state !== 'running') return;
    if (document.visibilityState === 'hidden') return;
    const now = audio.context.currentTime;
    const hoverTime = performance.now();
    // Keep a fast sweep across the grid from producing a wall of overlapping clicks.
    if (hoverTime - audio.lastPlayed < 45) return;
    audio.lastPlayed = hoverTime;

    const source = audio.context.createBufferSource();
    source.buffer = audio.buffer;
    source.playbackRate.value = 0.97 + Math.random() * 0.06;
    source.connect(audio.output);
    source.onended = () => {
      source.disconnect();
      audio.voices.delete(source);
    };
    source.start(now);
    audio.voices.add(source);
  }, []);

  const toggle = useCallback(async () => {
    if (!available) return;
    const activation = ++activationRef.current;

    if (enabledRef.current) {
      enabledRef.current = false;
      setEnabled(false);
      const audio = audioRef.current;
      if (audio) {
        audio.output.gain.setValueAtTime(0, audio.context.currentTime);
        audio.voices.forEach((source) => source.stop());
        audio.voices.clear();
        void audio.context.suspend().catch(() => {});
      }
      return;
    }

    try {
      // Create and unlock audio only from the visitor's explicit button press.
      const audio = audioRef.current || createKeyboardAudio();
      audioRef.current = audio;
      enabledRef.current = true;
      setEnabled(true);
      await audio.context.resume();
      if (activation !== activationRef.current || !enabledRef.current) return;
      audio.output.gain.setValueAtTime(0.18, audio.context.currentTime);
      audio.lastPlayed = -Infinity;
      play();
    } catch {
      if (activation !== activationRef.current) return;
      enabledRef.current = false;
      setEnabled(false);
      setAvailable(false);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio && audio.context.state !== 'closed') {
        void audio.context.close().catch(() => {});
      }
    }
  }, [available, play]);

  return { enabled, available, toggle, play };
}
