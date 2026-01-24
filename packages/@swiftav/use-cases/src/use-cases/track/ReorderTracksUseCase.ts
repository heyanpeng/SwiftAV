/**
 * 重新排序轨道用例
 */
import { Project } from '@swiftav/entities';

export interface ReorderTracksRequest {
  trackIds: string[];
}

export class ReorderTracksUseCase {
  async execute(
    project: Project,
    request: ReorderTracksRequest,
  ): Promise<void> {
    // 验证所有轨道 ID 都存在
    const existingIds = project.tracks.map((t) => t.id);
    for (const id of request.trackIds) {
      if (!existingIds.includes(id)) {
        throw new Error(`Track ${id} not found`);
      }
    }

    // 这里需要 Project 实体支持重新排序功能
    // 暂时只做验证，实际排序逻辑需要在 Project 实体中实现
    // TODO: 在 Project 实体中添加 reorderTracks 方法
  }
}
