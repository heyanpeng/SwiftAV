/**
 * 图形绘制工具
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Paint {
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
}

export class ShapeTool {
  /**
   * 绘制矩形
   */
  drawRect(canvas: any, rect: Rect, paint: Paint): void {
    // TODO: 实现矩形绘制
  }

  /**
   * 绘制圆形
   */
  drawCircle(canvas: any, center: Point, radius: number, paint: Paint): void {
    // TODO: 实现圆形绘制
  }

  /**
   * 绘制路径
   */
  drawPath(canvas: any, path: any, paint: Paint): void {
    // TODO: 实现路径绘制
  }

  /**
   * 绘制线条
   */
  drawLine(canvas: any, start: Point, end: Point, paint: Paint): void {
    // TODO: 实现线条绘制
  }
}
