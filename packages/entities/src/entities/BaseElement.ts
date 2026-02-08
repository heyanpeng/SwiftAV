/**
 * 基础元素抽象类
 * 
 * 所有可渲染元素的抽象基类，使用 Transform 管理变换
 * 实现 render 方法，检查资源是否准备好后调用 doRender
 */
import { Transform } from '../value-objects/Transform';

export abstract class BaseElement {
  /**
   * 元素唯一标识
   */
  id: string;

  /**
   * 元素类型
   */
  abstract readonly type: string;

  /**
   * 变换信息（位置、大小、旋转、透明度等）
   */
  transform: Transform;

  /**
   * 是否可见
   */
  visible: boolean;

  /**
   * Z-index（层级，数值越大越在上层）
   */
  zIndex: number;

  constructor(
    id: string,
    transform: Transform = Transform.default(),
    visible: boolean = true,
    zIndex: number = 0,
  ) {
    this.id = id;
    this.transform = transform;
    this.visible = visible;
    this.zIndex = zIndex;
  }

  /**
   * 更新位置
   */
  setPosition(x: number, y: number): void {
    this.transform = this.transform.withPosition(x, y);
  }

  /**
   * 更新大小
   */
  setSize(width: number, height: number): void {
    this.transform = this.transform.withSize(width, height);
  }

  /**
   * 更新旋转角度
   */
  setRotation(rotation: number): void {
    this.transform = this.transform.withRotation(rotation);
  }

  /**
   * 更新透明度
   */
  setOpacity(opacity: number): void {
    this.transform = this.transform.withOpacity(opacity);
  }

  /**
   * 更新缩放
   */
  setScale(scaleX: number, scaleY?: number): void {
    this.transform = this.transform.withScale(scaleX, scaleY);
  }

  /**
   * 更新变换原点
   */
  setAnchor(anchorX: number, anchorY: number): void {
    this.transform = this.transform.withAnchor(anchorX, anchorY);
  }

  /**
   * 应用位移
   */
  translate(deltaX: number, deltaY: number): void {
    this.transform = this.transform.translate(deltaX, deltaY);
  }

  /**
   * 应用旋转
   */
  rotate(deltaRotation: number): void {
    this.transform = this.transform.rotate(deltaRotation);
  }

  /**
   * 应用缩放
   */
  scale(deltaScaleX: number, deltaScaleY?: number): void {
    this.transform = this.transform.scale(deltaScaleX, deltaScaleY);
  }

  /**
   * 设置可见性
   */
  setVisible(visible: boolean): void {
    this.visible = visible;
  }

  /**
   * 更新层级
   */
  setZIndex(zIndex: number): void {
    this.zIndex = zIndex;
  }

  /**
   * 更新整个 Transform
   */
  setTransform(transform: Transform): void {
    this.transform = transform;
  }

  // 便捷访问器（向后兼容）
  get x(): number {
    return this.transform.x;
  }

  get y(): number {
    return this.transform.y;
  }

  get width(): number {
    return this.transform.width;
  }

  get height(): number {
    return this.transform.height;
  }

  get rotation(): number {
    return this.transform.rotation;
  }

  get opacity(): number {
    return this.transform.opacity;
  }

  get scaleX(): number {
    return this.transform.scaleX;
  }

  get scaleY(): number {
    return this.transform.scaleY;
  }

  /**
   * 渲染元素（模板方法）
   * 
   * 检查资源是否准备好，如果准备好则调用 doRender
   * 
   * @param canvas Canvas 实例（来自 CanvasKit）
   * @param canvasKit CanvasKit 实例
   * @param context 可选的渲染上下文（用于传递额外的渲染信息，如图片缓存）
   */
  render(
    canvas: any,
    canvasKit: any,
    context?: any,
  ): void {
    // 检查资源是否准备好
    if (!this.isResourceReady(context)) {
      return; // 资源未准备好，跳过渲染
    }

    // 资源准备好，执行具体渲染
    this.doRender(canvas, canvasKit, context);
  }

  /**
   * 检查资源是否准备好（由子类实现）
   * 
   * @param context 可选的渲染上下文
   * @returns true 如果资源已准备好，可以渲染
   */
  protected abstract isResourceReady(context?: any): boolean;

  /**
   * 执行具体渲染（由子类实现）
   * 
   * @param canvas Canvas 实例（来自 CanvasKit）
   * @param canvasKit CanvasKit 实例
   * @param context 可选的渲染上下文
   */
  protected abstract doRender(
    canvas: any,
    canvasKit: any,
    context?: any,
  ): void;
}
