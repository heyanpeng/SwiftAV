/**
 * 音频解码器
 */

import { AudioDecoder as CoreAudioDecoder } from '@swiftav/core';

export class AudioDecoder {
  private decoder: CoreAudioDecoder;

  constructor() {
    this.decoder = new CoreAudioDecoder();
  }

  async decode(file: File): Promise<AudioBuffer | null> {
    // TODO: 实现音频文件解码
    return null;
  }

  close(): void {
    this.decoder.close();
  }
}
