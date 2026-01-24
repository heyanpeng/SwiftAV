/**
 * 时间线领域服务
 */
import { Timeline } from '../entities/Timeline';
import { Track } from '../entities/Track';
import { Clip } from '../entities/Clip';

export class TimelineService {
  /**
   * 计算时间线的总时长（基于所有轨道）
   */
  calculateDuration(tracks: Track[]): number {
    let maxDuration = 0;
    for (const track of tracks) {
      for (const clip of track.clips) {
        const endTime = clip.getEndTime();
        if (endTime > maxDuration) {
          maxDuration = endTime;
        }
      }
    }
    return maxDuration;
  }

  /**
   * 更新时间线时长
   */
  updateTimelineDuration(timeline: Timeline, tracks: Track[]): void {
    const duration = this.calculateDuration(tracks);
    timeline.setDuration(duration);
  }

  /**
   * 检查时间点是否有内容
   */
  hasContentAtTime(tracks: Track[], time: number): boolean {
    return tracks.some((track) => {
      return track.clips.some((clip) => clip.containsTime(time));
    });
  }

  /**
   * 获取指定时间点的所有片段
   */
  getClipsAtTime(tracks: Track[], time: number): Clip[] {
    const clips: Clip[] = [];
    for (const track of tracks) {
      const clip = track.getClipAtTime(time);
      if (clip) {
        clips.push(clip);
      }
    }
    return clips;
  }
}
