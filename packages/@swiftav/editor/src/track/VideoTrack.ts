/**
 * 视频轨道
 */

import { Track } from './Track';

export class VideoTrack extends Track {
  constructor(id: string) {
    super(id, 'video');
  }
}
