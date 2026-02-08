/**
 * CanvasKit 相关类型定义
 */

// CanvasKit 类型（从 canvaskit-wasm 导入）
export type CanvasKit = any; // 实际类型从 canvaskit-wasm 获取
export type Surface = any;
export type Canvas = any;
export type Picture = any; // CanvasKit Picture，用于记录绘制操作
export type PictureRecorder = any; // CanvasKit PictureRecorder，用于创建 Picture

/**
 * CanvasKit 初始化选项
 */
export interface InitOptions {
  /**
   * WASM 文件路径（可选，默认使用 CDN）
   */
  wasmPath?: string;
  /**
   * 是否启用字体支持
   */
  fontSupport?: boolean;
}

/**
 * Surface 创建选项
 */
export interface SurfaceOptions {
  /**
   * 画布宽度（像素）
   */
  width?: number;
  /**
   * 画布高度（像素）
   */
  height?: number;
  /**
   * 像素比（devicePixelRatio）
   */
  pixelRatio?: number;
}

/**
 * CanvasKit 渲染上下文
 */
export interface CanvasKitContext {
  /**
   * CanvasKit 实例
   */
  canvasKit: CanvasKit;
  /**
   * Surface 实例
   */
  surface: Surface;
  /**
   * Canvas 实例
   */
  canvas: Canvas;
}
