/**
 * 资源元素抽象类
 * 
 * 继承 BaseElement，负责资源加载管理
 * 子类需要实现资源加载逻辑
 */
import { BaseElement } from './BaseElement';
import { Transform } from '../value-objects/Transform';

export abstract class ResourceElement extends BaseElement {
  /**
   * 资源加载状态
   */
  protected resourceState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

  /**
   * 资源加载错误信息
   */
  protected resourceError: Error | null = null;

  constructor(
    id: string,
    transform: Transform = Transform.default(),
    visible: boolean = true,
    zIndex: number = 0,
  ) {
    super(id, transform, visible, zIndex);
  }

  /**
   * 检查资源是否准备好
   */
  protected isResourceReady(context?: any): boolean {
    // 如果资源状态是 ready，直接返回 true
    if (this.resourceState === 'ready') {
      return true;
    }

    // 如果资源状态是 idle，尝试加载
    if (this.resourceState === 'idle') {
      this.loadResource(context);
      return false; // 加载中，还未准备好
    }

    // loading 或 error 状态，资源未准备好
    return false;
  }

  /**
   * 加载资源（由子类实现）
   * 
   * @param context 可选的上下文（如图片缓存获取函数）
   */
  protected abstract loadResource(context?: any): void | Promise<void>;

  /**
   * 标记资源为加载中
   */
  protected setResourceLoading(): void {
    this.resourceState = 'loading';
    this.resourceError = null;
  }

  /**
   * 标记资源为已准备好
   */
  protected setResourceReady(): void {
    this.resourceState = 'ready';
    this.resourceError = null;
  }

  /**
   * 标记资源加载失败
   */
  protected setResourceError(error: Error): void {
    this.resourceState = 'error';
    this.resourceError = error;
  }

  /**
   * 获取资源状态
   */
  getResourceState(): 'idle' | 'loading' | 'ready' | 'error' {
    return this.resourceState;
  }

  /**
   * 获取资源错误信息
   */
  getResourceError(): Error | null {
    return this.resourceError;
  }

  /**
   * 重置资源状态（用于重新加载）
   */
  resetResource(): void {
    this.resourceState = 'idle';
    this.resourceError = null;
  }
}
