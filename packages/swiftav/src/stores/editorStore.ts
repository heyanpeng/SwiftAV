/**
 * 编辑器 Store - 状态管理
 * 
 * Store 层 - 只负责状态管理，不包含业务逻辑
 * 业务逻辑由 Controller 层处理
 */
import { create } from 'zustand';
import { Project } from '@swiftav/sdk';

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

export const useEditorStore = create<EditorStore>((set) => ({
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
