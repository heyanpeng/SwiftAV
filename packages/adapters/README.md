# @swiftav/adapters

Interface Adapters Layer - 接口适配器层

## 整洁架构位置

**第三层（绿色层）** - Interface Adapters Layer

```
┌─────────────────────────────────────────┐
│   Interface Adapters Layer (绿色层)    │
│   @swiftav/adapters                    │
│   - Controllers (控制器)               │
│   - Presenters (表现器)                │
│   - Gateways (网关接口)                │
└─────────────────────────────────────────┘
              ↓ 依赖
┌─────────────────────────────────────────┐
│   Use Cases Layer (红色层)               │
│   @swiftav/usecases                     │
└─────────────────────────────────────────┘
```

## 职责

### Controllers（控制器）
- 接收用户输入（来自 UI 层）
- 调用 Use Cases / Application Services
- 更新 Store 状态（通过 Store 接口）

### Presenters（表现器）
- 将 Use Cases 的输出转换为 UI 可以显示的格式
- 格式化数据以供视图使用

### Gateways（网关）
- Repository 接口定义在 Entities 层
- Repository 实现（Gateway）在 Frameworks & Drivers 层
- 这里可以定义 Gateway 的接口或抽象类（如果需要）

## 依赖规则

✅ **可以依赖**：
- `@swiftav/entities` - 实体层
- `@swiftav/usecases` - 用例层

❌ **不能依赖**：
- `@swiftav/infra-*` - 基础设施层（具体实现）
- UI 框架（React、Vue 等）

## 使用示例

```typescript
import { EditorController, IEditorStore } from '@swiftav/adapters';
import { EditorService } from '@swiftav/usecases';
import { ProjectRepository } from '@swiftav/infra-storage';

// 在 Frameworks & Drivers 层创建 Controller 实例
const editorService = new EditorService(/* ... */);
const projectRepository = new ProjectRepository(/* ... */);
const store: IEditorStore = /* Zustand store 实现 */;

const controller = new EditorController(
  editorService,
  projectRepository,
  store
);
```

## 架构说明

Interface Adapters 层是整洁架构中的关键层，它：
1. **隔离业务逻辑和框架**：业务逻辑（Use Cases）不依赖具体的 UI 框架或存储实现
2. **数据转换**：将内层的数据格式转换为外层需要的格式
3. **依赖反转**：通过接口定义 Store，让 Controller 依赖接口而不是具体实现
