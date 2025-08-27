export class FakeGainNode {
  gain = { value: 1 };
  connect() {}
}
export class FakeBufferSource {
  buffer: AudioBuffer | null = null;
  loop = false;
  private started = false;
  connect() {}
  start() {
    if (this.started) throw new DOMException('InvalidStateError', 'InvalidStateError');
    this.started = true;
  }
  stop() {}
}
export class FakeAudioContext {
  public state: AudioContextState = 'suspended';
  destination = {};
  createGain() { return new FakeGainNode() as unknown as GainNode; }
  createBufferSource() { return new FakeBufferSource() as unknown as AudioBufferSourceNode; }
  async resume() { this.state = 'running'; }
  async decodeAudioData(arr: ArrayBuffer) {
    return { sampleRate: 44100 } as unknown as AudioBuffer;
  }
}
