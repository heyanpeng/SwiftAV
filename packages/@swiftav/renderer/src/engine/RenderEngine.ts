/**
 * 渲染引擎
 */

import { Layer } from '../layer';

export interface RenderOptions {
  width: number;
  height: number;
  fps?: number;
}

export class RenderEngine {
  private width: number;
  private height: number;
  private fps: number;
  private animationFrameId: number | null = null;

  constructor(options: RenderOptions) {
    this.width = options.width;
    this.height = options.height;
    this.fps = options.fps || 30;
  }

  /**
   * 渲染图层
   */
  render(layers: Layer[], timestamp: number): void {
    // TODO: 实现渲染逻辑
  }

  /**
   * 设置尺寸
   */
  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /**
   * 开始渲染循环
   */
  start(callback: (timestamp: number) => void): void {
    // TODO: 实现渲染循环
  }

  /**
   * 停止渲染循环
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
