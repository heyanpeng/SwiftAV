# @swiftav/renderer

渲染层 - CanvasKit 渲染引擎

## 职责

- 渲染引擎：管理渲染循环与帧率
- 图层管理：图层层级、变换、可见性
- 渲染管线：视频帧、文字、图形、滤镜渲染
- 性能优化：离屏渲染、缓存管理

## 使用

```typescript
import { RenderEngine, Layer, VideoLayer } from '@swiftav/renderer';
```
