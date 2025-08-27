export type Layer = 'lofi' | 'rain';

export class Mixer {
  ctx: AudioContext;
  master: GainNode;
  gains: Record<Layer, GainNode>;
  buffers: Partial<Record<Layer, AudioBuffer>>;
  sources: Partial<Record<Layer, AudioBufferSourceNode>>;

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 1.0;
    this.master.connect(this.ctx.destination);

    this.gains = {
      lofi: this.ctx.createGain(),
      rain: this.ctx.createGain(),
    };
    this.gains.lofi.gain.value = 0.8;
    this.gains.rain.gain.value = 0.4;

    this.gains.lofi.connect(this.master);
    this.gains.rain.connect(this.master);

    this.buffers = {};
    this.sources = {};
  }

  setLayerVolume(layer: Layer, v: number) {
    this.gains[layer].gain.value = v;
  }

  load(layer: Layer, buffer: AudioBuffer) {
    this.buffers[layer] = buffer;
  }

  private makeSource(layer: Layer) {
    const src = this.ctx.createBufferSource(); // cria um AudioBufferSourceNode
    src.buffer = this.buffers[layer]!;
    src.loop = true;
    src.connect(this.gains[layer]); // conecta na trilha de ganho
    return src;
  }

  play() {
    // (re)cria sources a cada play, pois BufferSource é one-shot
    Object.keys(this.buffers).forEach((k) => {
      const layer = k as Layer;
      if (!this.buffers[layer]) return;
      const s = this.makeSource(layer);
      this.sources[layer] = s;
      s.start(0);
    });
  }

  stop() {
    Object.values(this.sources).forEach((s) => s?.stop());
    this.sources = {};
  }

  async resumeOnGesture() {
    if (this.ctx.state !== 'running') {
      await this.ctx.resume();
    }
  }
}
