/**
 * 项目实体
 */
import { Timeline } from './Timeline';
import { Track } from './Track';

export class Project {
  readonly id: string;
  readonly name: string;
  readonly timeline: Timeline;
  private _tracks: Track[];
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(id: string, name: string, duration: number = 0) {
    this.id = id;
    this.name = name;
    this.timeline = new Timeline(duration);
    this._tracks = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * 获取所有轨道（只读）
   */
  get tracks(): readonly Track[] {
    return this._tracks;
  }

  /**
   * 添加轨道
   */
  addTrack(track: Track): void {
    if (this._tracks.some((t) => t.id === track.id)) {
      throw new Error('Track with same ID already exists');
    }
    this._tracks.push(track);
    this.updateDuration();
    this.updatedAt = new Date();
  }

  /**
   * 移除轨道
   */
  removeTrack(trackId: string): void {
    this._tracks = this._tracks.filter((track) => track.id !== trackId);
    this.updateDuration();
    this.updatedAt = new Date();
  }

  /**
   * 获取轨道
   */
  getTrack(trackId: string): Track | undefined {
    return this._tracks.find((track) => track.id === trackId);
  }

  /**
   * 更新项目时长（基于所有轨道）
   */
  private updateDuration(): void {
    let maxDuration = 0;
    for (const track of this._tracks) {
      for (const clip of track.clips) {
        const endTime = clip.getEndTime();
        if (endTime > maxDuration) {
          maxDuration = endTime;
        }
      }
    }
    this.timeline.setDuration(maxDuration);
  }

  /**
   * 更新名称
   */
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Project name cannot be empty');
    }
    this.updatedAt = new Date();
  }
}
