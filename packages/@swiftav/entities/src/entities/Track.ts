/**
 * 轨道实体
 */
import { Clip } from './Clip';

export type TrackType = 'video' | 'audio';

export abstract class Track {
  readonly id: string;
  readonly type: TrackType;
  private _clips: Clip[];
  locked: boolean;
  muted: boolean;

  constructor(id: string, type: TrackType) {
    this.id = id;
    this.type = type;
    this._clips = [];
    this.locked = false;
    this.muted = false;
  }

  /**
   * 获取所有片段（只读）
   */
  get clips(): readonly Clip[] {
    return this._clips;
  }

  /**
   * 添加片段
   */
  addClip(clip: Clip): void {
    if (this.locked) {
      throw new Error('Cannot add clip to locked track');
    }
    // 检查片段是否重叠
    if (this.hasOverlap(clip)) {
      throw new Error('Clip overlaps with existing clips');
    }
    this._clips.push(clip);
    this.sortClips();
  }

  /**
   * 移除片段
   */
  removeClip(clipId: string): void {
    if (this.locked) {
      throw new Error('Cannot remove clip from locked track');
    }
    this._clips = this._clips.filter((clip) => clip.id !== clipId);
  }

  /**
   * 获取片段
   */
  getClip(clipId: string): Clip | undefined {
    return this._clips.find((clip) => clip.id === clipId);
  }

  /**
   * 检查片段是否重叠
   */
  private hasOverlap(newClip: Clip): boolean {
    return this._clips.some((clip) => {
      const clipRange = clip.getTimeRange();
      const newClipRange = newClip.getTimeRange();
      return clipRange.overlaps(newClipRange);
    });
  }

  /**
   * 按开始时间排序片段
   */
  private sortClips(): void {
    this._clips.sort((a, b) => a.startTime - b.startTime);
  }

  /**
   * 锁定轨道
   */
  lock(): void {
    this.locked = true;
  }

  /**
   * 解锁轨道
   */
  unlock(): void {
    this.locked = false;
  }

  /**
   * 静音轨道
   */
  mute(): void {
    this.muted = true;
  }

  /**
   * 取消静音
   */
  unmute(): void {
    this.muted = false;
  }

  /**
   * 获取指定时间点的片段
   */
  getClipAtTime(time: number): Clip | undefined {
    return this._clips.find((clip) => clip.containsTime(time));
  }
}
