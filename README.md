# SwiftAV Monorepo

这是一个使用 pnpm workspaces 组织的多包项目，采用**整洁架构（Clean Architecture）**设计。

## 项目结构

```
SwiftAV/
├── packages/
│   ├── @swiftav/
│   │   ├── entities/              # Entities 层（实体层）
│   │   ├── use-cases/             # Use Cases 层（用例层）
│   │   ├── infrastructure-media/  # Infrastructure 层（基础设施层 - 媒体）
│   │   ├── infrastructure-render/ # Infrastructure 层（基础设施层 - 渲染）
│   │   ├── infrastructure-storage/# Infrastructure 层（基础设施层 - 存储）
│   │   └── sdk/                   # Facade 层（门面层）
│   └── swiftav/                   # Presentation 层（表示层 - React 应用）
├── pnpm-workspace.yaml             # pnpm workspaces 配置
└── package.json                    # 根 package.json（统一脚本）
```

## 整洁架构层次

项目遵循整洁架构原则，各包对应不同的架构层。根据整洁架构的经典分层（如 Robert C. Martin 的 Clean Architecture 图），各层对应关系如下：

```
┌─────────────────────────────────────────┐
│   Interface Adapters Layer (适配器层)   │
│   swiftav                               │
│   - Controllers (控制器)                │
│   - Stores (状态管理)                   │
│   - React Components (组件/Presenters)  │
│   对应：Interface Adapters (绿色层)     │
│   - Controllers: 处理输入，调用 Use Cases│
│   - Presenters: 展示数据                 │
└─────────────────────────────────────────┘
              ↓ 依赖
┌─────────────────────────────────────────┐
│   Facade Layer (门面层)                 │
│   @swiftav/sdk                         │
│   - 统一导出所有层                      │
│   - 简化外部使用                        │
│   注意：不属于标准整洁架构层，为辅助层  │
└─────────────────────────────────────────┘
              ↓ 重新导出
┌─────────────────────────────────────────┐
│   Use Cases Layer (用例层)              │
│   @swiftav/use-cases                   │
│   - 业务用例实现                        │
│   - 应用服务                            │
│   - DTOs                                │
│   对应：Use Cases (红色层)             │
│   Application Business Rules            │
└─────────────────────────────────────────┘
              ↓ 依赖
┌─────────────────────────────────────────┐
│   Entities Layer (实体层)               │
│   @swiftav/entities                    │
│   - 实体和值对象                        │
│   - 仓储接口                            │
│   - 领域服务                            │
│   对应：Entities (黄色层)               │
│   Enterprise Business Rules             │
└─────────────────────────────────────────┘
              ↑ 实现
┌─────────────────────────────────────────┐
│   Infrastructure Layer (基础设施层)     │
│   @swiftav/infrastructure-media        │
│   @swiftav/infrastructure-render       │
│   @swiftav/infrastructure-storage      │
│   - Repository 实现                     │
│   - 外部服务集成                        │
│   - 框架适配                            │
│   对应：Frameworks & Drivers (浅蓝色层)│
│   - WebCodecs (Devices)                 │
│   - CanvasKit (Devices)                 │
│   - IndexedDB/LocalStorage (DB)         │
└─────────────────────────────────────────┘
```

### 整洁架构层对应说明

根据整洁架构的经典四层模型：

1. **Entities（黄色层）** - `@swiftav/entities`
   - 企业级业务规则
   - 最内层，最稳定，不依赖任何外部框架

2. **Use Cases（红色层）** - `@swiftav/use-cases`
   - 应用级业务规则
   - 定义系统如何操作，协调 Entities

3. **Interface Adapters（绿色层）** - `swiftav` (Presentation)
   - 适配器层，转换数据格式
   - 包含 Controllers、Presenters、Gateways

4. **Frameworks & Drivers（浅蓝色层）** - `@swiftav/infrastructure-*`
   - **Infrastructure 层对应此层**
   - 最外层，包含具体框架和驱动实现
   - WebCodecs、CanvasKit、数据库驱动等
   - 实现 Entities 层定义的 Repository 接口

## 安装依赖

在项目根目录运行：

```bash
pnpm install
```

## 开发

### 运行应用

