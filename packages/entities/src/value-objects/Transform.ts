/**
 * Transform 值对象
 * 
 * 使用 3x3 变换矩阵表示元素的变换信息
 * 矩阵格式：[a, c, e, b, d, f, 0, 0, 1] (行优先)
 * 
 * 矩阵结构：
 * [a  c  e]
 * [b  d  f]
 * [0  0  1]
 * 
 * 其中：
 * - a, b, c, d: 旋转和缩放
 * - e, f: 平移
 */
export class Transform {
  /**
   * 变换矩阵（3x3，按行优先顺序存储为 9 个元素）
   * [a, c, e, b, d, f, 0, 0, 1]
   */
  readonly matrix: Float32Array;

  /**
   * 宽度（像素）
   */
  readonly width: number;

  /**
   * 高度（像素）
   */
  readonly height: number;

  /**
   * 透明度（0-1）
   */
  readonly opacity: number;

  /**
   * 变换原点 X（0-1，相对于元素宽度）
   * 0 = 左边缘，0.5 = 中心，1 = 右边缘
   */
  readonly anchorX: number;

  /**
   * 变换原点 Y（0-1，相对于元素高度）
   * 0 = 上边缘，0.5 = 中心，1 = 下边缘
   */
  readonly anchorY: number;

  constructor(
    matrixOrX?: Float32Array | number,
    yOrMatrix?: number | Float32Array,
    width?: number,
    height?: number,
    rotation?: number,
    opacity: number = 1,
    scaleX?: number,
    scaleY?: number,
    anchorX: number = 0.5,
    anchorY: number = 0.5,
  ) {
    // 支持两种构造方式：
    // 1. 直接传入矩阵
    // 2. 传入位置、大小、旋转等参数，自动构建矩阵

    if (matrixOrX instanceof Float32Array) {
      // 方式1：直接使用矩阵
      if (matrixOrX.length !== 9) {
        throw new Error('Matrix must have 9 elements');
      }
      this.matrix = new Float32Array(matrixOrX);
      this.width = (yOrMatrix as number) ?? 100;
      this.height = width ?? 100;
      this.opacity = opacity;
      this.anchorX = anchorX;
      this.anchorY = anchorY;
    } else {
      // 方式2：从参数构建矩阵
      const x = matrixOrX ?? 0;
      const y = (yOrMatrix as number) ?? 0;
      this.width = width ?? 100;
      this.height = height ?? 100;
      const rot = rotation ?? 0;
      this.opacity = opacity;
      const sx = scaleX ?? 1;
      const sy = scaleY ?? 1;
      this.anchorX = anchorX;
      this.anchorY = anchorY;

      if (this.width <= 0 || this.height <= 0) {
        throw new Error('Width and height must be greater than 0');
      }
      if (this.opacity < 0 || this.opacity > 1) {
        throw new Error('Opacity must be between 0 and 1');
      }
      if (sx <= 0 || sy <= 0) {
        throw new Error('Scale must be greater than 0');
      }

      // 构建变换矩阵
      // 变换顺序：T(x,y) * R(θ) * S(sx,sy) * T(-anchorX*width, -anchorY*height)
      // 矩阵乘法顺序：从右到左

      const anchorOffsetX = -this.width * this.anchorX;
      const anchorOffsetY = -this.height * this.anchorY;

      // 旋转角度（转换为弧度）
      const rad = (rot * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      // 计算组合矩阵
      // 先计算 S * T(-anchor)
      // [sx  0   0]   [1  0  -anchorX*width]   [sx  0   -sx*anchorX*width]
      // [0   sy  0] * [0  1  -anchorY*height] = [0   sy  -sy*anchorY*height]
      // [0   0   1]   [0  0   1              ]   [0   0   1                ]

      // 然后计算 R * (S * T(-anchor))
      // [cos  -sin  0]   [sx  0   -sx*anchorX*width]   [cos*sx  -sin*sy  -cos*sx*anchorX*width + sin*sy*anchorY*height]
      // [sin  cos   0] * [0   sy  -sy*anchorY*height] = [sin*sx  cos*sy   -sin*sx*anchorX*width - cos*sy*anchorY*height]
      // [0    0     1]   [0   0   1                  ]   [0       0       1                                        ]

      // 最后计算 T(x,y) * (R * S * T(-anchor))
      const a = cos * sx;
      const b = sin * sx;
      const c = -sin * sy;
      const d = cos * sy;
      const e =
        x - cos * sx * anchorOffsetX + sin * sy * anchorOffsetY;
      const f =
        y - sin * sx * anchorOffsetX - cos * sy * anchorOffsetY;

      this.matrix = new Float32Array([
        a, // a
        b, // b
        c, // c
        d, // d
        e, // e (tx)
        f, // f (ty)
        0, // 0
        0, // 0
        1, // 1
      ]);
    }
  }

  /**
   * 获取矩阵的 CanvasKit 格式（9 个元素的数组）
   */
  getMatrixArray(): number[] {
    return Array.from(this.matrix);
  }

  /**
   * 获取矩阵的 Float32Array（用于 CanvasKit）
   */
  getMatrixFloat32Array(): Float32Array {
    return new Float32Array(this.matrix);
  }

  /**
   * 从矩阵中提取位置
   */
  get x(): number {
    return this.matrix[4]; // e
  }

  get y(): number {
    return this.matrix[5]; // f
  }

  /**
   * 从矩阵中提取旋转角度（度）
   */
  get rotation(): number {
    const a = this.matrix[0];
    const b = this.matrix[1];
    return (Math.atan2(b, a) * 180) / Math.PI;
  }

  /**
   * 从矩阵中提取缩放
   */
  get scaleX(): number {
    const a = this.matrix[0];
    const b = this.matrix[1];
    return Math.sqrt(a * a + b * b);
  }

  get scaleY(): number {
    const c = this.matrix[2];
    const d = this.matrix[3];
    return Math.sqrt(c * c + d * d);
  }

  /**
   * 创建新的 Transform，更新位置
   */
  withPosition(x: number, y: number): Transform {
    const newMatrix = new Float32Array(this.matrix);
    newMatrix[4] = x; // e
    newMatrix[5] = y; // f
    return new Transform(
      newMatrix,
      this.width,
      this.height,
      undefined,
      this.opacity,
      undefined,
      undefined,
      this.anchorX,
      this.anchorY,
    );
  }

  /**
   * 创建新的 Transform，更新大小
   */
  withSize(width: number, height: number): Transform {
    // 需要重新计算矩阵以保持相同的视觉位置和旋转
    const scaleX = this.scaleX;
    const scaleY = this.scaleY;
    const rotation = this.rotation;
    const x = this.x;
    const y = this.y;

    return new Transform(
      x,
      y,
      width,
      height,
      rotation,
      this.opacity,
      scaleX,
      scaleY,
      this.anchorX,
      this.anchorY,
    );
  }

  /**
   * 创建新的 Transform，更新旋转角度
   */
  withRotation(rotation: number): Transform {
    const x = this.x;
    const y = this.y;
    const scaleX = this.scaleX;
    const scaleY = this.scaleY;

    return new Transform(
      x,
      y,
      this.width,
      this.height,
      rotation,
      this.opacity,
      scaleX,
      scaleY,
      this.anchorX,
      this.anchorY,
    );
  }

  /**
   * 创建新的 Transform，更新透明度
   */
  withOpacity(opacity: number): Transform {
    return new Transform(
      this.matrix,
      this.width,
      this.height,
      undefined,
      opacity,
      undefined,
      undefined,
      this.anchorX,
      this.anchorY,
    );
  }

  /**
   * 创建新的 Transform，更新缩放
   */
  withScale(scaleX: number, scaleY?: number): Transform {
    const x = this.x;
    const y = this.y;
    const rotation = this.rotation;

    return new Transform(
      x,
      y,
      this.width,
      this.height,
      rotation,
      this.opacity,
      scaleX,
      scaleY ?? scaleX,
      this.anchorX,
      this.anchorY,
    );
  }

  /**
   * 创建新的 Transform，更新变换原点
   */
  withAnchor(anchorX: number, anchorY: number): Transform {
    const x = this.x;
    const y = this.y;
    const rotation = this.rotation;
    const scaleX = this.scaleX;
    const scaleY = this.scaleY;

    return new Transform(
      x,
      y,
      this.width,
      this.height,
      rotation,
      this.opacity,
      scaleX,
      scaleY,
      anchorX,
      anchorY,
    );
  }

  /**
   * 创建新的 Transform，应用增量变换
   */
  translate(deltaX: number, deltaY: number): Transform {
    return this.withPosition(this.x + deltaX, this.y + deltaY);
  }

  /**
   * 创建新的 Transform，应用增量旋转
   */
  rotate(deltaRotation: number): Transform {
    return this.withRotation(this.rotation + deltaRotation);
  }

  /**
   * 创建新的 Transform，应用增量缩放
   */
  scale(deltaScaleX: number, deltaScaleY?: number): Transform {
    return this.withScale(
      this.scaleX * deltaScaleX,
      deltaScaleY ? this.scaleY * deltaScaleY : undefined,
    );
  }

  /**
   * 矩阵相乘（组合变换）
   * 
   * @param other 另一个变换矩阵
   * @returns 新的 Transform，表示 this * other
   */
  multiply(other: Transform): Transform {
    const m1 = this.matrix;
    const m2 = other.matrix;

    // 矩阵乘法
    const a = m1[0] * m2[0] + m1[2] * m2[1];
    const b = m1[1] * m2[0] + m1[3] * m2[1];
    const c = m1[0] * m2[2] + m1[2] * m2[3];
    const d = m1[1] * m2[2] + m1[3] * m2[3];
    const e = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
    const f = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];

    const newMatrix = new Float32Array([a, b, c, d, e, f, 0, 0, 1]);

    return new Transform(
      newMatrix,
      this.width,
      this.height,
      undefined,
      this.opacity,
      undefined,
      undefined,
      this.anchorX,
      this.anchorY,
    );
  }

