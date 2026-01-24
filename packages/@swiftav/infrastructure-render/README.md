# @swiftav/infrastructure-render

渲染基础设施层 - CanvasKit 渲染引擎实现

## 概述

实现渲染相关的 Repository 接口，提供：
- CanvasKit 封装
- 渲染管道
- 图层渲染

## 结构

```
src/
├── repositories/      # Repository 实现
│   └── RenderRepository.ts
├── canvas/           # CanvasKit 管理
│   └── CanvasKitManager.ts
└── pipeline/         # 渲染管道
    └── RenderPipeline.ts
```

## 使用示例

```typescript
import { RenderRepository } from '@swiftav/infrastructure-render';
import { Layer } from '@swiftav/entities';

const repository = new RenderRepository();
const result = await repository.render(layers, {
  width: 1920,
  height: 1080,
  fps: 30,
});
```

## 原则

- ✅ 实现 Domain 层定义的 IRenderRepository 接口
- ✅ 封装 CanvasKit API
- ✅ 处理渲染管道
- ❌ 不包含业务逻辑
