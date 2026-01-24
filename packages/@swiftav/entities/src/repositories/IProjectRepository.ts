/**
 * 项目仓储接口
 */
import { Project } from '../entities/Project';

/**
 * 项目仓储接口
 */
export interface IProjectRepository {
  /**
   * 保存项目
   */
  save(project: Project): Promise<void>;

  /**
   * 根据 ID 获取项目
   */
  findById(id: string): Promise<Project | null>;

  /**
   * 获取所有项目
   */
  findAll(): Promise<Project[]>;

  /**
   * 删除项目
   */
  delete(id: string): Promise<void>;

  /**
   * 检查项目是否存在
   */
  exists(id: string): Promise<boolean>;
}
