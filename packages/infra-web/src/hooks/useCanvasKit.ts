/**
 * useCanvasKit Hook
 * 
 * React Hook 用于在组件中使用 CanvasKit
 * 管理 CanvasKit 的加载状态和生命周期
 */

import { useEffect, useRef, useState, type RefObject } from 'react';
import { CanvasKitManager, type CanvasKitContext, type SurfaceOptions } from '@swiftav/infra-render';
import type { CanvasKit, Surface, Canvas } from '@swiftav/infra-render';

/**
 * useCanvasKit Hook 选项
 */
export interface UseCanvasKitOptions {
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
  /**
   * CanvasKit 初始化选项
   */
  initOptions?: {
    wasmPath?: string;
    fontSupport?: boolean;
  };
  /**
   * 准备就绪回调
   */
  onReady?: (context: CanvasKitContext) => void;
  /**
   * 错误回调
   */
  onError?: (error: Error) => void;
}

/**
 * useCanvasKit Hook 返回值
 */
export interface UseCanvasKitReturn {
  /**
   * CanvasKit 实例
   */
  canvasKit: CanvasKit | null;
  /**
   * Surface 实例
   */
  surface: Surface | null;
  /**
   * Canvas 实例
   */
  canvas: Canvas | null;
  /**
   * 是否准备就绪
   */
  isReady: boolean;
  /**
   * 是否正在加载
   */
  isLoading: boolean;
  /**
   * 错误信息
   */
  error: Error | null;
}

/**
 * 在 React 组件中使用 CanvasKit 的 Hook
 * 
 * @param canvasRef Canvas 元素的 ref
 * @param options Hook 选项
 * @returns CanvasKit 相关实例和状态
 */
export function useCanvasKit(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options?: UseCanvasKitOptions
): UseCanvasKitReturn {
  const [canvasKit, setCanvasKit] = useState<CanvasKit | null>(null);
  const [surface, setSurface] = useState<Surface | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 使用 ref 存储清理函数
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;
    let currentSurface: Surface | null = null;

    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 初始化 CanvasKit
        await CanvasKitManager.init(options?.initOptions);

        if (!isMounted) return;

        const ck = CanvasKitManager.getCanvasKit();
        if (!ck) {
          throw new Error('CanvasKit instance is null after initialization');
        }

        setCanvasKit(ck);

        // 等待 canvas 元素可用
        if (!canvasRef.current) {
          // 如果 canvas 还未挂载，等待一下
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        if (!isMounted || !canvasRef.current) {
          return;
        }

        // 创建 Surface
        const surfaceOptions: SurfaceOptions = {
          width: options?.width,
          height: options?.height,
          pixelRatio: options?.pixelRatio,
        };

        currentSurface = CanvasKitManager.createSurface(
          canvasRef.current,
          surfaceOptions
        );

        if (!currentSurface) {
          throw new Error('Failed to create Surface');
        }

        if (!isMounted) {
          currentSurface.delete();
          return;
        }

        setSurface(currentSurface);

        // 获取 Canvas
        const canvasInstance = currentSurface.getCanvas();
        if (!canvasInstance) {
          throw new Error('Failed to get Canvas from Surface');
        }
        setCanvas(canvasInstance);

        setIsReady(true);
        setIsLoading(false);

        // 调用 onReady 回调
        if (options?.onReady) {
          options.onReady({
            canvasKit: ck,
            surface: currentSurface,
            canvas: canvasInstance,
          });
        }
      } catch (err) {
        if (!isMounted) return;

        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setIsLoading(false);
        setIsReady(false);

        // 调用 onError 回调
        if (options?.onError) {
          options.onError(error);
        } else {
          console.error('useCanvasKit error:', error);
        }
      }
    };

    initialize();

    // 清理函数
    cleanupRef.current = () => {
      isMounted = false;
      if (currentSurface) {
        try {
          currentSurface.delete();
        } catch (e) {
          console.warn('Error disposing surface:', e);
        }
        currentSurface = null;
      }
      setSurface(null);
      setCanvas(null);
      setIsReady(false);
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [
    canvasRef,
    options?.width,
    options?.height,
    options?.pixelRatio,
    // 注意：initOptions 和回调函数不应该作为依赖，避免重复初始化
  ]);

  return {
    canvasKit,
    surface,
    canvas,
    isReady,
    isLoading,
    error,
  };
}
