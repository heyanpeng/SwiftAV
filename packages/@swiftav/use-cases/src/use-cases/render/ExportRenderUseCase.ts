/**
 * 导出渲染用例
 */
import { Layer, IRenderRepository, RenderOptions, RenderResult } from '@swiftav/entities';
import { IMediaRepository } from '@swiftav/entities';

export interface ExportRenderRequest {
  layers: Layer[];
  options: RenderOptions;
  format: 'mp4' | 'webm';
}

export class ExportRenderUseCase {
  constructor(
    private renderRepository: IRenderRepository,
    private mediaRepository: IMediaRepository,
  ) {}

  async execute(request: ExportRenderRequest): Promise<Blob> {
    // 渲染图层序列
    const renderResult = await this.renderRepository.render(
      request.layers,
      request.options,
    );

    // 编码为视频文件
    const blob = await this.mediaRepository.encodeVideo(
      renderResult.frames,
      {
        width: request.options.width,
        height: request.options.height,
        fps: request.options.fps || 30,
      },
    );

    return blob;
  }
}
