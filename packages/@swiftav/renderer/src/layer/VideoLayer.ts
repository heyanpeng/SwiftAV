/**
 * 视频图层
 */

import { Layer } from './Layer';

export class VideoLayer extends Layer {
  private frame: VideoFrame | null = null;

  constructor(id: string) {
    super(id, 'video');
  }

  /**
   * 设置视频帧
   */
  setFrame(frame: VideoFrame): void {
    this.frame = frame;
  }

  /**
   * 渲染视频图层
   */
  render(canvas: any): void {
    if (!this.visible || !this.frame) {
      return;
    }
    // TODO: 实现视频帧渲染
  }
}
