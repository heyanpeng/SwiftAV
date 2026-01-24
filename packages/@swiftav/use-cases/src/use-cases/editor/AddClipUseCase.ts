/**
 * 添加片段用例
 */
import { Clip, Track } from '@swiftav/entities';
import { MediaSource } from '@swiftav/entities';
import { ClipService } from '@swiftav/entities';

export interface AddClipRequest {
  trackId: string;
  clipId: string;
  startTime: number;
  duration: number;
  source: MediaSource;
}

export class AddClipUseCase {
  constructor(private clipService: ClipService) {}

  async execute(
    track: Track,
    request: AddClipRequest,
  ): Promise<Clip> {
    const clip = new Clip(
      request.clipId,
      request.startTime,
      request.duration,
      request.source,
    );

    if (!this.clipService.canAddClipToTrack(track, clip)) {
      throw new Error('Cannot add clip: overlaps with existing clips or track is locked');
    }

    track.addClip(clip);
    return clip;
  }
}
