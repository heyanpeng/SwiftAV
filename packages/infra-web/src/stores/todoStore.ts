/**
 * Todo Store - 状态管理
 * 
 * Frameworks & Drivers Layer - UI (React + Zustand)
 * 
 * Store 实现 ITodoStore 接口（定义在 Interface Adapters 层）
 * 这样 Controller 可以依赖接口而不是具体实现
 */
import { create } from 'zustand';
import { Todo } from '@swiftav/entities';
import type { ITodoStore } from '@swiftav/adapters';

interface TodoStoreState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

interface TodoStoreActions {
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  removeTodo: (todoId: string) => void;
  updateTodo: (todo: Todo) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type TodoStore = TodoStoreState & TodoStoreActions;

// Zustand store 实例
const zustandStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,
  error: null,

  setTodos: (todos) => set({ todos }),
  
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  
  removeTodo: (todoId) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== todoId),
    })),
  
  updateTodo: (updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      ),
    })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));

// 实现 ITodoStore 接口的适配器
export const todoStore: ITodoStore = {
  get todos() {
    return zustandStore.getState().todos;
  },
  get loading() {
    return zustandStore.getState().loading;
  },
  get error() {
    return zustandStore.getState().error;
  },
  setTodos: (todos) => zustandStore.getState().setTodos(todos),
  addTodo: (todo) => zustandStore.getState().addTodo(todo),
  removeTodo: (todoId) => zustandStore.getState().removeTodo(todoId),
  updateTodo: (todo) => zustandStore.getState().updateTodo(todo),
  setLoading: (loading) => zustandStore.getState().setLoading(loading),
  setError: (error) => zustandStore.getState().setError(error),
};

// 导出 React Hook
export const useTodoStore = zustandStore;
