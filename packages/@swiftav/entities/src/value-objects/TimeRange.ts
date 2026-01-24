/**
 * 时间范围值对象
 */
export class TimeRange {
  readonly start: number;
  readonly end: number;

  constructor(start: number, end: number) {
    if (start < 0) {
      throw new Error('Start time cannot be negative');
    }
    if (end < start) {
      throw new Error('End time must be greater than or equal to start time');
    }
    this.start = start;
    this.end = end;
  }

  /**
   * 获取时长
   */
  getDuration(): number {
    return this.end - this.start;
  }

  /**
   * 判断时间点是否在范围内
   */
  contains(time: number): boolean {
    return time >= this.start && time <= this.end;
  }

  /**
   * 判断时间范围是否重叠
   */
  overlaps(other: TimeRange): boolean {
    return this.start < other.end && this.end > other.start;
  }

  /**
   * 合并时间范围
   */
  merge(other: TimeRange): TimeRange {
    return new TimeRange(
      Math.min(this.start, other.start),
      Math.max(this.end, other.end),
    );
  }

  /**
   * 创建空时间范围
   */
  static empty(): TimeRange {
    return new TimeRange(0, 0);
  }
}
