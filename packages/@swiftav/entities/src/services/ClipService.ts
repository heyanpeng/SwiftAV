/**
 * 片段领域服务
 */
import { Clip } from '../entities/Clip';
import { Track } from '../entities/Track';
import { TimeRange } from '../value-objects/TimeRange';

export class ClipService {
  /**
   * 检查片段是否可以添加到轨道
   */
  canAddClipToTrack(track: Track, clip: Clip): boolean {
    if (track.locked) {
      return false;
    }
    // 检查是否重叠
    return !track.clips.some((existingClip) => {
      const clipRange = clip.getTimeRange();
      const existingRange = existingClip.getTimeRange();
      return clipRange.overlaps(existingRange);
    });
  }

  /**
   * 查找重叠的片段
   */
  findOverlappingClips(track: Track, clip: Clip): Clip[] {
    const clipRange = clip.getTimeRange();
    return track.clips.filter((existingClip) => {
      const existingRange = existingClip.getTimeRange();
      return clipRange.overlaps(existingRange);
    });
  }

  /**
   * 在时间范围内查找所有片段
   */
  findClipsInRange(track: Track, range: TimeRange): Clip[] {
    return track.clips.filter((clip) => {
      const clipRange = clip.getTimeRange();
      return clipRange.overlaps(range);
    });
  }

  /**
   * 计算片段之间的间隙
   */
  calculateGap(clip1: Clip, clip2: Clip): number {
    if (clip1.getEndTime() > clip2.startTime) {
      return 0; // 重叠或相邻
    }
    return clip2.startTime - clip1.getEndTime();
  }
}