```bash
# 运行 SwiftAV 应用
pnpm dev

# 或者直接进入包目录
cd packages/swiftav
pnpm dev
```

### 构建包

```bash
# 构建所有包
pnpm build

# 构建特定层
pnpm build:entities          # 构建实体层
pnpm build:use-cases         # 构建用例层
pnpm build:infrastructure-media   # 构建媒体基础设施
pnpm build:infrastructure-render  # 构建渲染基础设施
pnpm build:infrastructure-storage # 构建存储基础设施
pnpm build:sdk               # 构建 SDK
pnpm build:app              # 构建应用
```

## 包说明

### 核心业务层

#### @swiftav/entities（实体层）

**整洁架构层：Entities Layer**

- **职责**：纯业务逻辑，不依赖任何外部框架
- **包含**：
  - 实体（Entities）：Project, Clip, Track, Timeline, Layer
  - 值对象（Value Objects）：MediaSource, TimeRange, Transform
  - 仓储接口（Repository Interfaces）：IMediaRepository, IProjectRepository, IRenderRepository
  - 领域服务（Domain Services）：TimelineService, ClipService
- **原则**：
  - ✅ 纯 TypeScript，无外部依赖
  - ✅ Repository 只定义接口，不提供实现
  - ❌ 不依赖其他业务层

#### @swiftav/use-cases（用例层）

**整洁架构层：Use Cases Layer**

- **职责**：实现业务用例，协调实体对象
- **包含**：
  - Use Cases：AddClip, RemoveClip, TrimClip, SplitClip, MoveClip, AddTrack, RemoveTrack, ImportMedia, DecodeMedia, PreviewRender, ExportRender
  - Application Services：EditorService, MediaService
  - DTOs：ClipDTO, TrackDTO, ProjectDTO
- **原则**：
  - ✅ 依赖 Entities 层的接口
  - ✅ 每个 Use Case 只做一件事
  - ❌ 不直接依赖 Infrastructure 的具体实现

### 基础设施层

#### @swiftav/infrastructure-media（媒体基础设施）

**整洁架构层：Frameworks & Drivers Layer（最外层 - 浅蓝色）**

- **职责**：实现媒体相关的 Repository 接口
- **对应整洁架构图**：Frameworks & Drivers 层中的 Devices（WebCodecs）
- **包含**：
  - MediaRepository（媒体仓储实现）
  - WebCodecs 编解码器封装（Devices）
  - MP4 容器解析（External Interfaces）
- **原则**：
  - ✅ 实现 Entities 层定义的 IMediaRepository 接口
  - ✅ 封装 WebCodecs API（具体框架实现）
  - ❌ 不包含业务逻辑

#### @swiftav/infrastructure-render（渲染基础设施）

**整洁架构层：Frameworks & Drivers Layer（最外层 - 浅蓝色）**

- **职责**：实现渲染相关的 Repository 接口
- **对应整洁架构图**：Frameworks & Drivers 层中的 Devices（CanvasKit）
- **包含**：
  - RenderRepository（渲染仓储实现）
  - CanvasKit 封装（Devices）
  - 渲染管道（External Interfaces）
- **原则**：
  - ✅ 实现 Entities 层定义的 IRenderRepository 接口
  - ✅ 封装 CanvasKit API（具体框架实现）
  - ❌ 不包含业务逻辑

#### @swiftav/infrastructure-storage（存储基础设施）

**整洁架构层：Frameworks & Drivers Layer（最外层 - 浅蓝色）**

- **职责**：实现项目存储相关的 Repository 接口
- **对应整洁架构图**：Frameworks & Drivers 层中的 DB（数据库驱动）
- **包含**：
  - ProjectRepository（存储仓储实现）
  - LocalStorage 适配器（DB）
  - IndexedDB 适配器（DB）
- **原则**：
  - ✅ 实现 Entities 层定义的 IProjectRepository 接口
  - ✅ 支持多种存储后端（具体数据库驱动实现）
  - ❌ 不包含业务逻辑

### 门面层

#### @swiftav/sdk（SDK 门面层）

**整洁架构层：Facade Layer**

- **职责**：为外部使用者提供统一的入口
- **包含**：
  - 重新导出所有层的公共 API
  - 隐藏内部包结构，简化导入
