/**
 * WebCodecs VideoDecoder 封装
 */

export class VideoDecoder {
  private decoder: globalThis.VideoDecoder | null = null;

  constructor() {
    // TODO: 实现 VideoDecoder
  }

  async decode(chunk: EncodedVideoChunk): Promise<VideoFrame | null> {
    // TODO: 实现解码逻辑
    return null;
  }

  async flush(): Promise<VideoFrame[]> {
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
