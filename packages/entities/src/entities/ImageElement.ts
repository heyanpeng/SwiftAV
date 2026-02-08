import { ResourceElement } from './ResourceElement';
import { Transform } from '../value-objects/Transform';

/**
 * 图片元素
 * 
 * 用于在画布上渲染图片
 * 继承 ResourceElement，需要加载图片资源
 */
export class ImageElement extends ResourceElement {
  readonly type: 'image' = 'image';

  /**
   * 图片源（URL 或 base64）
   */
  src: string;

  /**
   * 图片对象（可选，如果已加载）
   */
  image?: HTMLImageElement | ImageBitmap;

  /**
   * 图片裁剪区域（可选）
   */
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  /**
   * 图片填充模式
   * - 'fill': 填充整个区域（可能变形）
   * - 'contain': 保持比例，完整显示
   * - 'cover': 保持比例，填充区域（可能裁剪）
   * - 'none': 原始大小
   */
  objectFit: 'fill' | 'contain' | 'cover' | 'none';

  /**
   * 图片对象位置（当 objectFit 为 'contain' 或 'cover' 时）
   */
  objectPosition: 'left' | 'center' | 'right' | 'top' | 'bottom' | string;

  /**
   * 是否保持宽高比
   */
  preserveAspectRatio: boolean;

  /**
   * 图片滤镜（可选，CSS filter 字符串）
   */
  filter?: string;

  constructor(
    id: string,
    src: string,
    transformOrX?: Transform | number,
    y?: number,
    width?: number,
    height?: number,
    objectFit: 'fill' | 'contain' | 'cover' | 'none' = 'contain',
    objectPosition: 'left' | 'center' | 'right' | 'top' | 'bottom' | string = 'center',
    preserveAspectRatio: boolean = true,
    crop?: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
    filter?: string,
    rotation?: number,
    opacity?: number,
    visible: boolean = true,
    zIndex: number = 0,
  ) {
    // 如果第一个参数是 Transform，使用它；否则使用单独的参数创建 Transform
    let transform: Transform;
    if (transformOrX instanceof Transform) {
      transform = transformOrX;
    } else {
      const x = transformOrX ?? 0;
      const yPos = y ?? 0;
      const w = width ?? 100;
      const h = height ?? 100;
      const rot = rotation ?? 0;
      const op = opacity ?? 1;
      transform = new Transform(x, yPos, w, h, rot, op);
    }

    super(id, transform, visible, zIndex);
    this.src = src;
    this.objectFit = objectFit;
    this.objectPosition = objectPosition;
    this.preserveAspectRatio = preserveAspectRatio;
    this.crop = crop;
    this.filter = filter;
  }

  /**
   * 更新图片源
   */
  setSrc(src: string): void {
    this.src = src;
    // 清除缓存的图片对象，需要重新加载
    this.image = undefined;
    this.resetResource();
  }

  /**
   * 设置图片对象（用于已加载的图片）
   */
  setImage(image: HTMLImageElement | ImageBitmap): void {
    this.image = image;
    this.setResourceReady();
  }

  /**
   * 设置裁剪区域
   */
  setCrop(
    crop:
      | { x: number; y: number; width: number; height: number }
      | undefined,
  ): void {
    this.crop = crop;
  }

  /**
   * 更新填充模式
   */
  setObjectFit(
    objectFit: 'fill' | 'contain' | 'cover' | 'none',
  ): void {
    this.objectFit = objectFit;
  }

  /**
   * 加载资源（图片）
   */
  protected loadResource(context?: any): void {
    // 如果已经有图片对象，直接标记为 ready
    if (this.image) {
      this.setResourceReady();
      return;
    }

    // 尝试从 context 获取图片（从缓存）
    const imageGetter = context?.imageGetter;
    if (imageGetter) {
      const image = imageGetter(this.src);
      if (image) {
        this.image = image;
        this.setResourceReady();
        return;
      }
    }

    // 如果没有缓存，开始异步加载
    this.setResourceLoading();
    this.loadImage(this.src)
      .then((image) => {
        this.image = image;
        this.setResourceReady();
      })
      .catch((error) => {
        this.setResourceError(
          error instanceof Error
            ? error
            : new Error(`Failed to load image: ${this.src}`),
        );
      });
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
   * 执行具体渲染
   */
  protected doRender(
    canvas: any,
    canvasKit: any,
    context?: {
      imageGetter?: (src: string) => HTMLImageElement | ImageBitmap | null;
    },
  ): void {
    const imageGetter = context?.imageGetter;
    const ck = canvasKit;

    // 获取图片（优先使用元素自带的图片，否则从缓存获取）
    let image: HTMLImageElement | ImageBitmap | null = null;

    if (this.image) {
      image = this.image;
    } else if (imageGetter) {
      image = imageGetter(this.src);
    }

    if (!image) {
      // 图片未加载，跳过本次渲染
      return;
    }

    // 计算绘制区域
    let drawX = 0;
    let drawY = 0;
    let drawWidth = this.width;
    let drawHeight = this.height;

    // 根据 objectFit 调整绘制区域
    if (this.objectFit === 'contain' || this.objectFit === 'cover') {
      const imageAspect = image.width / image.height;
      const elementAspect = this.width / this.height;

      if (
        (this.objectFit === 'contain' && imageAspect > elementAspect) ||
        (this.objectFit === 'cover' && imageAspect < elementAspect)
      ) {
        // 宽度填满
        drawHeight = this.width / imageAspect;
        drawY = (this.height - drawHeight) / 2;
      } else {
        // 高度填满
        drawWidth = this.height * imageAspect;
        drawX = (this.width - drawWidth) / 2;
      }
    } else if (this.objectFit === 'none') {
      drawWidth = image.width;
      drawHeight = image.height;
    }

    // 创建图片画笔
    const paint = new ck.Paint();
    paint.setAntiAlias(true);

    // 如果有裁剪区域
    if (this.crop) {
      const srcRect = ck.XYWHRect(
        this.crop.x,
        this.crop.y,
        this.crop.width,
        this.crop.height,
      );
      const dstRect = ck.XYWHRect(drawX, drawY, drawWidth, drawHeight);

      canvas.drawImageRect(
        image as any, // CanvasKit 的图片类型
        srcRect,
        dstRect,
        paint,
      );
    } else {
      const dstRect = ck.XYWHRect(drawX, drawY, drawWidth, drawHeight);
      canvas.drawImageRect(
        image as any, // CanvasKit 的图片类型
        dstRect,
        paint,
      );
    }
  }
}
