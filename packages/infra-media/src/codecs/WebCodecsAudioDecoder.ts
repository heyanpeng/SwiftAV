/**
 * WebCodecs 音频解码器封装
 */
export class WebCodecsAudioDecoder {
  private decoder: globalThis.AudioDecoder | null = null;

  constructor(config: AudioDecoderConfig) {
    this.decoder = new globalThis.AudioDecoder({
      output: (data: AudioData) => {
        // 输出处理在 decode 方法中处理
      },
      error: (error: Error) => {
        throw error;
      },
    });
    this.decoder.configure(config);
  }

  async decode(chunk: EncodedAudioChunk): Promise<AudioData | null> {
    return new Promise((resolve, reject) => {
      if (!this.decoder) {
        reject(new Error('Decoder not initialized'));
        return;
      }

      // TODO: 实现完整的解码逻辑
      this.decoder.decode(chunk);
      resolve(null);
    });
  }

  async flush(): Promise<AudioData[]> {
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
