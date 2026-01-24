/**
 * 图形图层
 */

import { Layer } from './Layer';

export type ShapeType = 'rect' | 'circle' | 'path';

export interface ShapeOptions {
  type: ShapeType;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  data?: any;
}

export class ShapeLayer extends Layer {
  private shape: ShapeOptions;

  constructor(id: string, shape: ShapeOptions) {
    super(id, 'shape');
    this.shape = shape;
  }

  /**
   * 设置图形
   */
  setShape(shape: ShapeOptions): void {
    this.shape = shape;
  }

  /**
   * 渲染图形图层
   */
  render(canvas: any): void {
    if (!this.visible) {
      return;
    }
    // TODO: 实现图形渲染
  }
}
