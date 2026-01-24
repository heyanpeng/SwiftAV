/**
 * 渲染仓储实现
 */
import {
  IRenderRepository,
  Layer,
  RenderOptions,
  RenderResult,
} from '@swiftav/entities';
import { CanvasKitManager } from '../canvas/CanvasKitManager';
import { RenderPipeline } from '../pipeline/RenderPipeline';

export class RenderRepository implements IRenderRepository {
  private canvasKitManager: CanvasKitManager;
  private renderPipeline: RenderPipeline;
  private previewAnimationFrameId: number | null = null;
  private previewCallback: ((frame: VideoFrame, timestamp: number) => void) | null = null;
  private previewLayers: Layer[] = [];
  private previewOptions: RenderOptions | null = null;
  private previewStartTime: number = 0;

  constructor() {
    this.canvasKitManager = new CanvasKitManager();
    this.renderPipeline = new RenderPipeline();
  }

  async render(
    layers: Layer[],
    options: RenderOptions,
  ): Promise<RenderResult> {
    const canvasKit = await this.canvasKitManager.init();
    if (!canvasKit) {
      throw new Error('CanvasKit not initialized');
    }

    const frames: VideoFrame[] = [];
    const fps = options.fps || 30;
    const frameDuration = 1 / fps;
    const startTime = options.startTime || 0;
    const endTime = options.endTime || 10; // 默认 10 秒
    const totalFrames = Math.ceil((endTime - startTime) * fps);

    // 创建离屏 canvas
    const surface = canvasKit.MakeSurface(options.width, options.height);
    const canvas = surface.getCanvas();

    for (let i = 0; i < totalFrames; i++) {
      const timestamp = startTime + i * frameDuration;
      const frame = await this.renderFrame(layers, timestamp, options);
      if (frame) {
        frames.push(frame);
      }
    }

    surface.delete();
    const duration = frames.length * frameDuration;

    return {
      frames,
      duration,
    };
  }

  async renderFrame(
    layers: Layer[],
    timestamp: number,
    options: RenderOptions,
  ): Promise<VideoFrame | null> {
    const canvasKit = await this.canvasKitManager.init();
    if (!canvasKit) {
      return null;
    }

    // 创建离屏 canvas
    const surface = canvasKit.MakeSurface(options.width, options.height);
    const canvas = surface.getCanvas();

    // 清空画布
    canvas.clear(canvasKit.WHITE);

    // 按 zIndex 排序图层
    const sortedLayers = [...layers]
      .filter((layer) => layer.visible)
      .sort((a, b) => a.zIndex - b.zIndex);

    // 渲染每个图层
    for (const layer of sortedLayers) {
      await this.renderLayer(canvas, canvasKit, layer, timestamp);
    }

    // 从 surface 创建 VideoFrame
    // TODO: 实现从 CanvasKit surface 到 VideoFrame 的转换
    const image = surface.makeImageSnapshot();
    // const frame = await this.imageToVideoFrame(image, options.width, options.height);
    
    surface.delete();
    image.delete();

    // 临时返回 null，实际需要实现 VideoFrame 创建
    return null;
  }

  async preview(
    layers: Layer[],
    options: RenderOptions,
    callback: (frame: VideoFrame, timestamp: number) => void,
  ): Promise<void> {
    this.previewLayers = layers;
    this.previewOptions = options;
    this.previewCallback = callback;
    this.previewStartTime = performance.now() / 1000;

    const renderFrame = async () => {
      if (!this.previewCallback || !this.previewOptions) {
        return;
      }

      const currentTime = performance.now() / 1000;
      const elapsed = currentTime - this.previewStartTime;
      const timestamp = (this.previewOptions.startTime || 0) + elapsed;

      const frame = await this.renderFrame(
        this.previewLayers,
        timestamp,
        this.previewOptions,
      );

      if (frame && this.previewCallback) {
        this.previewCallback(frame, timestamp);
      }

      this.previewAnimationFrameId = requestAnimationFrame(renderFrame);
    };

    this.previewAnimationFrameId = requestAnimationFrame(renderFrame);
  }

  stopPreview(): void {
    if (this.previewAnimationFrameId !== null) {
      cancelAnimationFrame(this.previewAnimationFrameId);
      this.previewAnimationFrameId = null;
    }
    this.previewCallback = null;
    this.previewLayers = [];
    this.previewOptions = null;
  }

  private async renderLayer(
    canvas: any,
    canvasKit: any,
    layer: Layer,
    timestamp: number,
  ): Promise<void> {
    // TODO: 根据图层类型渲染
    // 这里需要根据 layer.type 调用不同的渲染方法
    // 例如：video、text、shape、image
  }
}
