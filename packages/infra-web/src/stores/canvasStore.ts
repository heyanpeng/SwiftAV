/**
 * Canvas Store - 画布元素状态管理
 * 
 * Frameworks & Drivers Layer - UI (React + Zustand)
 * 
 * 存储当前画布上的渲染元素列表（文字、图片等）
 */
import { create } from 'zustand';
import { BaseElement } from '@swiftav/entities';

// 向后兼容：RenderElement 作为 BaseElement 的别名
type RenderElement = BaseElement;

interface CanvasState {
  /**
   * 画布上的所有元素列表
   */
  elements: RenderElement[];

  /**
   * 当前选中的元素 ID
   */
  selectedElementId: string | null;
}

interface CanvasActions {
  /**
   * 设置所有元素
   */
  setElements: (elements: RenderElement[]) => void;

  /**
   * 添加元素
   */
  addElement: (element: RenderElement) => void;

  /**
   * 删除元素
   */
  removeElement: (id: string) => void;

  /**
   * 更新元素
   */
  updateElement: (id: string, updates: Partial<BaseElement>) => void;

  /**
   * 设置选中的元素
   */
  setSelectedElement: (id: string | null) => void;

  /**
   * 清空所有元素
   */
  clearElements: () => void;

  /**
   * 根据 ID 获取元素
   */
  getElement: (id: string) => RenderElement | undefined;

  /**
   * 移动元素到指定位置
   */
  moveElement: (id: string, x: number, y: number) => void;

  /**
   * 调整元素大小
   */
  resizeElement: (id: string, width: number, height: number) => void;

  /**
   * 调整元素层级（z-index）
   */
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
}

type CanvasStore = CanvasState & CanvasActions;

// Zustand store 实例
const zustandStore = create<CanvasStore>((set, get) => ({
  elements: [],
  selectedElementId: null,

  setElements: (elements) => set({ elements }),

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
    })),

  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementId:
        state.selectedElementId === id ? null : state.selectedElementId,
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) => {
        if (el.id === id) {
          // 更新元素属性
          Object.assign(el, updates);
          return el;
        }
        return el;
      }),
    })),

  setSelectedElement: (id) => set({ selectedElementId: id }),

  clearElements: () =>
    set({
      elements: [],
      selectedElementId: null,
    }),

  getElement: (id) => {
    const state = get();
    return state.elements.find((el) => el.id === id);
  },

  moveElement: (id, x, y) =>
    set((state) => ({
      elements: state.elements.map((el) => {
        if (el.id === id) {
          el.setPosition(x, y);
        }
        return el;
      }),
    })),

  resizeElement: (id, width, height) =>
    set((state) => ({
      elements: state.elements.map((el) => {
        if (el.id === id) {
          el.setSize(width, height);
        }
        return el;
      }),
    })),

  bringToFront: (id) =>
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      const maxZIndex = Math.max(
        ...state.elements.map((el) => el.zIndex),
        0,
      );
      element.setZIndex(maxZIndex + 1);
      return { elements: [...state.elements] };
    }),

  sendToBack: (id) =>
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      const minZIndex = Math.min(
        ...state.elements.map((el) => el.zIndex),
        0,
      );
      element.setZIndex(minZIndex - 1);
      return { elements: [...state.elements] };
    }),

  bringForward: (id) =>
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      const currentZIndex = element.zIndex;
      const nextZIndex =
        Math.min(
          ...state.elements
            .filter((el) => el.zIndex > currentZIndex)
            .map((el) => el.zIndex),
          currentZIndex + 1,
        ) || currentZIndex + 1;

      element.setZIndex(nextZIndex);
      return { elements: [...state.elements] };
    }),

  sendBackward: (id) =>
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      const currentZIndex = element.zIndex;
      const nextZIndex =
        Math.max(
          ...state.elements
            .filter((el) => el.zIndex < currentZIndex)
            .map((el) => el.zIndex),
          currentZIndex - 1,
        ) || currentZIndex - 1;

      element.setZIndex(nextZIndex);
      return { elements: [...state.elements] };
    }),
}));

// 导出 React Hook
export const useCanvasStore = zustandStore;

// 导出类型
export type { CanvasStore, CanvasState, CanvasActions };
