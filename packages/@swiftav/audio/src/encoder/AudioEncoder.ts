/**
 * 音频编码器
 */

import { AudioEncoder as CoreAudioEncoder } from '@swiftav/core';

export class AudioEncoder {
  private encoder: CoreAudioEncoder;

  constructor() {
    this.encoder = new CoreAudioEncoder();
  }

  async encode(buffer: AudioBuffer, format: string = 'mp3'): Promise<Blob | null> {
    // TODO: 实现音频编码
    return null;
  }

  close(): void {
    this.encoder.close();
  }
}
