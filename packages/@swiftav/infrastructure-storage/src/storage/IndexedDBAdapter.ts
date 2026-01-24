/**
 * IndexedDB 适配器
 */
import { Project } from '@swiftav/entities';

const DB_NAME = 'swiftav_db';
const STORE_NAME = 'projects';
const DB_VERSION = 1;

export class IndexedDBAdapter {
  private db: IDBDatabase | null = null;

  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * 保存项目
   */
  async save(project: Project): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const data = this.serializeProject(project);
      const request = store.put(data);

      request.onerror = () => {
        reject(new Error('Failed to save project'));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  /**
   * 获取项目
   */
  async get(id: string): Promise<Project | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => {
        reject(new Error('Failed to get project'));
      };

      request.onsuccess = () => {
        const data = request.result;
        if (!data) {
          resolve(null);
          return;
        }
        const project = this.deserializeProject(data);
        resolve(project);
      };
    });
  }

  /**
   * 获取所有项目
   */
  async getAll(): Promise<Project[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => {
        reject(new Error('Failed to get all projects'));
      };

      request.onsuccess = () => {
        const results = request.result;
        const projects = results.map((data) => this.deserializeProject(data));
        resolve(projects);
      };
    });
  }

  /**
   * 删除项目
   */
  async delete(id: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => {
        reject(new Error('Failed to delete project'));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  /**
   * 检查项目是否存在
   */
  async exists(id: string): Promise<boolean> {
    const project = await this.get(id);
    return project !== null;
  }

  /**
   * 序列化项目
   */
  private serializeProject(project: Project): any {
    // TODO: 实现完整的序列化逻辑
    return {
      id: project.id,
      name: project.name,
      // 其他字段...
    };
  }

  /**
   * 反序列化项目
   */
  private deserializeProject(data: any): Project {
    // TODO: 实现完整的反序列化逻辑
    // 需要从数据重建 Project 实体
    throw new Error('Deserialization not yet implemented');
  }
}
