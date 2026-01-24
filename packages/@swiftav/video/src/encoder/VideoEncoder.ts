/**
 * 视频编码器
 */

import { VideoEncoder as CoreVideoEncoder } from '@swiftav/core';

export class VideoEncoder {
  private encoder: CoreVideoEncoder;

  constructor() {
    this.encoder = new CoreVideoEncoder();
  }

  async encode(frames: VideoFrame[], format: string = 'mp4'): Promise<Blob | null> {
    // TODO: 实现视频编码
    return null;
  }

  close(): void {
    this.encoder.close();
  }
}
