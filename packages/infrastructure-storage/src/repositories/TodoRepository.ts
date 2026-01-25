/**
 * Todo Repository 实现
 */
import { Todo, ITodoRepository } from '@swiftav/entities';

export class TodoRepository implements ITodoRepository {
  private todos: Map<string, Todo> = new Map();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values());
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.get(id) || null;
  }

  async save(todo: Todo): Promise<void> {
    this.todos.set(todo.id, todo);
    // 保存到 localStorage
    this.saveToLocalStorage();
  }

  async delete(id: string): Promise<void> {
    this.todos.delete(id);
    // 保存到 localStorage
    this.saveToLocalStorage();
  }

  /**
   * 从 localStorage 加载
   */
  loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('todos');
      if (stored) {
        const todosData = JSON.parse(stored);
        this.todos = new Map(
          todosData.map((data: any) => [
            data.id,
            new Todo(data.id, data.title, data.completed, new Date(data.createdAt)),
          ])
        );
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
    }
  }

  /**
   * 保存到 localStorage
   */
  private saveToLocalStorage(): void {
    try {
      const todosData = Array.from(this.todos.values()).map((todo) => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        createdAt: todo.createdAt.toISOString(),
      }));
      localStorage.setItem('todos', JSON.stringify(todosData));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }

  /**
   * 初始化：从 localStorage 加载数据
   */
  constructor() {
    this.loadFromLocalStorage();
  }
}
