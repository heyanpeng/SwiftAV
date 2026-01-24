/**
 * 移除片段用例
 */
import { Track } from '@swiftav/entities';

export interface RemoveClipRequest {
  trackId: string;
  clipId: string;
}

export class RemoveClipUseCase {
  async execute(track: Track, clipId: string): Promise<void> {
    const clip = track.getClip(clipId);
    if (!clip) {
      throw new Error(`Clip ${clipId} not found`);
    }

    track.removeClip(clipId);
  }
}
