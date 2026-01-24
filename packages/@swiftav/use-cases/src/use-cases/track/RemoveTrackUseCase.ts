/**
 * 移除轨道用例
 */
import { Project } from '@swiftav/entities';

export interface RemoveTrackRequest {
  trackId: string;
}

export class RemoveTrackUseCase {
  async execute(project: Project, trackId: string): Promise<void> {
    const track = project.getTrack(trackId);
    if (!track) {
      throw new Error(`Track ${trackId} not found`);
    }

    project.removeTrack(trackId);
  }
}