- **原则**：
  - ✅ 门面模式，不添加业务逻辑
  - ✅ 可选使用，内部项目可直接使用各层包
  - ✅ 外部友好，只需导入一个包

**使用方式：**

```typescript
import {
  Project,
  EditorService,
  MediaRepository,
  RenderRepository,
  ProjectRepository,
} from '@swiftav/sdk';
```

### 表示层

#### swiftav（React 应用）

**整洁架构层：Interface Adapters Layer（绿色层）**

- **职责**：用户界面和交互
- **对应整洁架构图**：Interface Adapters 层中的 UI（User Interface）
- **包含**：
  - **Controllers**（Interface Adapters）：处理用户输入，调用 Use Cases，更新 Store
    - `EditorController` - 编辑器控制器
    - 职责：接收组件事件 → 调用 Use Cases → 更新 Store
  - **Stores**：状态管理（Zustand）
    - `editorStore` - 编辑器状态
    - 职责：纯状态管理，不包含业务逻辑
  - **Components**（Presenters）：React 组件
    - UI 组件，展示数据，调用 Controller
    - 职责：展示状态，处理用户交互
- **架构流程**：
  ```
  用户操作 → React 组件 → Controller → Use Cases → 更新 Store → 组件重新渲染
  ```
- **文件结构**：
  ```
  packages/swiftav/src/
  ├── controllers/        # Controller 层（Interface Adapters）
  │   ├── EditorController.ts
  │   ├── index.ts
  │   └── README.md
  ├── stores/            # Store 层（状态管理）
  │   ├── editorStore.ts
  │   └── index.ts
  └── components/         # Presenter 层（UI 组件）
      └── editor/
  ```

- **为什么 Controllers 在应用内？**
  - Controllers 依赖 Zustand Store，是 React 应用特定的
  - 当前只有一个前端应用，不需要跨框架复用
  - 保持架构简单，避免过度设计
  - 如果未来需要支持多个前端应用，可以考虑独立成 `@swiftav/interface-adapters` 包
- **使用示例**：
  ```typescript
  import { useEditorStore, editorController } from '@/stores';
  
  function MyComponent() {
    const { project, isLoading } = useEditorStore();
    
    const handleAddTrack = async () => {
      await editorController.addTrack('track-1', 'video');
    };
    
    return <button onClick={handleAddTrack}>Add Track</button>;
  }
  ```
- **Controller 层职责**：
  - ✅ 接收用户输入（来自 React 组件）
  - ✅ 调用 Use Cases / Application Services
  - ✅ 处理业务异常和错误
  - ✅ 更新 Store 状态
  - ❌ 不包含业务逻辑（业务逻辑在 Use Cases 层）
  - ❌ 不直接操作 UI（由 Component 负责）

- **架构原则**：
  - ✅ Controller 负责业务协调，调用 Use Cases
  - ✅ Store 只负责状态管理，不包含业务逻辑
  - ✅ 组件通过 Controller 执行业务操作
  - ✅ 单向数据流：Component → Controller → Use Cases → Store → Component
  - ✅ 适配数据格式，连接 UI 和业务逻辑

## 脚本命令

### 开发
- `pnpm dev` - 运行应用开发服务器

### 构建
- `pnpm build` - 构建所有包和应用
- `pnpm build:packages` - 仅构建所有包
- `pnpm build:entities` - 构建实体层
- `pnpm build:use-cases` - 构建用例层
- `pnpm build:infrastructure-media` - 构建媒体基础设施
- `pnpm build:infrastructure-render` - 构建渲染基础设施
- `pnpm build:infrastructure-storage` - 构建存储基础设施
- `pnpm build:sdk` - 构建 SDK
- `pnpm build:app` - 构建应用

### 其他
- `pnpm lint` - 运行所有包的 lint 检查
- `pnpm preview` - 预览构建后的应用
- `pnpm clean` - 清理所有构建产物

## 技术栈

- **架构模式**: 整洁架构（Clean Architecture）
- **包管理**: pnpm workspaces
- **应用框架**: React + TypeScript + Vite
- **媒体处理**: WebCodecs API
- **渲染引擎**: CanvasKit
- **存储**: IndexedDB / LocalStorage
