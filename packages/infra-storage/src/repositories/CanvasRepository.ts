/**
 * Canvas Repository 实现
 * 
 * 提供画布元素的持久化存储功能
 */
import {
  BaseElement,
  TextElement,
  ImageElement,
  ICanvasRepository,
  Transform,
} from '@swiftav/entities';

/**
 * 元素序列化数据
 */
interface ElementData {
  id: string;
  type: 'text' | 'image';
  transform: {
    matrix?: number[]; // 3x3 矩阵（9 个元素）
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
  };
  visible: boolean;
  zIndex: number;
  // TextElement 特有属性
  content?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  // ImageElement 特有属性
  src?: string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none';
  objectPosition?: 'left' | 'center' | 'right' | 'top' | 'bottom' | string;
  preserveAspectRatio?: boolean;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  filter?: string;
}

export class CanvasRepository implements ICanvasRepository {
  private storageKey = 'canvas_elements';

  /**
   * 获取存储键名
   */
  private getStorageKey(projectId: string): string {
    return `${this.storageKey}_${projectId}`;
  }

  /**
   * 序列化元素为 JSON
   */
  private serializeElement(element: BaseElement): ElementData {
    const transform = element.transform;
    const base: ElementData = {
      id: element.id,
      type: element.type as 'text' | 'image',
      transform: {
        matrix: transform.getMatrixArray(), // 保存完整矩阵
        width: transform.width,
        height: transform.height,
        opacity: transform.opacity,
        anchorX: transform.anchorX,
        anchorY: transform.anchorY,
        // 也保存便捷属性以便兼容
        x: transform.x,
        y: transform.y,
        rotation: transform.rotation,
        scaleX: transform.scaleX,
        scaleY: transform.scaleY,
      },
      visible: element.visible,
      zIndex: element.zIndex,
    };

    if (element.type === 'text') {
      const textElement = element as TextElement;
      return {
        ...base,
        content: textElement.content,
        fontSize: textElement.fontSize,
        color: textElement.color,
        fontFamily: textElement.fontFamily,
        fontWeight: textElement.fontWeight,
        textAlign: textElement.textAlign,
        lineHeight: textElement.lineHeight,
        textDecoration: textElement.textDecoration,
        strokeColor: textElement.strokeColor,
        strokeWidth: textElement.strokeWidth,
        backgroundColor: textElement.backgroundColor,
        borderRadius: textElement.borderRadius,
        padding: textElement.padding,
      };
    } else if (element.type === 'image') {
      const imageElement = element as ImageElement;
      return {
        ...base,
        src: imageElement.src,
        objectFit: imageElement.objectFit,
        objectPosition: imageElement.objectPosition,
        preserveAspectRatio: imageElement.preserveAspectRatio,
        crop: imageElement.crop,
        filter: imageElement.filter,
      };
    }

    return base;
  }

  /**
   * 反序列化 JSON 为元素
   */
  private deserializeElement(data: ElementData): BaseElement {
    // 从 transform 对象创建 Transform 实例
    const transform = Transform.fromObject(data.transform);

    if (data.type === 'text') {
      return new TextElement(
        data.id,
        data.content || '',
        transform, // Transform 作为第三个参数
        undefined, // y
        undefined, // width
        undefined, // height
        data.fontSize || 16,
        data.color || '#000000',
        data.fontFamily || 'Arial',
        data.fontWeight || 'normal',
        data.textAlign || 'left',
        data.lineHeight || 1.2,
        data.textDecoration || 'none',
        data.strokeColor,
        data.strokeWidth || 0,
        data.backgroundColor,
        data.borderRadius || 0,
        data.padding || 0,
        undefined, // rotation (已包含在 transform 中)
        undefined, // opacity (已包含在 transform 中)
        data.visible ?? true,
        data.zIndex ?? 0,
      );
    } else if (data.type === 'image') {
      return new ImageElement(
        data.id,
        data.src || '',
        transform, // Transform 作为第三个参数
        undefined, // y
        undefined, // width
        undefined, // height
        data.objectFit || 'contain',
        data.objectPosition || 'center',
        data.preserveAspectRatio !== undefined
          ? data.preserveAspectRatio
          : true,
        data.crop,
        data.filter,
        undefined, // rotation (已包含在 transform 中)
        undefined, // opacity (已包含在 transform 中)
        data.visible ?? true,
        data.zIndex ?? 0,
      );
    }

    throw new Error(`Unknown element type: ${data.type}`);
  }

  /**
   * 从 localStorage 加载元素列表
   */
  private loadFromLocalStorage(projectId: string): ElementData[] {
    try {
      const storageKey = this.getStorageKey(projectId);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored) as ElementData[];
      }
    } catch (error) {
      console.error(
        `Failed to load elements from localStorage for project ${projectId}:`,
        error,
      );
    }
    return [];
  }

  /**
   * 保存元素列表到 localStorage
   */
  private saveToLocalStorage(
    projectId: string,
    elements: BaseElement[],
  ): void {
    try {
      const storageKey = this.getStorageKey(projectId);
      const elementsData = elements.map((el) => this.serializeElement(el));
      localStorage.setItem(storageKey, JSON.stringify(elementsData));
    } catch (error) {
      console.error(
        `Failed to save elements to localStorage for project ${projectId}:`,
        error,
      );
    }
  }

  async saveElements(
    projectId: string,
    elements: BaseElement[],
  ): Promise<void> {
    this.saveToLocalStorage(projectId, elements);
  }

  async loadElements(projectId: string): Promise<BaseElement[]> {
    const elementsData = this.loadFromLocalStorage(projectId);
    return elementsData.map((data) => this.deserializeElement(data));
  }

  async addElement(
    projectId: string,
    element: BaseElement,
  ): Promise<void> {
    const elements = await this.loadElements(projectId);
    elements.push(element);
    await this.saveElements(projectId, elements);
  }

  async updateElement(
    projectId: string,
    element: BaseElement,
  ): Promise<void> {
    const elements = await this.loadElements(projectId);
    const index = elements.findIndex((el) => el.id === element.id);
    if (index !== -1) {
      elements[index] = element;
      await this.saveElements(projectId, elements);
    } else {
      throw new Error(`Element ${element.id} not found`);
    }
  }

  async deleteElement(
    projectId: string,
    elementId: string,
  ): Promise<void> {
    const elements = await this.loadElements(projectId);
    const filtered = elements.filter((el) => el.id !== elementId);
    await this.saveElements(projectId, filtered);
  }

  async findElementById(
    projectId: string,
    elementId: string,
  ): Promise<BaseElement | null> {
    const elements = await this.loadElements(projectId);
    return elements.find((el) => el.id === elementId) || null;
  }

  async clearElements(projectId: string): Promise<void> {
    await this.saveElements(projectId, []);
  }
}
