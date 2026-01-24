/**
 * 编辑操作
 */

import { Clip } from '../clip';
import { Track } from '../track';

export class Operations {
  /**
   * 复制片段
   */
  copyClip(clip: Clip): Clip {
    const newClip = new Clip(
      `${clip.id}-copy`,
      clip.startTime,
      clip.duration,
      clip.source,
    );
    newClip.inPoint = clip.inPoint;
    newClip.outPoint = clip.outPoint;
    return newClip;
  }

  /**
   * 删除片段
   */
  deleteClip(track: Track, clipId: string): void {
    track.removeClip(clipId);
  }

  /**
   * 移动片段
   */
  moveClip(clip: Clip, newStartTime: number): void {
    clip.move(newStartTime);
  }

  /**
   * 分割片段
   */
  splitClip(track: Track, clipId: string, time: number): void {
    const clip = track.getClip(clipId);
    if (!clip) {
      return;
    }

    const [firstClip, secondClip] = clip.split(time);
    track.removeClip(clipId);
    track.addClip(firstClip);
    if (secondClip) {
      track.addClip(secondClip);
    }
  }
}
