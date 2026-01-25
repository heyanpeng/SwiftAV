/**
 * Todo DTO（数据传输对象）
 * 
 * 用于在不同层之间传输 Todo 数据
 * 与实体（Entity）的区别：
 * - DTO：纯数据，用于传输，不包含业务逻辑
 * - Entity：包含业务逻辑和业务规则
 */

export interface TodoDTO {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO 字符串格式，而不是 Date 对象
}

/**
 * 创建 Todo DTO
 */
export function createTodoDTO(todo: {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}): TodoDTO {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(), // 转换为字符串
  };
}

/**
 * 批量创建 Todo DTO
 */
export function createTodoDTOs(todos: Array<{
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}>): TodoDTO[] {
  return todos.map(createTodoDTO);
}
