# @swiftav/video

视频处理层 - 视频编解码、处理和合成

## 职责

- 视频解码：将视频文件解码为 VideoFrame
- 视频编码：将 VideoFrame 编码为视频文件
- 视频处理：裁剪、缩放、滤镜、转场、速度调节
- 视频合成：多视频轨道合成、添加文字/贴纸/形状、画中画效果

## 使用

```typescript
import { VideoDecoder, VideoProcessor, VideoComposer } from '@swiftav/video';
```
