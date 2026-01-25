/**
 * Todo Controller
 * 
 * Interface Adapters Layer - Controllers
 * 职责：
 * - 接收用户输入
 * - 调用 Use Cases
 * - 更新 Store 状态
 */
import { Todo, ITodoRepository } from '@swiftav/entities';
import { TodoUseCase } from '@swiftav/use-cases';
import { ITodoStore } from './ITodoStore';

export class TodoController {
  constructor(
    private todoUseCase: TodoUseCase,
    private todoRepository: ITodoRepository,
    private store: ITodoStore,
  ) {}

  /**
   * 加载所有 Todo
   */
  async loadTodos(): Promise<void> {
    this.store.setLoading(true);
    this.store.setError(null);

    try {
      const todos = await this.todoRepository.findAll();
      this.store.setTodos(todos);
      this.store.setLoading(false);
    } catch (error) {
      this.store.setError(
        error instanceof Error ? error.message : 'Failed to load todos'
      );
      this.store.setLoading(false);
    }
  }

  /**
   * 添加 Todo
   */
  async addTodo(title: string): Promise<void> {
    if (!title.trim()) {
      this.store.setError('Todo title cannot be empty');
      return;
    }

    this.store.setError(null);

    try {
      const todo = await this.todoUseCase.addTodo({ title });
      this.store.addTodo(todo);
    } catch (error) {
      this.store.setError(
        error instanceof Error ? error.message : 'Failed to add todo'
      );
    }
  }

  /**
   * 删除 Todo
   */
  async removeTodo(todoId: string): Promise<void> {
    this.store.setError(null);

    try {
      await this.todoUseCase.removeTodo(todoId);
      this.store.removeTodo(todoId);
    } catch (error) {
      this.store.setError(
        error instanceof Error ? error.message : 'Failed to remove todo'
      );
    }
  }

  /**
   * 切换 Todo 完成状态
   */
  async toggleTodo(todoId: string): Promise<void> {
    this.store.setError(null);

    try {
      await this.todoUseCase.toggleTodo(todoId);
      const todo = await this.todoRepository.findById(todoId);
      if (todo) {
        this.store.updateTodo(todo);
      }
    } catch (error) {
      this.store.setError(
        error instanceof Error ? error.message : 'Failed to toggle todo'
      );
    }
  }

  /**
   * 更新 Todo
   */
  async updateTodo(todoId: string, title: string): Promise<void> {
    if (!title.trim()) {
      this.store.setError('Todo title cannot be empty');
      return;
    }

    this.store.setError(null);

    try {
      await this.todoUseCase.updateTodo({ todoId, title });
      const todo = await this.todoRepository.findById(todoId);
      if (todo) {
        this.store.updateTodo(todo);
      }
    } catch (error) {
      this.store.setError(
        error instanceof Error ? error.message : 'Failed to update todo'
      );
    }
  }
}
