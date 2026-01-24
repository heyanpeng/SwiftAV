/**
 * 分割片段用例
 */
import { Clip, Track } from '@swiftav/entities';

export interface SplitClipRequest {
  trackId: string;
  clipId: string;
  time: number;
}

export class SplitClipUseCase {
  async execute(
    track: Track,
    request: SplitClipRequest,
  ): Promise<Clip[]> {
    const clip = track.getClip(request.clipId);
    if (!clip) {
      throw new Error(`Clip ${request.clipId} not found`);
    }

    const absoluteTime = clip.startTime + request.time;
    const [firstClip, secondClip] = clip.split(absoluteTime);

    // 移除原片段
    track.removeClip(request.clipId);

    // 添加分割后的片段
    track.addClip(firstClip);
    track.addClip(secondClip);

    return [firstClip, secondClip];
  }
}
