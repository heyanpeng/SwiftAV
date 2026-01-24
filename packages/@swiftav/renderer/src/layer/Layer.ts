/**
 * 基础图层
 */

export interface Transform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

export type LayerType = 'video' | 'text' | 'shape' | 'image';

export abstract class Layer {
  id: string;
  type: LayerType;
  transform: Transform;
  visible: boolean;
  zIndex: number;

  constructor(id: string, type: LayerType) {
    this.id = id;
    this.type = type;
    this.transform = {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    };
    this.visible = true;
    this.zIndex = 0;
  }

  /**
   * 渲染图层
   */
  abstract render(canvas: any): void;

  /**
   * 更新变换
   */
  updateTransform(transform: Partial<Transform>): void {
    this.transform = { ...this.transform, ...transform };
  }
}
