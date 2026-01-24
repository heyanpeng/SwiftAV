/**
 * 渲染仓储接口
 */
import { Layer } from '../entities/Layer';

export interface RenderOptions {
  width: number;
  height: number;
  fps?: number;
  startTime?: number;
  endTime?: number;
}

export interface RenderResult {
  frames: VideoFrame[];
  duration: number;
}

/**
 * 渲染仓储接口
 */
export interface IRenderRepository {
  /**
   * 渲染图层序列
   */
  render(
    layers: Layer[],
    options: RenderOptions,
  ): Promise<RenderResult>;

  /**
   * 渲染单帧
   */
  renderFrame(
    layers: Layer[],
    timestamp: number,
    options: RenderOptions,
  ): Promise<VideoFrame | null>;

  /**
   * 预览渲染（实时）
   */
  preview(
    layers: Layer[],
    options: RenderOptions,
    callback: (frame: VideoFrame, timestamp: number) => void,
  ): Promise<void>;

  /**
   * 停止预览
   */
  stopPreview(): void;
}
