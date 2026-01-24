# @swiftav/sdk

SwiftAV SDK - 统一入口（门面层）

## 概述

SDK 包是一个**门面层（Facade Layer）**，不属于整洁架构的业务层，而是：
- 为外部使用者提供统一的入口
- 重新导出所有层的公共 API
- 隐藏内部包结构，简化导入

## 在整洁架构中的位置

```
┌─────────────────────────────────────────┐
│   SDK Layer (门面层)                    │
│   @swiftav/sdk                         │
│   - 统一导出所有层                     │
│   - 不包含业务逻辑                     │
└─────────────────────────────────────────┘
              ↓ 重新导出
┌─────────────────────────────────────────┐
│   Entities Layer (实体层)               │
│   Use Cases Layer (用例层)               │
│   Infrastructure Layer (基础设施层)      │
└─────────────────────────────────────────┘
```

**重要说明**：
- SDK 层**不属于** Domain、Application、Infrastructure 或 Presentation 层
- 它是一个**适配器/门面层**，用于简化外部使用
- 内部项目可以直接使用各层包，不需要通过 SDK

## 架构层次

SDK 重新导出以下层的功能：

### Entities 层
- 实体（Entities）：Project, Clip, Track, Timeline, Layer
- 值对象（Value Objects）：MediaSource, TimeRange, Transform
- 仓储接口（Repository Interfaces）：IMediaRepository, IProjectRepository, IRenderRepository
- 领域服务（Domain Services）：TimelineService, ClipService

### Use Cases 层
- Use Cases：AddClip, RemoveClip, TrimClip, SplitClip, MoveClip, AddTrack, RemoveTrack, ImportMedia, DecodeMedia, PreviewRender, ExportRender
- Application Services：EditorService, MediaService
- DTOs：ClipDTO, TrackDTO, ProjectDTO

### Infrastructure 层
- MediaRepository（媒体仓储实现）
- RenderRepository（渲染仓储实现）
- ProjectRepository（存储仓储实现）

## 使用示例

### 外部项目使用 SDK

```typescript
import {
  Project,
  MediaSource,
  EditorService,
  MediaRepository,
  RenderRepository,
  ProjectRepository,
} from '@swiftav/sdk';

// 创建项目
const project = new Project('project-1', 'My Project');

// 使用仓储
const mediaRepo = new MediaRepository();
const renderRepo = new RenderRepository();
const projectRepo = new ProjectRepository();

// 使用应用服务（需要手动组装依赖）
const editorService = new EditorService(
  new TimelineService(),
  new ClipService(),
  // ... 其他依赖
);
```

### 内部项目使用 SDK（推荐）

```typescript
// 统一通过 SDK 导入
import {
  Project,
  EditorService,
  MediaRepository,
  RenderRepository,
  ProjectRepository,
} from '@swiftav/sdk';

// 使用依赖注入容器
import { container } from './di';
const editorService = container.get<EditorService>('EditorService');
```

**注意**：内部项目也可以直接使用各层包，但通过 SDK 可以：
- 统一管理依赖
- 简化导入路径
- 保持与外部使用者一致的 API

## 包说明

SDK 依赖以下包：
- `@swiftav/entities` - 实体层
- `@swiftav/use-cases` - 用例层
- `@swiftav/infrastructure-media` - 媒体基础设施
- `@swiftav/infrastructure-render` - 渲染基础设施
- `@swiftav/infrastructure-storage` - 存储基础设施

## 设计原则

1. **门面模式**：为复杂的子系统提供简单的统一接口
2. **不添加业务逻辑**：只负责重新导出，不包含任何业务逻辑
3. **可选使用**：内部项目可以直接使用各层包，不需要通过 SDK
4. **外部友好**：外部使用者只需导入一个包即可使用所有功能