  /**
   * 获取实际渲染宽度（考虑缩放）
   */
  getRenderWidth(): number {
    return this.width * this.scaleX;
  }

  /**
   * 获取实际渲染高度（考虑缩放）
   */
  getRenderHeight(): number {
    return this.height * this.scaleY;
  }

  /**
   * 获取变换原点的实际坐标
   */
  getAnchorPoint(): { x: number; y: number } {
    return {
      x: this.x + this.width * this.anchorX,
      y: this.y + this.height * this.anchorY,
    };
  }

  /**
   * 创建单位矩阵（无变换）
   */
  static identity(): Transform {
    return new Transform(
      new Float32Array([1, 0, 0, 1, 0, 0, 0, 0, 1]),
      100,
      100,
    );
  }

  /**
   * 创建默认的 Transform
   */
  static default(): Transform {
    return Transform.identity();
  }

  /**
   * 从对象创建 Transform（用于反序列化）
   */
  static fromObject(data: {
    matrix?: number[];
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    opacity?: number;
    scaleX?: number;
    scaleY?: number;
    anchorX?: number;
    anchorY?: number;
  }): Transform {
    if (data.matrix && Array.isArray(data.matrix) && data.matrix.length === 9) {
      // 如果有矩阵，直接使用
      return new Transform(
        new Float32Array(data.matrix),
        data.width ?? 100,
        data.height ?? 100,
        undefined,
        data.opacity ?? 1,
        undefined,
        undefined,
        data.anchorX ?? 0.5,
        data.anchorY ?? 0.5,
      );
    }

    // 否则从参数构建
    return new Transform(
      data.x ?? 0,
      data.y ?? 0,
      data.width ?? 100,
      data.height ?? 100,
      data.rotation ?? 0,
      data.opacity ?? 1,
      data.scaleX ?? 1,
      data.scaleY ?? 1,
      data.anchorX ?? 0.5,
      data.anchorY ?? 0.5,
    );
  }
}
