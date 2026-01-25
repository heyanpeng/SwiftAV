/**
 * Todo Store 接口
 */
import { Todo } from '@swiftav/entities';

export interface ITodoStore {
  todos: Todo[];
  loading: boolean;
  error: string | null;

  setTodos(todos: Todo[]): void;
  addTodo(todo: Todo): void;
  removeTodo(todoId: string): void;
  updateTodo(todo: Todo): void;
  setLoading(loading: boolean): void;
  setError(error: string | null): void;
}
