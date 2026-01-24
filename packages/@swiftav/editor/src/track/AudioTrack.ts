/**
 * 音频轨道
 */

import { Track } from './Track';

export class AudioTrack extends Track {
  constructor(id: string) {
    super(id, 'audio');
  }
}
