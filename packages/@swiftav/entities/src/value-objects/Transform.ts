/**
 * 变换值对象
 */
export class Transform {
  readonly x: number;
  readonly y: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly rotation: number;

  constructor(
    x: number = 0,
    y: number = 0,
    scaleX: number = 1,
    scaleY: number = 1,
    rotation: number = 0,
  ) {
    this.x = x;
    this.y = y;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.rotation = rotation;
  }

  /**
   * 更新变换
   */
  update(updates: Partial<Transform>): Transform {
    return new Transform(
      updates.x ?? this.x,
      updates.y ?? this.y,
      updates.scaleX ?? this.scaleX,
      updates.scaleY ?? this.scaleY,
      updates.rotation ?? this.rotation,
    );
  }

  /**
   * 创建默认变换
   */
  static identity(): Transform {
    return new Transform(0, 0, 1, 1, 0);
  }
}
