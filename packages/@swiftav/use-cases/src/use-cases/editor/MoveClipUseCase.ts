/**
 * 移动片段用例
 */
import { Clip, Track } from '@swiftav/entities';
import { ClipService } from '@swiftav/entities';

export interface MoveClipRequest {
  trackId: string;
  clipId: string;
  newStartTime: number;
}

export class MoveClipUseCase {
  constructor(private clipService: ClipService) {}

  async execute(
    track: Track,
    request: MoveClipRequest,
  ): Promise<Clip> {
    const clip = track.getClip(request.clipId);
    if (!clip) {
      throw new Error(`Clip ${request.clipId} not found`);
    }

    // 创建临时片段检查是否重叠
    const tempClip = new Clip(
      'temp',
      request.newStartTime,
      clip.duration,
      clip.source,
    );
    tempClip.inPoint = clip.inPoint;
    tempClip.outPoint = clip.outPoint;

    // 移除原片段
    track.removeClip(request.clipId);

    // 检查新位置是否重叠
    if (!this.clipService.canAddClipToTrack(track, tempClip)) {
      // 恢复原片段
      track.addClip(clip);
      throw new Error('Cannot move clip: overlaps with existing clips');
    }

    // 移动到新位置
    clip.move(request.newStartTime);
    track.addClip(clip);

    return clip;
  }
}
