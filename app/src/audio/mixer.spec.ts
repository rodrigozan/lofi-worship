import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Mixer } from './mixer';
import { FakeAudioContext } from '../../test/mocks/audio';

vi.stubGlobal('AudioContext', FakeAudioContext as any);

describe('Mixer', () => {
  let m: Mixer;
  beforeEach(() => { m = new Mixer(); });

  it('ajusta volumes das camadas', () => {
    m.setLayerVolume('lofi', 0.5);
    m.setLayerVolume('rain', 0.2);
    expect(m.gainsValues).toEqual({ lofi: 0.5, rain: 0.2 });
  });

  it('resume no gesto do usuário', async () => {
    expect(m.state).toBe('suspended');
    await m.resumeOnGesture();
    expect(m.state).toBe('running'); // resume() do AudioContext
  });

  it('recria BufferSource a cada play (one-shot)', () => {
    // carrega "buffers" fake:
    m.load('lofi', {} as AudioBuffer);
    m.load('rain', {} as AudioBuffer);

    m.play();
    const firstCount = m.sourceCount;
    m.stop();
    m.play();
    const secondCount = m.sourceCount;

    expect(firstCount).toBeGreaterThan(0);
    expect(secondCount).toBeGreaterThan(0);
    // Se tentasse reusar o mesmo node, estouraria InvalidStateError
  });
});
