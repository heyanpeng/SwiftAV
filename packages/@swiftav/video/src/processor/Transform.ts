/**
 * 视频变换
 */

export interface TransformOptions {
  x?: number;
  y?: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
}

export class Transform {
  /**
   * 应用变换
   */
  transform(frame: VideoFrame, options: TransformOptions): VideoFrame {
    // TODO: 实现变换逻辑
    return frame;
  }

  /**
   * 旋转
   */
  rotate(frame: VideoFrame, angle: number): VideoFrame {
    return this.transform(frame, { rotation: angle });
  }

  /**
   * 缩放
   */
  scale(frame: VideoFrame, scaleX: number, scaleY: number): VideoFrame {
    return this.transform(frame, { scaleX, scaleY });
  }
}
