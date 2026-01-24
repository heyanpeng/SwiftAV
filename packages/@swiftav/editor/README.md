# @swiftav/editor

编辑器核心 - 编辑器业务逻辑和状态管理

## 职责

- 时间轴管理：时间轴缩放、播放头控制、时间单位转换
- 轨道管理：视频轨道、音频轨道、轨道添加/删除
- 片段管理：片段创建、删除、移动、裁剪、分割
- 编辑操作：撤销/重做、复制/粘贴、批量操作
- 状态管理：编辑器状态、项目数据、历史记录

## 使用

```typescript
import { Editor, Timeline, Track, Clip } from '@swiftav/editor';
```
