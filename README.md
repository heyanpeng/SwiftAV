# SwiftAV Monorepo

这是一个使用 pnpm workspaces 组织的多包项目，采用**整洁架构（Clean Architecture）**设计。

## 项目结构

```
SwiftAV/
├── packages/
│   ├── @swiftav/
│   │   ├── entities/              # Entities 层（实体层 - 最内层）
│   │   ├── use-cases/             # Use Cases 层（用例层）
│   │   ├── interface-adapters/    # Interface Adapters 层（接口适配器层）
│   │   ├── infrastructure-media/  # Frameworks & Drivers 层（基础设施层 - 媒体）
│   │   ├── infrastructure-render/ # Frameworks & Drivers 层（基础设施层 - 渲染）
│   │   └── infrastructure-storage/# Frameworks & Drivers 层（基础设施层 - 存储）
│   └── infrastructure-web/       # Frameworks & Drivers 层（Web UI - React 应用）
├── pnpm-workspace.yaml             # pnpm workspaces 配置
└── package.json                    # 根 package.json（统一脚本）
```

## 整洁架构层次

项目遵循整洁架构原则，各包对应不同的架构层。根据整洁架构的经典分层（如 Robert C. Martin 的 Clean Architecture 图），各层对应关系如下：

```
┌─────────────────────────────────────────┐
│   Frameworks & Drivers Layer (最外层)   │
│   @swiftav/infrastructure-web (UI)   │
│   @swiftav/infrastructure-media        │
│   @swiftav/infrastructure-render       │
│   @swiftav/infrastructure-storage      │
│   - React Components (UI)               │
│   - Zustand Store 实现                  │
│   - WebCodecs (Devices)                │
│   - CanvasKit (Devices)                │
│   - IndexedDB/LocalStorage (DB)        │
│   - Repository 实现                     │
│   对应：Frameworks & Drivers (蓝色层)   │
└─────────────────────────────────────────┘
              ↓ 依赖
┌─────────────────────────────────────────┐
│   Interface Adapters Layer (适配器层)   │
│   @swiftav/interface-adapters          │
│   - Controllers (控制器)                │
│   - Presenters (表现器)                 │
│   - Gateways (网关接口)                 │
│   对应：Interface Adapters (绿色层)     │
│   - Controllers: 处理输入，调用 Use Cases│
│   - Presenters: 转换数据格式            │
└─────────────────────────────────────────┘
              ↓ 依赖
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
│   Entities Layer (实体层 - 最内层)      │
│   @swiftav/entities                    │
│   - 实体和值对象                        │
│   - 仓储接口                            │
│   - 领域服务                            │
│   对应：Entities (黄色层)               │
│   Enterprise Business Rules             │
└─────────────────────────────────────────┘
```

### 整洁架构层对应说明

根据整洁架构的经典四层模型（从内到外）：

1. **Entities（黄色层 - 最内层）** - `@swiftav/entities`
   - 企业级业务规则
   - 最内层，最稳定，不依赖任何外部框架
   - 包含实体、值对象、仓储接口、领域服务

2. **Use Cases（红色层）** - `@swiftav/use-cases`
   - 应用级业务规则
   - 定义系统如何操作，协调 Entities
   - 包含用例、应用服务、DTOs

3. **Interface Adapters（绿色层）** - `@swiftav/interface-adapters`
   - 适配器层，转换数据格式
   - 包含 Controllers、Presenters、Gateways
   - Controllers 处理输入，调用 Use Cases
   - Presenters 将用例输出转换为 UI 格式

4. **Frameworks & Drivers（蓝色层 - 最外层）** - `@swiftav/infrastructure-*`
   - 最外层，包含具体框架和驱动实现
   - **Web UI**：React 组件、Zustand Store 实现（@swiftav/infrastructure-web）
   - **Devices**：WebCodecs、CanvasKit（@swiftav/infrastructure-media, @swiftav/infrastructure-render）
   - **DB**：IndexedDB、LocalStorage（@swiftav/infrastructure-storage）
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
cd packages/infrastructure-web
pnpm dev
```

### 构建包

```bash
# 构建所有包
pnpm build

