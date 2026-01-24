/**
 * 媒体相关类型定义
 */

export interface MediaSource {
  type: 'file' | 'url';
  source: File | string;
}

export interface VideoTrack {
  frames: VideoFrame[];
  startTime: number;
  duration: number;
}

export interface AudioTrack {
  buffer: AudioBuffer;
  startTime: number;
  duration: number;
  volume?: number;
}
