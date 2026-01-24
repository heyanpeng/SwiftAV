/**
 * 编辑器应用服务
 */
import {
  Project,
  Track,
  Clip,
  TimelineService,
  ClipService,
} from '@swiftav/entities';
import {
  AddClipUseCase,
  RemoveClipUseCase,
  TrimClipUseCase,
  SplitClipUseCase,
  MoveClipUseCase,
} from '../use-cases/editor';
import {
  AddTrackUseCase,
  RemoveTrackUseCase,
} from '../use-cases/track';

export class EditorService {
  constructor(
    private timelineService: TimelineService,
    private clipService: ClipService,
    private addClipUseCase: AddClipUseCase,
    private removeClipUseCase: RemoveClipUseCase,
    private trimClipUseCase: TrimClipUseCase,
    private splitClipUseCase: SplitClipUseCase,
    private moveClipUseCase: MoveClipUseCase,
    private addTrackUseCase: AddTrackUseCase,
    private removeTrackUseCase: RemoveTrackUseCase,
  ) {}

  /**
   * 添加片段到轨道
   */
  async addClip(
    project: Project,
    trackId: string,
    clipData: Parameters<AddClipUseCase['execute']>[1],
  ): Promise<Clip> {
    const track = project.getTrack(trackId);
    if (!track) {
      throw new Error(`Track ${trackId} not found`);
    }

    const clip = await this.addClipUseCase.execute(track, clipData);
    this.timelineService.updateTimelineDuration(project.timeline, [...project.tracks]);
    return clip;
  }

  /**
   * 移除片段
   */
  async removeClip(
    project: Project,
    trackId: string,
    clipId: string,
  ): Promise<void> {
    const track = project.getTrack(trackId);
    if (!track) {
      throw new Error(`Track ${trackId} not found`);
    }

    await this.removeClipUseCase.execute(track, clipId);
    this.timelineService.updateTimelineDuration(project.timeline, [...project.tracks]);
  }

  /**
   * 裁剪片段
   */
  async trimClip(
    project: Project,
    trackId: string,
    clipId: string,
    start: number,
    end: number,
  ): Promise<Clip> {
    const track = project.getTrack(trackId);
    if (!track) {
      throw new Error(`Track ${trackId} not found`);
    }

    return await this.trimClipUseCase.execute(track, {
      trackId,
      clipId,
      start,
      end,
    });
  }

  /**
   * 分割片段
   */
  async splitClip(
    project: Project,
    trackId: string,
    clipId: string,
    time: number,
  ): Promise<Clip[]> {
    const track = project.getTrack(trackId);
    if (!track) {
      throw new Error(`Track ${trackId} not found`);
    }

    return await this.splitClipUseCase.execute(track, {
      trackId,
      clipId,
      time,
    });
  }

  /**
   * 移动片段
   */
  async moveClip(
    project: Project,
    trackId: string,
    clipId: string,
    newStartTime: number,
  ): Promise<Clip> {
    const track = project.getTrack(trackId);
    if (!track) {
      throw new Error(`Track ${trackId} not found`);
    }

    return await this.moveClipUseCase.execute(track, {
      trackId,
      clipId,
      newStartTime,
    });
  }

  /**
   * 添加轨道
   */
  async addTrack(
    project: Project,
    trackId: string,
    type: 'video' | 'audio',
  ): Promise<Track> {
    return await this.addTrackUseCase.execute(project, {
      trackId,
      type,
    });
  }

  /**
   * 移除轨道
   */
  async removeTrack(project: Project, trackId: string): Promise<void> {
    await this.removeTrackUseCase.execute(project, trackId);
    this.timelineService.updateTimelineDuration(project.timeline, [...project.tracks]);
  }
}
