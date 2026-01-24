/**
 * 基础轨道
 */

import { Clip } from '../clip';

export type TrackType = 'video' | 'audio';

export abstract class Track {
  id: string;
  type: TrackType;
  clips: Clip[];
  locked: boolean;
  muted: boolean;

  constructor(id: string, type: TrackType) {
    this.id = id;
    this.type = type;
    this.clips = [];
    this.locked = false;
    this.muted = false;
  }

  /**
   * 添加片段
   */
  addClip(clip: Clip): void {
    this.clips.push(clip);
    this.sortClips();
  }

  /**
   * 移除片段
   */
  removeClip(clipId: string): void {
    this.clips = this.clips.filter((clip) => clip.id !== clipId);
  }

  /**
   * 获取片段
   */
  getClip(clipId: string): Clip | undefined {
    return this.clips.find((clip) => clip.id === clipId);
  }

  /**
   * 按开始时间排序片段
   */
  private sortClips(): void {
    this.clips.sort((a, b) => a.startTime - b.startTime);
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
}
