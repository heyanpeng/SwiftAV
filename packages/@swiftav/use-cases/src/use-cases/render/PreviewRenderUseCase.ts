/**
 * 预览渲染用例
 */
import { Layer, IRenderRepository, RenderOptions } from '@swiftav/entities';

export interface PreviewRenderRequest {
  layers: Layer[];
  options: RenderOptions;
}

export class PreviewRenderUseCase {
  constructor(private renderRepository: IRenderRepository) {}

  async execute(
    request: PreviewRenderRequest,
    callback: (frame: VideoFrame, timestamp: number) => void,
  ): Promise<void> {
    await this.renderRepository.preview(
      request.layers,
      request.options,
      callback,
    );
  }

  stop(): void {
    this.renderRepository.stopPreview();
  }
}
