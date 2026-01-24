/**
 * 编辑器相关类型定义
 */

export type TrackType = 'video' | 'audio';

export type EditorState = 'idle' | 'playing' | 'paused' | 'rendering';

export interface Clip {
  id: string;
  startTime: number;
  duration: number;
  inPoint: number;
  outPoint: number;
}

export interface Timeline {
  duration: number;
  currentTime: number;
  zoom: number;
}
