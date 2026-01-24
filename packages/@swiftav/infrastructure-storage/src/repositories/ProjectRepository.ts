/**
 * 项目仓储实现
 */
import { IProjectRepository, Project } from '@swiftav/entities';
import { LocalStorageAdapter } from '../storage/LocalStorageAdapter';
import { IndexedDBAdapter } from '../storage/IndexedDBAdapter';

export type StorageType = 'localStorage' | 'indexedDB';

export class ProjectRepository implements IProjectRepository {
  private localStorageAdapter: LocalStorageAdapter;
  private indexedDBAdapter: IndexedDBAdapter;
  private storageType: StorageType;

  constructor(storageType: StorageType = 'indexedDB') {
    this.storageType = storageType;
    this.localStorageAdapter = new LocalStorageAdapter();
    this.indexedDBAdapter = new IndexedDBAdapter();
  }

  async save(project: Project): Promise<void> {
    if (this.storageType === 'localStorage') {
      await this.localStorageAdapter.save(project);
    } else {
      await this.indexedDBAdapter.save(project);
    }
  }

  async findById(id: string): Promise<Project | null> {
    if (this.storageType === 'localStorage') {
      return await this.localStorageAdapter.get(id);
    } else {
      return await this.indexedDBAdapter.get(id);
    }
  }

  async findAll(): Promise<Project[]> {
    if (this.storageType === 'localStorage') {
      const ids = await this.localStorageAdapter.getAllIds();
      const projects: Project[] = [];
      for (const id of ids) {
        const project = await this.localStorageAdapter.get(id);
        if (project) {
          projects.push(project);
        }
      }
      return projects;
    } else {
      return await this.indexedDBAdapter.getAll();
    }
  }

  async delete(id: string): Promise<void> {
    if (this.storageType === 'localStorage') {
      await this.localStorageAdapter.delete(id);
    } else {
      await this.indexedDBAdapter.delete(id);
    }
  }

  async exists(id: string): Promise<boolean> {
    if (this.storageType === 'localStorage') {
      return await this.localStorageAdapter.exists(id);
    } else {
      return await this.indexedDBAdapter.exists(id);
    }
  }
}
