/**
 * WebCodecs VideoEncoder 封装
 */

export class VideoEncoder {
  private encoder: globalThis.VideoEncoder | null = null;

  constructor() {
    // TODO: 实现 VideoEncoder
  }

  async encode(frame: VideoFrame): Promise<EncodedVideoChunk | null> {
    // TODO: 实现编码逻辑
    return null;
  }

  async flush(): Promise<EncodedVideoChunk[]> {
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
