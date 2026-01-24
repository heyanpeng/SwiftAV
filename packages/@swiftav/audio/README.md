# @swiftav/audio

音频处理层 - 音频编解码、处理和分析

## 职责

- 音频解码：将音频文件解码为 PCM
- 音频编码：将 PCM 编码为目标格式
- 音频处理：混音、音量调节、淡入淡出、音效
- 音频分析：波形图生成、频谱分析、音量检测

## 使用

```typescript
import { AudioDecoder, AudioProcessor, AudioAnalyzer } from '@swiftav/audio';
```
