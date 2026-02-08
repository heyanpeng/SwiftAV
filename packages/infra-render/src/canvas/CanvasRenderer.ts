/**
 * CanvasKit 渲染器
 * 
 * 负责管理渲染循环和渲染逻辑
 * 纯 JavaScript/TypeScript 实现，不依赖 React
 */

import type {
  CanvasKit,
  Surface,
  Canvas,
  Picture,
  PictureRecorder,
} from './types';
import type { BaseElement, ImageElement } from '@swiftav/entities';

// 向后兼容：RenderElement 作为 BaseElement 的别名
type RenderElement = BaseElement;

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
  private elements: BaseElement[] = [];
  private imageCache: Map<string, HTMLImageElement | ImageBitmap> = new Map();
  private pictureCache: Map<string, Picture> = new Map(); // 元素 Picture 缓存
  private rootPicture: Picture | null = null; // 根 Picture（包含所有元素）

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
   * 设置要渲染的元素列表
   * 
   * @param elements 元素列表
   */
  setElements(elements: BaseElement[]): void {
    // 按 zIndex 排序，确保正确的渲染顺序
    this.elements = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    // 清除 Picture 缓存，需要重新生成
    this.invalidatePictureCache();
  }

  /**
   * 使 Picture 缓存失效
   */
  private invalidatePictureCache(): void {
    // 清理旧的 Picture
    this.pictureCache.forEach((picture) => {
      if (picture && picture.delete) {
        picture.delete();
      }
    });
    this.pictureCache.clear();

    if (this.rootPicture && this.rootPicture.delete) {
      this.rootPicture.delete();
    }
    this.rootPicture = null;
  }

  /**
   * 获取当前元素列表
   */
  getElements(): BaseElement[] {
    return this.elements;
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
    if (!this.isRendering) {
      return;
    }

    try {
      // 如果有自定义渲染回调，优先使用回调
      if (this.renderCallback) {
        this.renderCallback(this.canvas, this.canvasKit);
      } else {
        // 否则使用默认的元素渲染逻辑
        this.renderElements();
      }

      // 刷新 Surface（实际渲染到 canvas）
      this.surface.flush();
    } catch (error) {
      console.error('Canvas render error:', error);
    }
  }

  /**
   * 渲染所有元素（默认渲染逻辑）
   * 
   * 使用 Picture 记录绘制操作，然后绘制到 Surface
   */
  private renderElements(): void {
    // 清空画布
    this.clear();

    // 获取或创建根 Picture（包含所有元素）
    const picture = this.getOrCreateRootPicture();
    if (!picture) {
      return;
    }

    // 在 Surface 的 Canvas 上绘制 Picture
    this.canvas.drawPicture(picture);
  }

  /**
   * 获取或创建根 Picture（包含所有元素）
   */
  private getOrCreateRootPicture(): Picture | null {
    // 如果已有缓存的 Picture，直接返回
    if (this.rootPicture) {
      return this.rootPicture;
    }

    // 获取 Surface 的尺寸
    // CanvasKit Surface 可能有 width() 和 height() 方法，或者需要通过 getCanvas() 获取
    let surfaceWidth = 1920; // 默认宽度
    let surfaceHeight = 1080; // 默认高度
    
    try {
      // 尝试获取 Surface 的尺寸
      if (typeof this.surface.width === 'function') {
        surfaceWidth = this.surface.width();
      } else if (this.surface.width) {
        surfaceWidth = this.surface.width;
      }
      
      if (typeof this.surface.height === 'function') {
        surfaceHeight = this.surface.height();
      } else if (this.surface.height) {
        surfaceHeight = this.surface.height;
      }
    } catch (error) {
      // 如果无法获取尺寸，使用默认值
      console.warn('Failed to get surface dimensions, using defaults:', error);
    }

    // 创建 PictureRecorder 来记录绘制操作
    const ck = this.canvasKit;
    const recorder = ck.PictureRecorder();
    const pictureCanvas = recorder.beginRecording(surfaceWidth, surfaceHeight);

    if (!pictureCanvas) {
      console.error('Failed to create picture canvas');
      return null;
    }

    // 在 Picture Canvas 上绘制所有元素
    for (const element of this.elements) {
      if (!element.visible || element.opacity === 0) {
        continue;
      }

      // 保存当前画布状态
      pictureCanvas.save();

      try {
        // 应用变换（位置、旋转、透明度）
        this.applyElementTransformToCanvas(element, pictureCanvas);

        // 调用元素的 render 方法（多态）
        // 对于 ImageElement，传递图片缓存获取函数作为 context
        const context =
          element.type === 'image'
            ? {
                imageGetter: (src: string) => {
                  const imageElement = element as ImageElement;
                  // 优先使用元素自带的图片，否则从缓存获取
                  if (imageElement.image) {
                    return imageElement.image;
                  }
                  return this.imageCache.get(src) || null;
                },
              }
            : undefined;

        element.render(pictureCanvas, this.canvasKit, context);
      } catch (error) {
        console.error(`Error rendering element ${element.id}:`, error);
      } finally {
        // 恢复画布状态
        pictureCanvas.restore();
      }
    }

    // 结束录制，获取 Picture
    const picture = recorder.finishRecordingAsPicture();
    this.rootPicture = picture;

    return picture;
  }

  /**
   * 获取或创建单个元素的 Picture（用于元素级缓存）
   */
  private getOrCreateElementPicture(element: BaseElement): Picture | null {
    // 检查缓存
    if (this.pictureCache.has(element.id)) {
      return this.pictureCache.get(element.id)!;
    }

    // 创建 PictureRecorder
    const ck = this.canvasKit;
    const recorder = ck.PictureRecorder();
    const pictureCanvas = recorder.beginRecording(
      element.width,
      element.height,
    );

    if (!pictureCanvas) {
      return null;
    }

    // 在 Picture Canvas 上绘制元素
    try {
      // 应用变换
      this.applyElementTransformToCanvas(element, pictureCanvas);

      // 调用元素的 render 方法
      const context =
        element.type === 'image'
          ? {
              imageGetter: (src: string) => {
                const imageElement = element as ImageElement;
                if (imageElement.image) {
                  return imageElement.image;
                }
                return this.imageCache.get(src) || null;
              },
            }
          : undefined;

      element.render(pictureCanvas, this.canvasKit, context);
    } catch (error) {
      console.error(`Error creating picture for element ${element.id}:`, error);
      return null;
    }

    // 结束录制，获取 Picture
    const picture = recorder.finishRecordingAsPicture();
    this.pictureCache.set(element.id, picture);

    return picture;
  }

  /**
   * 应用元素的变换（使用矩阵）
   * 
   * @param element 元素
   * @param canvas 目标 Canvas（可以是 Surface 的 Canvas 或 Picture 的 Canvas）
   */
  private applyElementTransformToCanvas(
    element: BaseElement,
    canvas: Canvas,
  ): void {
    const ck = this.canvasKit;
    const transform = element.transform;

    // 应用变换矩阵
    // CanvasKit 的 concat 方法接受矩阵数组 [a, c, e, b, d, f]
    // 但我们的矩阵格式是 [a, b, c, d, e, f, 0, 0, 1]
    // 需要转换为 CanvasKit 格式
    const matrix = transform.getMatrixArray();
    const canvasKitMatrix = ck.Matrix(
      matrix[0], // a
      matrix[1], // b
      matrix[2], // c
      matrix[3], // d
      matrix[4], // e (tx)
      matrix[5], // f (ty)
    );

    // 应用矩阵变换
    canvas.concat(canvasKitMatrix);

    // 应用透明度
    if (transform.opacity < 1) {
      const paint = new ck.Paint();
      paint.setAlphaf(transform.opacity);
      canvas.saveLayer(paint);
    }
  }


  /**
   * 预加载图片（异步，不阻塞渲染）
   */
  private async preloadImage(src: string): Promise<void> {
    if (this.imageCache.has(src)) {
      return; // 已缓存
    }

    try {
      const image = await this.loadImage(src);
      if (image) {
        this.imageCache.set(src, image);
      }
    } catch (error: unknown) {
      console.error(`Failed to load image ${src}:`, error);
    }
  }

  /**
   * 加载图片
   */
  private loadImage(src: string): Promise<HTMLImageElement | ImageBitmap> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // 尝试转换为 ImageBitmap（性能更好）
        if (typeof createImageBitmap !== 'undefined') {
          createImageBitmap(img)
            .then((bitmap) => resolve(bitmap))
            .catch(() => resolve(img));
        } else {
          resolve(img);
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  /**
   * 预加载元素中的图片
   * 
   * 在设置元素列表时调用，提前加载图片
   */
  async preloadElementImages(elements: BaseElement[]): Promise<void> {
    const imageElements = elements.filter(
      (el) => el.type === 'image',
    ) as ImageElement[];

    await Promise.all(
      imageElements.map((element) => {
        if (!element.image && !this.imageCache.has(element.src)) {
          return this.preloadImage(element.src);
        }
        return Promise.resolve();
      }),
    );
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
    this.elements = [];
    this.imageCache.clear();
    this.invalidatePictureCache();
    // 注意：Surface 的清理应该在外部处理
  }
}
