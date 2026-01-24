/**
 * 导入媒体用例
 */
import { MediaSource, IMediaRepository } from '@swiftav/entities';

export interface ImportMediaRequest {
  source: MediaSource;
}

export interface ImportMediaResult {
  type: 'video' | 'audio';
  duration: number;
  metadata: Record<string, unknown>;
}

export class ImportMediaUseCase {
  constructor(private mediaRepository: IMediaRepository) {}

  async execute(
    request: ImportMediaRequest,
  ): Promise<ImportMediaResult> {
    // 尝试解码以验证媒体文件
    try {
      await this.mediaRepository.decodeVideo(request.source);
      return {
        type: 'video',
        duration: 0, // TODO: 从解码结果获取
        metadata: {},
      };
    } catch {
      // 如果不是视频，尝试音频
      try {
        await this.mediaRepository.decodeAudio(request.source);
        return {
          type: 'audio',
          duration: 0, // TODO: 从解码结果获取
          metadata: {},
        };
      } catch (error) {
        throw new Error(`Failed to import media: ${error}`);
      }
    }
  }
}
