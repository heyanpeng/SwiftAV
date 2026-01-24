/**
 * 解码媒体用例
 */
import {
  MediaSource,
  IMediaRepository,
  DecodedVideoData,
  DecodedAudioData,
} from '@swiftav/entities';

export interface DecodeMediaRequest {
  source: MediaSource;
  type: 'video' | 'audio';
}

export type DecodeMediaResult = DecodedVideoData | DecodedAudioData;

export class DecodeMediaUseCase {
  constructor(private mediaRepository: IMediaRepository) {}

  async execute(request: DecodeMediaRequest): Promise<DecodeMediaResult> {
    if (request.type === 'video') {
      return await this.mediaRepository.decodeVideo(request.source);
    } else {
      return await this.mediaRepository.decodeAudio(request.source);
    }
  }
}
