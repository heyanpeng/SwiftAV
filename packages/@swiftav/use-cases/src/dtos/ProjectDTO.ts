/**
 * 项目数据传输对象
 */
import { TrackDTO } from './TrackDTO';

export interface ProjectDTO {
  id: string;
  name: string;
  duration: number;
  currentTime: number;
  zoom: number;
  tracks: TrackDTO[];
  createdAt: string;
  updatedAt: string;
}
