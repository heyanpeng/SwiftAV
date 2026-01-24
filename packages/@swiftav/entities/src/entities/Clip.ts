/**
 * 片段实体
 */
import { MediaSource } from '../value-objects/MediaSource';
import { TimeRange } from '../value-objects/TimeRange';

export class Clip {
  readonly id: string;
  startTime: number;
  duration: number;
  readonly source: MediaSource;
  inPoint: number;
  outPoint: number;

  constructor(
    id: string,
    startTime: number,
    duration: number,
    source: MediaSource,
  ) {
    if (duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }
    this.id = id;
    this.startTime = Math.max(0, startTime);
    this.duration = duration;
    this.source = source;
    this.inPoint = 0;
    this.outPoint = duration;
  }

  /**
   * 裁剪片段
   */
  trim(start: number, end: number): void {
    if (start < 0 || end < start) {
      throw new Error('Invalid trim range');
    }
    this.inPoint = Math.max(0, Math.min(start, this.duration));
    this.outPoint = Math.min(this.duration, Math.max(end, this.inPoint));
    this.duration = this.outPoint - this.inPoint;
  }

  /**
   * 分割片段
   */
  split(time: number): Clip[] {
    const relativeTime = time - this.startTime;
    if (relativeTime <= this.inPoint || relativeTime >= this.outPoint) {
      return [this];
    }

    const firstClip = new Clip(
      `${this.id}-1`,
      this.startTime,
      relativeTime - this.startTime,
      this.source,
    );
    firstClip.inPoint = this.inPoint;
    firstClip.outPoint = relativeTime;

    const secondClip = new Clip(
      `${this.id}-2`,
      time,
      this.outPoint - relativeTime,
      this.source,
    );
    secondClip.inPoint = relativeTime;
    secondClip.outPoint = this.outPoint;

    return [firstClip, secondClip];
  }

  /**
   * 移动片段
   */
  move(newStartTime: number): void {
    if (newStartTime < 0) {
      throw new Error('Start time cannot be negative');
    }
    this.startTime = newStartTime;
  }

  /**
   * 获取结束时间
   */
  getEndTime(): number {
    return this.startTime + this.duration;
  }

  /**
   * 获取时间范围
   */
  getTimeRange(): TimeRange {
    return new TimeRange(this.startTime, this.getEndTime());
  }

  /**
   * 判断时间点是否在片段内
   */
  containsTime(time: number): boolean {
    return time >= this.startTime && time <= this.getEndTime();
  }
}
