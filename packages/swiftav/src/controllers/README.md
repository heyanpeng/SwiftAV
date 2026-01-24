# Controllers 层

## 概述

Controllers 层属于 **Interface Adapters Layer（绿色层）**，是整洁架构中的适配器层，负责：

- **接收用户输入**：处理来自 React 组件的事件和请求
- **调用 Use Cases**：协调 Application Services 和 Use Cases 执行业务逻辑
- **更新状态**：通过 Store 更新应用状态
- **错误处理**：捕获和处理业务异常，更新错误状态

## 在整洁架构中的位置

```
┌─────────────────────────────────────────┐
│   Interface Adapters Layer (绿色层)    │
│   Controllers ← 当前层                  │
│   - 处理用户输入                         │
│   - 调用 Use Cases                      │
│   - 更新 Store                           │
└─────────────────────────────────────────┘
              ↓ 调用
┌─────────────────────────────────────────┐
│   Use Cases Layer (红色层)              │
│   - Application Services                │
│   - Use Cases                            │
└─────────────────────────────────────────┘
```

## 架构流程

```
用户操作 
  ↓
React 组件 (Presenter)
  ↓
Controller (处理输入，调用 Use Cases)
  ↓
Use Cases / Application Services
  ↓
更新 Store (状态管理)
  ↓
组件重新渲染
```

## 为什么 Controllers 在应用内？

**当前架构决策：Controllers 放在应用内（`packages/swiftav/src/controllers/`）**

### 原因：
1. **框架相关性**：Controllers 依赖 Zustand Store，是 React 应用特定的
2. **单一前端应用**：当前只有一个 React 前端应用，不需要跨框架复用
3. **简单直接**：避免过度设计，保持架构简单

### 何时考虑独立成包？
- 如果有多个前端应用（React、Vue、CLI 等）
- 需要跨框架复用 Controllers
- 此时可以创建 `@swiftav/interface-adapters` 包，通过接口/回调实现框架无关

## 使用示例

### 在组件中使用 Controller

```typescript
import { useEditorStore, editorController } from '@/stores';

function MyComponent() {
  // 从 Store 读取状态
  const { project, isLoading, error } = useEditorStore();

  // 通过 Controller 执行业务操作
  const handleAddTrack = async () => {
    await editorController.addTrack('track-1', 'video');
  };

  const handleAddClip = async () => {
    await editorController.addClip({
      trackId: 'track-1',
      clipId: 'clip-1',
      startTime: 0,
      duration: 10,
      source: mediaSource,
    });
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <button onClick={handleAddTrack}>Add Track</button>
      <button onClick={handleAddClip}>Add Clip</button>
    </div>
  );
}
```

## Controller 职责

### EditorController

`EditorController` 是编辑器的主要控制器，提供以下功能：

#### 项目操作
- `createProject(name: string)` - 创建新项目
- `loadProject(id: string)` - 加载项目
- `saveProject()` - 保存项目

#### 轨道操作
- `addTrack(trackId: string, type: 'video' | 'audio')` - 添加轨道
- `removeTrack(trackId: string)` - 移除轨道

#### 片段操作
- `addClip(request: AddClipRequest)` - 添加片段
- `removeClip(trackId: string, clipId: string)` - 移除片段
- `trimClip(trackId: string, clipId: string, start: number, end: number)` - 裁剪片段
- `splitClip(trackId: string, clipId: string, time: number)` - 分割片段
- `moveClip(trackId: string, clipId: string, newStartTime: number)` - 移动片段

#### 时间线操作
- `seek(time: number)` - 定位到指定时间
- `setZoom(zoom: number)` - 设置缩放级别

## 设计原则

1. **Controller 负责业务协调**：
   - 调用 Use Cases / Application Services
   - 处理业务异常和错误
   - 更新 Store 状态

2. **不包含业务逻辑**：
   - Controller 不实现业务规则
   - 业务逻辑在 Use Cases 层
   - Controller 只负责协调和适配

3. **单向数据流**：
   ```
   Component → Controller → Use Cases → Store → Component
   ```

4. **错误处理**：
   - 捕获 Use Cases 抛出的异常
   - 将错误信息更新到 Store
   - 不直接向用户展示错误（由 Component 负责）

## 文件结构

```
src/controllers/
├── EditorController.ts  # 编辑器控制器
├── index.ts             # 统一导出
└── README.md            # 本文档
```

## 依赖关系

- **依赖**：
  - `@swiftav/sdk` - Use Cases 和 Application Services
  - `../di/container` - 依赖注入容器
  - `../stores/editorStore` - 状态管理（Zustand）

- **被依赖**：
  - React 组件通过 Controller 执行业务操作
