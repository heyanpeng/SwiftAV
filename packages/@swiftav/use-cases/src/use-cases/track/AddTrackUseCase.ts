/**
 * 添加轨道用例
 */
import { Track, VideoTrack, AudioTrack, Project } from '@swiftav/entities';

export interface AddTrackRequest {
  trackId: string;
  type: 'video' | 'audio';
}

export class AddTrackUseCase {
  async execute(
    project: Project,
    request: AddTrackRequest,
  ): Promise<Track> {
    // 检查轨道是否已存在
    if (project.getTrack(request.trackId)) {
      throw new Error(`Track ${request.trackId} already exists`);
    }

    const track: Track =
      request.type === 'video'
        ? new VideoTrack(request.trackId)
        : new AudioTrack(request.trackId);

    project.addTrack(track);
    return track;
  }
}
