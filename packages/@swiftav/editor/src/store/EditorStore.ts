/**
 * 编辑器状态管理
 */

import { Timeline } from '../timeline';
import { Track } from '../track';
import { History } from '../operation';

export type EditorState = 'idle' | 'playing' | 'paused' | 'rendering';

export class EditorStore {
  timeline: Timeline;
  tracks: Track[];
  state: EditorState;
  history: History;

  constructor() {
    this.timeline = new Timeline();
    this.tracks = [];
    this.state = 'idle';
    this.history = new History();
  }

  /**
   * 添加轨道
   */
  addTrack(track: Track): void {
    this.tracks.push(track);
  }

  /**
   * 移除轨道
   */
  removeTrack(trackId: string): void {
    this.tracks = this.tracks.filter((track) => track.id !== trackId);
  }

  /**
   * 获取轨道
   */
  getTrack(trackId: string): Track | undefined {
    return this.tracks.find((track) => track.id === trackId);
  }

  /**
   * 设置状态
   */
  setState(state: EditorState): void {
    this.state = state;
  }

  /**
   * 播放
   */
  play(): void {
    this.state = 'playing';
  }

  /**
   * 暂停
   */
  pause(): void {
    this.state = 'paused';
  }

  /**
   * 停止
   */
  stop(): void {
    this.state = 'idle';
    this.timeline.seek(0);
  }
}
