/**
 * 图层实体
 */
import { Transform } from '../value-objects/Transform';

export type LayerType = 'video' | 'text' | 'shape' | 'image';

export abstract class Layer {
  readonly id: string;
  readonly type: LayerType;
  private _transform: Transform;
  visible: boolean;
  zIndex: number;

  constructor(id: string, type: LayerType) {
    this.id = id;
    this.type = type;
    this._transform = Transform.identity();
    this.visible = true;
    this.zIndex = 0;
  }

  /**
   * 获取变换
   */
  get transform(): Transform {
    return this._transform;
  }

  /**
   * 更新变换
   */
  updateTransform(transform: Partial<Transform>): void {
    this._transform = this._transform.update(transform);
  }

  /**
   * 设置可见性
   */
  setVisible(visible: boolean): void {
    this.visible = visible;
  }

  /**
   * 设置层级
   */
  setZIndex(zIndex: number): void {
    this.zIndex = zIndex;
  }
}
