/**
 * Todo 仓储接口
 */
import { Todo } from '../entities/Todo';

export interface ITodoRepository {
  /**
   * 查找所有 Todo
   */
  findAll(): Promise<Todo[]>;

  /**
   * 根据 ID 查找 Todo
   */
  findById(id: string): Promise<Todo | null>;

  /**
   * 保存 Todo
   */
  save(todo: Todo): Promise<void>;

  /**
   * 删除 Todo
   */
  delete(id: string): Promise<void>;
}
