/**
 * WebCodecs AudioEncoder 封装
 */

export class AudioEncoder {
  private encoder: globalThis.AudioEncoder | null = null;

  constructor() {
    // TODO: 实现 AudioEncoder
  }

  async encode(data: AudioData): Promise<EncodedAudioChunk | null> {
    // TODO: 实现编码逻辑
    return null;
  }

  async flush(): Promise<EncodedAudioChunk[]> {
    // TODO: 实现刷新逻辑
    return [];
  }

  close(): void {
    if (this.encoder) {
      this.encoder.close();
      this.encoder = null;
    }
  }
}
