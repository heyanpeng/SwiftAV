# @swiftav/entities

实体层 - 纯业务逻辑，不依赖任何外部框架

## 概述

Entities 层是整洁架构的核心，包含：
- **实体（Entities）**：核心业务对象
- **值对象（Value Objects）**：不可变的值对象
- **仓储接口（Repository Interfaces）**：数据访问抽象
- **领域服务（Domain Services）**：跨实体的业务逻辑

## 结构

```
src/
├── entities/          # 实体
│   ├── Clip.ts
│   ├── Track.ts
│   ├── Timeline.ts
│   ├── Project.ts
│   └── Layer.ts
├── value-objects/     # 值对象
│   ├── MediaSource.ts
│   ├── TimeRange.ts
│   └── Transform.ts
├── repositories/      # 仓储接口
│   ├── IMediaRepository.ts
│   ├── IProjectRepository.ts
│   └── IRenderRepository.ts
└── services/          # 领域服务
    ├── TimelineService.ts
    └── ClipService.ts
```

## 使用示例

```typescript
import { Clip, Track, Timeline, MediaSource } from '@swiftav/entities';

// 创建媒体源
const source = new MediaSource('file', file);

// 创建片段
const clip = new Clip('clip-1', 0, 10, source);

// 创建轨道
const track = new VideoTrack('track-1');
track.addClip(clip);

// 创建时间线
const timeline = new Timeline(10);
```

## 原则

- ✅ 纯 TypeScript，无外部依赖
- ✅ Repository 只定义接口，不提供实现
- ✅ 业务规则封装在实体和领域服务中
- ❌ 不依赖 Application、Infrastructure 或 Presentation 层
