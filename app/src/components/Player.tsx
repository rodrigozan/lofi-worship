import React, { useEffect, useRef, useState } from 'react';
import { Mixer } from '../audio/mixer';
import { loadAudioBuffer } from '../audio/loader';

export default function Player() {
  const mixerRef = useRef<Mixer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [rain, setRain] = useState(0.4);
  const [lofi, setLofi] = useState(0.8);

  useEffect(() => {
    const m = new Mixer();
    mixerRef.current = m;

    (async () => {
      const [lofiBuf, rainBuf] = await Promise.all([
        loadAudioBuffer(m.ctx, '/audio/lofi.mp3'),
        loadAudioBuffer(m.ctx, '/audio/rain.mp3'),
      ]);
      m.load('lofi', lofiBuf);
      m.load('rain', rainBuf);
      setReady(true);
    })();

    return () => m.stop();
  }, []);

  useEffect(() => {
    if (!mixerRef.current) return;
    mixerRef.current.setLayerVolume('lofi', lofi);
    mixerRef.current.setLayerVolume('rain', rain);
  }, [lofi, rain]);

  async function handlePlay() {
    const m = mixerRef.current!;
    // Gesto do usuário: desbloqueia/resume o contexto
    await m.resumeOnGesture(); // Chrome/Safari exigem gesto p/ áudio com som
    m.play();
    setPlaying(true);
  }

  function handleStop() {
    mixerRef.current!.stop();
    setPlaying(false);
  }

  return (
    <div className="mx-auto max-w-md p-4 rounded-2xl shadow bg-white/80 backdrop-blur">
      <h1 className="text-xl font-semibold mb-2">Lofi + Rain (PoC)</h1>

      <div className="space-y-3 mb-4">
        <label className="block">
          <span className="text-sm">Lofi</span>
          <input type="range" min={0} max={1} step={0.01}
            value={lofi} onChange={(e) => setLofi(parseFloat(e.target.value))}
            className="w-full" />
        </label>
        <label className="block">
          <span className="text-sm">Chuva</span>
          <input type="range" min={0} max={1} step={0.01}
            value={rain} onChange={(e) => setRain(parseFloat(e.target.value))}
            className="w-full" />
        </label>
      </div>

      {!ready && <p>Carregando buffers…</p>}

      <div className="flex gap-3">
        {!playing ? (
          <button
            onClick={handlePlay}
            disabled={!ready}
            className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50">
            Play
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-4 py-2 rounded-xl bg-gray-200">
            Stop
          </button>
        )}
      </div>

      <p className="text-xs mt-3 opacity-70">
        Dica: alguns navegadores bloqueiam autoplay com som. Clique em “Play” para iniciar o áudio.
      </p>
    </div>
  );
}
