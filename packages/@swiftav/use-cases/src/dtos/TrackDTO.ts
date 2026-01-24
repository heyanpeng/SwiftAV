/**
 * 轨道数据传输对象
 */
import { ClipDTO } from './ClipDTO';

export interface TrackDTO {
  id: string;
  type: 'video' | 'audio';
  clips: ClipDTO[];
  locked: boolean;
  muted: boolean;
}
