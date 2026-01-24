/**
 * 裁剪片段用例
 */
import { Clip, Track } from '@swiftav/entities';

export interface TrimClipRequest {
  trackId: string;
  clipId: string;
  start: number;
  end: number;
}

export class TrimClipUseCase {
  async execute(
    track: Track,
    request: TrimClipRequest,
  ): Promise<Clip> {
    const clip = track.getClip(request.clipId);
    if (!clip) {
      throw new Error(`Clip ${request.clipId} not found`);
    }

    clip.trim(request.start, request.end);
    return clip;
  }
}
