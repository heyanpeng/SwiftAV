/**
 * 时间线实体
 */
export class Timeline {
  private _duration: number;
  private _currentTime: number;
  private _zoom: number;

  constructor(duration: number = 0) {
    if (duration < 0) {
      throw new Error('Duration cannot be negative');
    }
    this._duration = duration;
    this._currentTime = 0;
    this._zoom = 1;
  }

  /**
   * 获取时长
   */
  get duration(): number {
    return this._duration;
  }

  /**
   * 获取当前时间
   */
  get currentTime(): number {
    return this._currentTime;
  }

  /**
   * 获取缩放比例
   */
  get zoom(): number {
    return this._zoom;
  }

  /**
   * 跳转到指定时间
   */
  seek(time: number): void {
    if (time < 0) {
      throw new Error('Time cannot be negative');
    }
    this._currentTime = Math.min(time, this._duration);
  }

  /**
   * 设置时间轴缩放
   */
  setZoom(zoom: number): void {
    if (zoom <= 0) {
      throw new Error('Zoom must be greater than 0');
    }
    this._zoom = Math.max(0.1, Math.min(zoom, 10));
  }

  /**
   * 设置时长
   */
  setDuration(duration: number): void {
    if (duration < 0) {
      throw new Error('Duration cannot be negative');
    }
    this._duration = duration;
    if (this._currentTime > this._duration) {
      this._currentTime = this._duration;
    }
  }

  /**
   * 将时间转换为像素位置
   */
  timeToPixels(time: number, pixelsPerSecond: number): number {
    return time * pixelsPerSecond * this._zoom;
  }

  /**
   * 将像素位置转换为时间
   */
  pixelsToTime(pixels: number, pixelsPerSecond: number): number {
    return pixels / (pixelsPerSecond * this._zoom);
  }
}
