/**
 * CanvasKit 渲染器
 * 
 * 负责管理渲染循环和渲染逻辑
 * 纯 JavaScript/TypeScript 实现，不依赖 React
 */

import type { CanvasKit, Surface, Canvas } from './types';

/**
 * 渲染回调函数类型
 */
export type RenderCallback = (canvas: Canvas, canvasKit: CanvasKit) => void;

/**
 * 渲染器选项
 */
export interface RendererOptions {
  /**
   * 是否自动开始渲染循环
   */
  autoStart?: boolean;
  /**
   * 目标 FPS（帧率）
   */
  targetFPS?: number;
}

/**
 * CanvasKit 渲染器
 * 
 * 管理渲染循环，执行渲染逻辑
 */
export class CanvasRenderer {
  private surface: Surface;
  private canvas: Canvas;
  private canvasKit: CanvasKit;
  private renderCallback: RenderCallback | null = null;
  private animationFrameId: number | null = null;
  private isRendering = false;
  private targetFPS: number;
  private frameInterval: number;
  private lastFrameTime = 0;

  /**
   * 创建渲染器实例
   * 
   * @param surface Surface 实例
   * @param canvas Canvas 实例
   * @param canvasKit CanvasKit 实例
   * @param options 渲染器选项
   */
  constructor(
    surface: Surface,
    canvas: Canvas,
    canvasKit: CanvasKit,
    options?: RendererOptions
  ) {
    this.surface = surface;
    this.canvas = canvas;
    this.canvasKit = canvasKit;
    this.targetFPS = options?.targetFPS || 60;
    this.frameInterval = 1000 / this.targetFPS;

    if (options?.autoStart !== false) {
      this.start();
    }
  }

  /**
   * 设置渲染回调函数
   * 
   * @param callback 渲染回调函数
   */
  setRenderCallback(callback: RenderCallback): void {
    this.renderCallback = callback;
  }

  /**
   * 开始渲染循环
   */
  start(): void {
    if (this.isRendering) {
      return;
    }

    this.isRendering = true;
    this.lastFrameTime = performance.now();
    this.render();
  }

  /**
   * 停止渲染循环
   */
  stop(): void {
    this.isRendering = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * 执行单次渲染
   */
  renderFrame(): void {
    if (!this.isRendering || !this.renderCallback) {
      return;
    }

    try {
      // 调用渲染回调
      this.renderCallback(this.canvas, this.canvasKit);

      // 刷新 Surface（实际渲染到 canvas）
      this.surface.flush();
    } catch (error) {
      console.error('Canvas render error:', error);
    }
  }

  /**
   * 渲染循环（内部方法）
   */
  private render = (): void => {
    if (!this.isRendering) {
      return;
    }

    const currentTime = performance.now();
    const elapsed = currentTime - this.lastFrameTime;

    // 控制帧率
    if (elapsed >= this.frameInterval) {
      this.renderFrame();
      this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
    }

    // 继续下一帧
    this.animationFrameId = requestAnimationFrame(this.render);
  };

  /**
   * 清空画布
   * 
   * @param color 背景颜色（RGBA，0-1 范围）
   */
  clear(color?: [number, number, number, number]): void {
    const bgColor = color || [0, 0, 0, 1];
    this.canvas.clear(this.canvasKit.Color(...bgColor));
  }

  /**
   * 获取 Surface 实例
   */
  getSurface(): Surface {
    return this.surface;
  }

  /**
   * 获取 Canvas 实例
   */
  getCanvas(): Canvas {
    return this.canvas;
  }

  /**
   * 获取 CanvasKit 实例
   */
  getCanvasKit(): CanvasKit {
    return this.canvasKit;
  }

  /**
   * 检查是否正在渲染
   */
  isActive(): boolean {
    return this.isRendering;
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.stop();
    this.renderCallback = null;
    // 注意：Surface 的清理应该在外部处理
  }
}
