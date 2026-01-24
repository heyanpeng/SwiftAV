/**
 * LocalStorage 适配器
 */
import { Project } from '@swiftav/entities';

export class LocalStorageAdapter {
  private readonly prefix = 'swiftav_project_';

  /**
   * 保存项目
   */
  async save(project: Project): Promise<void> {
    const key = `${this.prefix}${project.id}`;
    const data = this.serializeProject(project);
    localStorage.setItem(key, data);
  }

  /**
   * 获取项目
   */
  async get(id: string): Promise<Project | null> {
    const key = `${this.prefix}${id}`;
    const data = localStorage.getItem(key);
    if (!data) {
      return null;
    }
    return this.deserializeProject(data);
  }

  /**
   * 获取所有项目 ID
   */
  async getAllIds(): Promise<string[]> {
    const ids: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const id = key.replace(this.prefix, '');
        ids.push(id);
      }
    }
    return ids;
  }

  /**
   * 删除项目
   */
  async delete(id: string): Promise<void> {
    const key = `${this.prefix}${id}`;
    localStorage.removeItem(key);
  }

  /**
   * 检查项目是否存在
   */
  async exists(id: string): Promise<boolean> {
    const key = `${this.prefix}${id}`;
    return localStorage.getItem(key) !== null;
  }

  /**
   * 序列化项目
   */
  private serializeProject(project: Project): string {
    // TODO: 实现完整的序列化逻辑
    // 需要将 Project 实体转换为可序列化的 JSON
    return JSON.stringify({
      id: project.id,
      name: project.name,
      // 其他字段...
    });
  }

  /**
   * 反序列化项目
   */
  private deserializeProject(data: string): Project {
    // TODO: 实现完整的反序列化逻辑
    // 需要从 JSON 重建 Project 实体
    const json = JSON.parse(data);
    // 重建 Project 对象
    throw new Error('Deserialization not yet implemented');
  }
}
