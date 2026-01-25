# @swiftav/infra-media

媒体基础设施层 - WebCodecs 和容器解析实现

## 概述

实现媒体相关的 Repository 接口，提供：
- WebCodecs 编解码器封装
- MP4 容器解析
- 媒体文件处理

## 结构

```
src/
├── repositories/      # Repository 实现
│   └── MediaRepository.ts
├── codecs/           # WebCodecs 封装
│   ├── WebCodecsVideoDecoder.ts
│   ├── WebCodecsAudioDecoder.ts
│   ├── WebCodecsVideoEncoder.ts
│   └── WebCodecsAudioEncoder.ts
└── containers/       # 容器解析
    └── MP4Parser.ts
```

## 使用示例

```typescript
import { MediaRepository } from '@swiftav/infra-media';
import { MediaSource } from '@swiftav/entities';

const repository = new MediaRepository();
const source = new MediaSource('file', file);
const videoData = await repository.decodeVideo(source);
```

## 原则

- ✅ 实现 Domain 层定义的 Repository 接口
- ✅ 封装 WebCodecs API
- ✅ 处理文件系统操作
- ❌ 不包含业务逻辑
