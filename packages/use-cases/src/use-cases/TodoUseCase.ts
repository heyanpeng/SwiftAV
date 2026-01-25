/**
 * Todo 用例
 * 包含所有 Todo 相关的操作：增删改查
 */
import { Todo, ITodoRepository } from '@swiftav/entities';

export interface AddTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  todoId: string;
  title: string;
}

export class TodoUseCase {
  constructor(private todoRepository: ITodoRepository) {}

  /**
   * 添加 Todo
   */
  async addTodo(request: AddTodoRequest): Promise<Todo> {
    if (!request.title.trim()) {
      throw new Error('Todo title cannot be empty');
    }

    const todo = new Todo(
      `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      request.title.trim(),
    );

    await this.todoRepository.save(todo);
    return todo;
  }

  /**
   * 删除 Todo
   */
  async removeTodo(todoId: string): Promise<void> {
    const todo = await this.todoRepository.findById(todoId);
    if (!todo) {
      throw new Error(`Todo ${todoId} not found`);
    }

    await this.todoRepository.delete(todoId);
  }

  /**
   * 切换 Todo 完成状态
   */
  async toggleTodo(todoId: string): Promise<void> {
    const todo = await this.todoRepository.findById(todoId);
    if (!todo) {
      throw new Error(`Todo ${todoId} not found`);
    }

    todo.toggle();
    await this.todoRepository.save(todo);
  }

  /**
   * 更新 Todo
   */
  async updateTodo(request: UpdateTodoRequest): Promise<void> {
    const todo = await this.todoRepository.findById(request.todoId);
    if (!todo) {
      throw new Error(`Todo ${request.todoId} not found`);
    }

    todo.updateTitle(request.title);
    await this.todoRepository.save(todo);
  }
}