# 构建特定层
pnpm build:entities          # 构建实体层
pnpm build:use-cases         # 构建用例层
pnpm build:interface-adapters # 构建接口适配器层
pnpm build:infrastructure-media   # 构建媒体基础设施
pnpm build:infrastructure-render  # 构建渲染基础设施
pnpm build:infrastructure-storage # 构建存储基础设施
pnpm build:infrastructure-web     # 构建 Web UI 应用
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

#### @swiftav/interface-adapters（接口适配器层）

**整洁架构层：Interface Adapters Layer**

- **职责**：适配器层，转换数据格式，连接业务逻辑和外部框架
- **包含**：
  - **Controllers**：EditorController - 处理用户输入，调用 Use Cases，更新 Store
  - **Presenters**：将 Use Cases 输出转换为 UI 格式（当前主要在 React 组件中完成）
  - **Gateways**：Repository 接口定义在 Entities 层，实现在 Frameworks & Drivers 层
- **原则**：
  - ✅ 依赖 Use Cases 层和 Entities 层
  - ✅ 通过接口定义 Store，不依赖具体实现（如 Zustand）
  - ✅ Controllers 通过依赖注入接收 Use Cases 和 Repository
  - ❌ 不依赖 Frameworks & Drivers 层的具体实现

### 基础设施层（Frameworks & Drivers）

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

### 表示层（Frameworks & Drivers）

#### @swiftav/infrastructure-web（Web UI 应用）

**整洁架构层：Frameworks & Drivers Layer（最外层 - 蓝色层）**

- **职责**：用户界面和交互，框架实现
- **对应整洁架构图**：Frameworks & Drivers 层中的 UI（User Interface）
- **包含**：
  - **React Components**：UI 组件
    - 展示数据，处理用户交互
    - 调用 Controller（来自 interface-adapters 层）
  - **Store 实现**：Zustand Store 实现
    - `editorStore` - 实现 `IEditorStore` 接口
    - 职责：纯状态管理，不包含业务逻辑
  - **Controller 实例化**：创建并配置 Controller
    - 注入依赖（Use Cases、Repository、Store）
    - 导出 Controller 实例供组件使用
- **架构流程**：
  ```
  用户操作 → React 组件 → Controller (interface-adapters) → Use Cases → 更新 Store → 组件重新渲染
  ```
- **文件结构**：
  ```
  packages/infrastructure-web/src/
  ├── di/                 # 依赖注入配置（包含 Controller 实例化）
  │   ├── container.ts     # 创建所有服务实例，包括 Controller
  │   └── index.ts
  ├── stores/            # Store 实现（Frameworks & Drivers）
  │   ├── editorStore.ts  # 实现 IEditorStore 接口
  │   └── index.ts        # 导出 Store 和 Controller
  ├── components/         # React 组件（UI）
  │   └── editor/
  └── ...
  ```

- **架构说明**：
  - Controllers **定义**在 `@swiftav/interface-adapters` 包中（Interface Adapters 层）
  - Controllers **实例化**在 `src/di/container.ts` 中（依赖注入容器）
  - Store **接口**定义在 `@swiftav/interface-adapters` 包中
  - Store **实现**在 `src/stores/` 中使用 Zustand
  - 这样符合整洁架构：业务逻辑不依赖框架，框架实现依赖接口
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
- `pnpm build:entities` - 构建实体层
- `pnpm build:use-cases` - 构建用例层
- `pnpm build:infrastructure-media` - 构建媒体基础设施
- `pnpm build:infrastructure-render` - 构建渲染基础设施
- `pnpm build:infrastructure-storage` - 构建存储基础设施
- `pnpm build:infrastructure-web` - 构建 Web UI 应用

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
