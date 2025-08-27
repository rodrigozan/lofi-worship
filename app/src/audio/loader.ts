export async function loadAudioBuffer(ctx: AudioContext, url: string) {
  const res = await fetch(url);
  const arr = await res.arrayBuffer();
  return await ctx.decodeAudioData(arr);
}
