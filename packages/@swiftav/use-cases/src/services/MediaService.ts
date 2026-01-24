/**
 * 媒体应用服务
 */
import {
  MediaSource,
  IMediaRepository,
  DecodedVideoData,
  DecodedAudioData,
} from '@swiftav/entities';
import {
  ImportMediaUseCase,
  DecodeMediaUseCase,
  ProcessMediaUseCase,
} from '../use-cases/media';

export class MediaService {
  constructor(
    private mediaRepository: IMediaRepository,
    private importMediaUseCase: ImportMediaUseCase,
    private decodeMediaUseCase: DecodeMediaUseCase,
    private processMediaUseCase: ProcessMediaUseCase,
  ) {}

  /**
   * 导入媒体
   */
  async importMedia(source: MediaSource): Promise<{
    type: 'video' | 'audio';
    duration: number;
    metadata: Record<string, unknown>;
  }> {
    return await this.importMediaUseCase.execute({ source });
  }

  /**
   * 解码视频
   */
  async decodeVideo(source: MediaSource): Promise<DecodedVideoData> {
    return await this.decodeMediaUseCase.execute({
      source,
      type: 'video',
    }) as DecodedVideoData;
  }

  /**
   * 解码音频
   */
  async decodeAudio(source: MediaSource): Promise<DecodedAudioData> {
    return await this.decodeMediaUseCase.execute({
      source,
      type: 'audio',
    }) as DecodedAudioData;
  }

  /**
   * 处理媒体
   */
  async processMedia(
    source: MediaSource,
    operations: Array<{
      type: 'crop' | 'resize' | 'filter' | 'volume';
      params: Record<string, unknown>;
    }>,
  ): Promise<Blob> {
    return await this.processMediaUseCase.execute({
      source,
      operations,
    });
  }
}
