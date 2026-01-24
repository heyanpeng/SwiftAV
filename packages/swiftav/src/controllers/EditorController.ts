/**
 * 编辑器 Controller
 * 
 * Controller 层 - Interface Adapters Layer
 * 职责：
 * - 接收用户输入
 * - 调用 Use Cases / Application Services
 * - 更新 Store 状态
 */
import {
  Project,
  EditorService,
  ProjectRepository,
  type AddClipRequest,
} from '@swiftav/sdk';
import { container } from '../di';
import { useEditorStore } from '../stores/editorStore';

export class EditorController {
  /**
   * 创建项目
   */
  createProject(name: string): void {
    const project = new Project(
      `project-${Date.now()}`,
      name,
      0,
    );
    useEditorStore.getState().setProject(project);
  }

  /**
   * 加载项目
   */
  async loadProject(id: string): Promise<void> {
    useEditorStore.getState().setLoading(true);
    useEditorStore.getState().setError(null);

    try {
      const projectRepository = container.get<ProjectRepository>('ProjectRepository');
      const project = await projectRepository.findById(id);
      if (!project) {
        throw new Error(`Project ${id} not found`);
      }
      useEditorStore.getState().setProject(project);
      useEditorStore.getState().setLoading(false);
    } catch (error) {
      useEditorStore.getState().setError(
        error instanceof Error ? error.message : 'Failed to load project'
      );
      useEditorStore.getState().setLoading(false);
    }
  }

  /**
   * 保存项目
   */
  async saveProject(): Promise<void> {
    const project = useEditorStore.getState().project;
    if (!project) {
      useEditorStore.getState().setError('No project to save');
      return;
    }

    useEditorStore.getState().setLoading(true);
    useEditorStore.getState().setError(null);

    try {
      const projectRepository = container.get<ProjectRepository>('ProjectRepository');
      await projectRepository.save(project);
      useEditorStore.getState().setLoading(false);
    } catch (error) {
      useEditorStore.getState().setError(
        error instanceof Error ? error.message : 'Failed to save project'
      );
      useEditorStore.getState().setLoading(false);
    }
  }

  /**
   * 添加轨道
   */
  async addTrack(trackId: string, type: 'video' | 'audio'): Promise<void> {
    const project = useEditorStore.getState().project;
    if (!project) {
      useEditorStore.getState().setError('No project loaded');
      return;
    }

    try {
      const editorService = container.get<EditorService>('EditorService');
      await editorService.addTrack(project, trackId, type);
      useEditorStore.getState().setProject(project); // 更新项目引用
      useEditorStore.getState().setError(null);
    } catch (error) {
      useEditorStore.getState().setError(
        error instanceof Error ? error.message : 'Failed to add track'
      );
    }
  }

  /**
   * 移除轨道
   */
  async removeTrack(trackId: string): Promise<void> {
    const project = useEditorStore.getState().project;
    if (!project) {
      useEditorStore.getState().setError('No project loaded');
      return;
    }

    try {
      const editorService = container.get<EditorService>('EditorService');
      await editorService.removeTrack(project, trackId);
      useEditorStore.getState().setProject(project); // 更新项目引用
      useEditorStore.getState().setError(null);
    } catch (error) {
      useEditorStore.getState().setError(
        error instanceof Error ? error.message : 'Failed to remove track'
      );
    }
  }

  /**
   * 添加片段
   */
  async addClip(request: AddClipRequest): Promise<void> {
    const project = useEditorStore.getState().project;
    if (!project) {
      useEditorStore.getState().setError('No project loaded');
      return;
    }

    try {
      const editorService = container.get<EditorService>('EditorService');
      await editorService.addClip(project, request.trackId, request);
      useEditorStore.getState().setProject(project); // 更新项目引用
      useEditorStore.getState().setError(null);
    } catch (error) {
      useEditorStore.getState().setError(
        error instanceof Error ? error.message : 'Failed to add clip'
      );
    }
  }

  /**
   * 移除片段
   */
  async removeClip(trackId: string, clipId: string): Promise<void> {
    const project = useEditorStore.getState().project;
    if (!project) {
      useEditorStore.getState().setError('No project loaded');
      return;
    }

    try {
      const editorService = container.get<EditorService>('EditorService');
      await editorService.removeClip(project, trackId, clipId);
      useEditorStore.getState().setProject(project); // 更新项目引用
      useEditorStore.getState().setError(null);
    } catch (error) {
      useEditorStore.getState().setError(
        error instanceof Error ? error.message : 'Failed to remove clip'
      );
    }
  }

  /**
   * 裁剪片段
   */
  async trimClip(
    trackId: string,
    clipId: string,
    start: number,
    end: number,
  ): Promise<void> {
    const project = useEditorStore.getState().project;
    if (!project) {
      useEditorStore.getState().setError('No project loaded');
      return;
    }

    try {
      const editorService = container.get<EditorService>('EditorService');
      await editorService.trimClip(project, trackId, clipId, start, end);
      useEditorStore.getState().setProject(project); // 更新项目引用
      useEditorStore.getState().setError(null);
    } catch (error) {
      useEditorStore.getState().setError(
        error instanceof Error ? error.message : 'Failed to trim clip'
      );
    }
  }

  /**
   * 分割片段
   */
  async splitClip(trackId: string, clipId: string, time: number): Promise<void> {
    const project = useEditorStore.getState().project;
    if (!project) {
      useEditorStore.getState().setError('No project loaded');
      return;
    }

    try {
      const editorService = container.get<EditorService>('EditorService');
      await editorService.splitClip(project, trackId, clipId, time);
      useEditorStore.getState().setProject(project); // 更新项目引用
      useEditorStore.getState().setError(null);
    } catch (error) {
      useEditorStore.getState().setError(
        error instanceof Error ? error.message : 'Failed to split clip'
      );
    }
  }

  /**
   * 移动片段
   */
  async moveClip(
    trackId: string,
    clipId: string,
    newStartTime: number,
  ): Promise<void> {
    const project = useEditorStore.getState().project;
    if (!project) {
      useEditorStore.getState().setError('No project loaded');
      return;
    }

    try {
      const editorService = container.get<EditorService>('EditorService');
      await editorService.moveClip(project, trackId, clipId, newStartTime);
      useEditorStore.getState().setProject(project); // 更新项目引用
      useEditorStore.getState().setError(null);
    } catch (error) {
      useEditorStore.getState().setError(
        error instanceof Error ? error.message : 'Failed to move clip'
      );
    }
  }

  /**
   * 时间线定位
   */
  seek(time: number): void {
    const project = useEditorStore.getState().project;
    if (project) {
      project.timeline.seek(time);
      useEditorStore.getState().setProject(project); // 更新项目引用
    }
  }

  /**
   * 设置缩放
   */
  setZoom(zoom: number): void {
    const project = useEditorStore.getState().project;
    if (project) {
      project.timeline.setZoom(zoom);
      useEditorStore.getState().setProject(project); // 更新项目引用
    }
  }
}

// 导出单例实例
export const editorController = new EditorController();
