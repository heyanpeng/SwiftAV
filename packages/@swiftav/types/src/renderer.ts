/**
 * 渲染相关类型定义
 */

export type LayerType = 'video' | 'text' | 'shape' | 'image';

export interface Transform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

export interface Layer {
  id: string;
  type: LayerType;
  transform: Transform;
  visible: boolean;
  zIndex: number;
}
