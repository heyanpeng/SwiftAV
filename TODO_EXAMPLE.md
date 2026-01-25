# TodoList 示例 - 整洁架构演示

这是一个简单的 TodoList 应用，用于演示整洁架构（Clean Architecture）的分层结构。

## 架构层次

```
┌─────────────────────────────────────────┐
│  Frameworks & Drivers Layer (最外层)      │
│  infrastructure-web                      │
│  - React 组件 (TodoApp.tsx)              │
│  - Zustand Store (todoStore.ts)          │
│  - 依赖注入容器 (container.ts)           │
└─────────────────────────────────────────┘
              ↓ 调用
┌─────────────────────────────────────────┐
│  Interface Adapters Layer               │
│  interface-adapters                      │
│  - TodoController                        │
│  - ITodoStore 接口                       │
└─────────────────────────────────────────┘
              ↓ 调用
┌─────────────────────────────────────────┐
│  Use Cases Layer                        │
│  use-cases                              │
│  - TodoService (应用服务)                │
│  - AddTodoUseCase                       │
│  - RemoveTodoUseCase                    │
│  - ToggleTodoUseCase                    │
│  - UpdateTodoUseCase                    │
└─────────────────────────────────────────┘
              ↓ 调用
┌─────────────────────────────────────────┐
│  Entities Layer (最内层)                │
│  entities                               │
│  - Todo 实体                             │
│  - ITodoRepository 接口                  │
└─────────────────────────────────────────┘
              ↑ 实现
┌─────────────────────────────────────────┐
│  Infrastructure Layer                   │
│  infrastructure-storage                 │
│  - TodoRepository (实现)                │
└─────────────────────────────────────────┘
```

## 数据流

1. **用户操作** → React 组件 (`TodoApp.tsx`)
2. **组件调用** → Controller (`todoController.addTodo()`)
3. **Controller 调用** → Application Service (`TodoService.addTodo()`)
4. **Service 调用** → UseCase (`AddTodoUseCase.execute()`)
5. **UseCase 操作** → Entity (`Todo` 实体)
6. **UseCase 保存** → Repository (`TodoRepository.save()`)
7. **Repository 存储** → localStorage
8. **状态更新** → Store (`todoStore`) → UI 重新渲染

## 文件结构

### Entities Layer
- `packages/entities/src/entities/Todo.ts` - Todo 实体
- `packages/entities/src/repositories/ITodoRepository.ts` - Repository 接口

### Use Cases Layer
- `packages/use-cases/src/use-cases/todo/` - 各种 UseCase
- `packages/use-cases/src/services/TodoService.ts` - 应用服务

### Interface Adapters Layer
- `packages/interface-adapters/src/controllers/TodoController.ts` - Controller
- `packages/interface-adapters/src/controllers/ITodoStore.ts` - Store 接口

### Infrastructure Layer
- `packages/infrastructure-storage/src/repositories/TodoRepository.ts` - Repository 实现
- `packages/infrastructure-web/src/stores/todoStore.ts` - Zustand Store 实现
- `packages/infrastructure-web/src/dependency-injection/container.ts` - 依赖注入
- `packages/infrastructure-web/src/components/todo/TodoApp.tsx` - React 组件

## 运行示例

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:5173` 查看 TodoList 应用。

## 功能特性

- ✅ 添加 Todo
- ✅ 删除 Todo
- ✅ 切换 Todo 完成状态
- ✅ 数据持久化（localStorage）
- ✅ 加载状态和错误处理

## 架构优势

1. **关注点分离**：每一层都有明确的职责
2. **依赖反转**：内层不依赖外层，通过接口实现依赖反转
3. **可测试性**：每一层都可以独立测试
4. **可维护性**：修改某一层不影响其他层
5. **可扩展性**：可以轻松替换实现（如将 localStorage 替换为 API）
