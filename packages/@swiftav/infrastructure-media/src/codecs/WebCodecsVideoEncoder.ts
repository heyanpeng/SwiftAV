/**
 * WebCodecs 视频编码器封装
 */
export class WebCodecsVideoEncoder {
  private encoder: globalThis.VideoEncoder | null = null;
  private encodedChunks: EncodedVideoChunk[] = [];

  constructor(config: VideoEncoderConfig) {
    this.encoder = new globalThis.VideoEncoder({
      output: (chunk: EncodedVideoChunk) => {
        this.encodedChunks.push(chunk);
      },
      error: (error: Error) => {
        throw error;
      },
    });
    this.encoder.configure(config);
  }

  async encode(frame: VideoFrame): Promise<void> {
    if (!this.encoder) {
      throw new Error('Encoder not initialized');
    }
    this.encoder.encode(frame);
    frame.close();
  }

  async flush(): Promise<EncodedVideoChunk[]> {
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
