/**
 * Canvas 仓储接口
 *
 * 用于持久化存储画布元素（文字、图片等）
 */
import { BaseElement } from "../entities/BaseElement";

export interface ICanvasRepository {
  /**
   * 保存所有元素
   *
   * @param projectId 项目 ID
   * @param elements 元素列表
   */
  saveElements(projectId: string, elements: BaseElement[]): Promise<void>;

  /**
   * 加载所有元素
   *
   * @param projectId 项目 ID
   * @returns 元素列表
   */
  loadElements(projectId: string): Promise<BaseElement[]>;

  /**
   * 添加元素
   *
   * @param projectId 项目 ID
   * @param element 元素
   */
  addElement(projectId: string, element: BaseElement): Promise<void>;

  /**
   * 更新元素
   *
   * @param projectId 项目 ID
   * @param element 元素
   */
  updateElement(projectId: string, element: BaseElement): Promise<void>;

  /**
   * 删除元素
   *
   * @param projectId 项目 ID
   * @param elementId 元素 ID
   */
  deleteElement(projectId: string, elementId: string): Promise<void>;

  /**
   * 根据 ID 查找元素
   *
   * @param projectId 项目 ID
   * @param elementId 元素 ID
   * @returns 元素或 null
   */
  findElementById(
    projectId: string,
    elementId: string,
  ): Promise<BaseElement | null>;

  /**
   * 清空所有元素
   *
   * @param projectId 项目 ID
   */
  clearElements(projectId: string): Promise<void>;
}
