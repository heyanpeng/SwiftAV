/**
 * WebCodecs 音频编码器封装
 */
export class WebCodecsAudioEncoder {
  private encoder: globalThis.AudioEncoder | null = null;
  private encodedChunks: EncodedAudioChunk[] = [];

  constructor(config: AudioEncoderConfig) {
    this.encoder = new globalThis.AudioEncoder({
      output: (chunk: EncodedAudioChunk) => {
        this.encodedChunks.push(chunk);
      },
      error: (error: Error) => {
        throw error;
      },
    });
    this.encoder.configure(config);
  }

  async encode(data: AudioData): Promise<void> {
    if (!this.encoder) {
      throw new Error('Encoder not initialized');
    }
    this.encoder.encode(data);
    data.close();
  }

  async flush(): Promise<EncodedAudioChunk[]> {
    if (!this.encoder) {
      return [];
    }
    await this.encoder.flush();
    const chunks = [...this.encodedChunks];
    this.encodedChunks = [];
    return chunks;
  }

  close(): void {
    if (this.encoder) {
      this.encoder.close();
      this.encoder = null;
    }
  }
}
