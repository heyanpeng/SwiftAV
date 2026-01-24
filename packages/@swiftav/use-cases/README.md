# @swiftav/use-cases

用例层 - 实现业务用例，协调实体对象

## 概述

Use Cases 层包含：
- **Use Cases（用例）**：具体的业务操作
- **Application Services（应用服务）**：协调多个 Use Cases
- **DTOs（数据传输对象）**：跨层数据传输

## 结构

```
src/
├── use-cases/        # 用例
│   ├── editor/      # 编辑器用例
│   ├── track/       # 轨道用例
│   ├── media/       # 媒体用例
│   └── render/      # 渲染用例
├── services/         # 应用服务
│   ├── EditorService.ts
│   └── MediaService.ts
└── dtos/            # 数据传输对象
    ├── ClipDTO.ts
    ├── TrackDTO.ts
    └── ProjectDTO.ts
```

## 使用示例

```typescript
import { AddClipUseCase } from '@swiftav/use-cases';
import { ClipService } from '@swiftav/entities';

// 创建 Use Case
const clipService = new ClipService();
const addClipUseCase = new AddClipUseCase(clipService);

// 执行用例
const clip = await addClipUseCase.execute(track, {
  trackId: 'track-1',
  clipId: 'clip-1',
  startTime: 0,
  duration: 10,
  source: new MediaSource('file', file),
});
```

## 原则

- ✅ 依赖 Domain 层的接口，不依赖具体实现
- ✅ 每个 Use Case 只做一件事
- ✅ 通过依赖注入接收 Repository 实现
- ❌ 不直接依赖 Infrastructure 的具体实现
- ❌ 不依赖 Presentation 层
