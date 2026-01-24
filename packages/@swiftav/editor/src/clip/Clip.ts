/**
 * 片段管理
 */

export interface MediaSource {
  type: 'file' | 'url';
  source: File | string;
}

export class Clip {
  id: string;
  startTime: number;
  duration: number;
  source: MediaSource;
  inPoint: number;
  outPoint: number;

  constructor(
    id: string,
    startTime: number,
    duration: number,
    source: MediaSource,
  ) {
    this.id = id;
    this.startTime = startTime;
    this.duration = duration;
    this.source = source;
    this.inPoint = 0;
    this.outPoint = duration;
  }

  /**
   * 裁剪片段
   */
  trim(start: number, end: number): void {
    this.inPoint = Math.max(0, start);
    this.outPoint = Math.min(this.duration, end);
    this.duration = this.outPoint - this.inPoint;
  }

  /**
   * 分割片段
   */
  split(time: number): Clip[] {
    if (time <= this.inPoint || time >= this.outPoint) {
      return [this];
    }

    const firstClip = new Clip(
      `${this.id}-1`,
      this.startTime,
      time - this.startTime,
      this.source,
    );
    firstClip.inPoint = this.inPoint;
    firstClip.outPoint = time;

    const secondClip = new Clip(
      `${this.id}-2`,
      time,
      this.outPoint - time,
      this.source,
    );
    secondClip.inPoint = time;
    secondClip.outPoint = this.outPoint;

    return [firstClip, secondClip];
  }

  /**
   * 移动片段
   */
  move(newStartTime: number): void {
    this.startTime = Math.max(0, newStartTime);
  }

  /**
   * 获取结束时间
   */
  getEndTime(): number {
    return this.startTime + this.duration;
  }
}
