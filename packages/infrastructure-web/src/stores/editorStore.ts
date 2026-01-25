/**
 * 编辑器 Store - 状态管理
 * 
 * Frameworks & Drivers Layer - UI (React + Zustand)
 * 
 * Store 实现 IEditorStore 接口（定义在 Interface Adapters 层）
 * 这样 Controller 可以依赖接口而不是具体实现
 */
import { create } from 'zustand';
// import { Project } from '@swiftav/entities';
// import type { IEditorStore } from '@swiftav/interface-adapters';

// 临时占位符类型
type Project = any;
type IEditorStore = any;

interface EditorState {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
}

interface EditorStoreActions {
  // 状态更新方法（由 Controller 调用）
  setProject: (project: Project | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export type EditorStore = EditorState & EditorStoreActions;

// Zustand store 实例
const zustandStore = create<EditorStore>((set) => ({
  project: null,
  isLoading: false,
  error: null,

  setProject: (project: Project | null) => {
    set({ project });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

// 导出 React Hook
export const useEditorStore = zustandStore;

// 实现 IEditorStore 接口，供 Controller 使用
export const editorStore: IEditorStore = {
  get project() {
    return zustandStore.getState().project;
  },
  get isLoading() {
    return zustandStore.getState().isLoading;
  },
  get error() {
    return zustandStore.getState().error;
  },
  setProject(project: Project | null) {
    zustandStore.getState().setProject(project);
  },
  setLoading(isLoading: boolean) {
    zustandStore.getState().setLoading(isLoading);
  },
  setError(error: string | null) {
    zustandStore.getState().setError(error);
  },
};
