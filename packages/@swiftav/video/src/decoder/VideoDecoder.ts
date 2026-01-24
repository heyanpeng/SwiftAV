/**
 * 视频解码器
 */

import { VideoDecoder as CoreVideoDecoder } from '@swiftav/core';

export class VideoDecoder {
  private decoder: CoreVideoDecoder;

  constructor() {
    this.decoder = new CoreVideoDecoder();
  }

  async decode(file: File): Promise<VideoFrame[]> {
    // TODO: 实现视频文件解码
    return [];
  }

  close(): void {
    this.decoder.close();
  }
}
