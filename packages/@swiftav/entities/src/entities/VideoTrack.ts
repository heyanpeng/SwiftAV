/**
 * 视频轨道实体
 */
import { Track } from './Track';

export class VideoTrack extends Track {
  constructor(id: string) {
    super(id, 'video');
  }
}
