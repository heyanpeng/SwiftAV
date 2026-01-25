/**
 * 依赖注入容器
 * 
 * Frameworks & Drivers Layer - UI (React)
 * 
 * 负责创建和注册所有服务实例，包括：
 * - Use Cases
 * - Repository 实现
 * - Controller 实例（Interface Adapters 层的实例化）
 */
import { TodoUseCase } from '@swiftav/usecases';
import { TodoRepository } from '@swiftav/infra-storage';
import type { ITodoRepository } from '@swiftav/infra-storage';
import { TodoController } from '@swiftav/adapters';
import { todoStore } from '../stores/todoStore';

class Container {
  private instances = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.instances.set(key, factory());
  }

  get<T>(key: string): T {
    const instance = this.instances.get(key);
    if (!instance) {
      throw new Error(`Service ${key} not found`);
    }
    return instance as T;
  }

  has(key: string): boolean {
    return this.instances.has(key);
  }
}

const container = new Container();

// 注册基础设施 Repository
container.register('TodoRepository', () => new TodoRepository());

// 注册 Todo UseCase
container.register('TodoUseCase', () =>
  new TodoUseCase(container.get<ITodoRepository>('TodoRepository')),
);

// 注册 Controller（Interface Adapters 层的实例化）
container.register('TodoController', () =>
  new TodoController(
    container.get<TodoUseCase>('TodoUseCase'),
    container.get<ITodoRepository>('TodoRepository'),
    todoStore,
  ),
);

// 导出 Controller 实例（供 React 组件使用）
export const todoController = container.get<TodoController>('TodoController');

export default container;
