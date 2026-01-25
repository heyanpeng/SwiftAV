/**
 * CanvasKit 管理器
 * 
 * 负责加载和初始化 CanvasKit WASM，提供 Surface 创建功能
 * 纯 JavaScript/TypeScript 实现，不依赖 React
 */

import type { CanvasKit, Surface, InitOptions, SurfaceOptions } from './types';

// 动态导入 CanvasKit 类型
let CanvasKitModule: any = null;
let canvasKitInstance: CanvasKit | null = null;
let initPromise: Promise<void> | null = null;

/**
 * CanvasKit 管理器（单例模式）
 */
export class CanvasKitManager {
  /**
   * 初始化 CanvasKit（异步加载 WASM）
   * 
   * @param options 初始化选项
   * @returns Promise<void>
   */
  static async init(options?: InitOptions): Promise<void> {
    // 如果已经初始化，直接返回
    if (canvasKitInstance) {
      return;
    }

    // 如果正在初始化，返回现有的 Promise
    if (initPromise) {
      return initPromise;
    }

    // 创建初始化 Promise
    initPromise = (async () => {
      try {
        // 动态导入 canvaskit-wasm
        CanvasKitModule = await import('canvaskit-wasm');
        
        // 加载 WASM 文件（默认使用本地文件）
        // 注意：public 目录下的文件会被 Vite 复制到构建输出的根目录
        const wasmPath = options?.wasmPath || 
          '/canvaskit/canvaskit.wasm';
        
        // 初始化 CanvasKit
        canvasKitInstance = await CanvasKitModule.default({
          locateFile: (file: string) => {
            if (file === 'canvaskit.wasm') {
              return wasmPath;
            }
            return file;
          },
        });

        if (!canvasKitInstance) {
          throw new Error('Failed to initialize CanvasKit');
        }
      } catch (error) {
        canvasKitInstance = null;
        initPromise = null;
        throw new Error(
          `Failed to load CanvasKit: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    })();

    return initPromise;
  }

  /**
   * 获取 CanvasKit 实例
   * 
   * @returns CanvasKit 实例，如果未初始化则返回 null
   */
  static getCanvasKit(): CanvasKit | null {
    return canvasKitInstance;
  }

  /**
   * 创建 Surface（绑定到 HTMLCanvasElement）
   * 
   * @param canvas HTML Canvas 元素
   * @param options Surface 选项
   * @returns Surface 实例，如果创建失败则返回 null
   */
  static createSurface(
    canvas: HTMLCanvasElement,
    options?: SurfaceOptions
  ): Surface | null {
    if (!canvasKitInstance) {
      console.error('CanvasKit is not initialized. Call init() first.');
      return null;
    }

    if (!canvas) {
      console.error('Canvas element is required');
      return null;
    }

    try {
      const width = options?.width || canvas.width || canvas.clientWidth;
      const height = options?.height || canvas.height || canvas.clientHeight;
      const pixelRatio = options?.pixelRatio || window.devicePixelRatio || 1;

      // 设置 canvas 尺寸
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      // 创建 Surface
      const surface = canvasKitInstance.MakeCanvasSurface(canvas);
      
      if (!surface) {
        console.error('Failed to create Surface');
        return null;
      }

      return surface;
    } catch (error) {
      console.error(
        `Failed to create Surface: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    }
  }

  /**
   * 检查 CanvasKit 是否已初始化
   * 
   * @returns true 如果已初始化，否则 false
   */
  static isReady(): boolean {
    return canvasKitInstance !== null;
  }

  /**
   * 清理资源
   * 
   * 注意：这会清理 CanvasKit 实例，之后需要重新调用 init()
   */
  static dispose(): void {
    if (canvasKitInstance) {
      // CanvasKit 没有显式的 dispose 方法，但我们可以清理引用
      canvasKitInstance = null;
      CanvasKitModule = null;
      initPromise = null;
    }
  }
}
