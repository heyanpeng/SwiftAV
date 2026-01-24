/**
 * WebCodecs AudioDecoder 封装
 */

export class AudioDecoder {
  private decoder: globalThis.AudioDecoder | null = null;

  constructor() {
    // TODO: 实现 AudioDecoder
  }

  async decode(chunk: EncodedAudioChunk): Promise<AudioData | null> {
    // TODO: 实现解码逻辑
    return null;
  }

  async flush(): Promise<AudioData[]> {
    // TODO: 实现刷新逻辑
    return [];
  }

  close(): void {
    if (this.decoder) {
      this.decoder.close();
      this.decoder = null;
    }
  }
}
