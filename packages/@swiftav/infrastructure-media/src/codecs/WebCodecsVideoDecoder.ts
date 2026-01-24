/**
 * WebCodecs 视频解码器封装
 */
export class WebCodecsVideoDecoder {
  private decoder: globalThis.VideoDecoder | null = null;

  constructor(config: VideoDecoderConfig) {
    this.decoder = new globalThis.VideoDecoder({
      output: (frame: VideoFrame) => {
        // 输出处理在 decode 方法中处理
      },
      error: (error: Error) => {
        throw error;
      },
    });
    this.decoder.configure(config);
  }

  async decode(chunk: EncodedVideoChunk): Promise<VideoFrame | null> {
    return new Promise((resolve, reject) => {
      if (!this.decoder) {
        reject(new Error('Decoder not initialized'));
        return;
      }

      let outputFrame: VideoFrame | null = null;
      const originalOutput = this.decoder.decode;
      
      // 临时设置输出回调
      // TODO: 实现完整的解码逻辑
      this.decoder.decode(chunk);
      resolve(outputFrame);
    });
  }

  async flush(): Promise<VideoFrame[]> {
    if (!this.decoder) {
      return [];
    }
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
