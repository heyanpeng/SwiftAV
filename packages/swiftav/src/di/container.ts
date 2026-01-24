/**
 * 依赖注入容器
 */
import {
  ClipService,
  TimelineService,
  AddClipUseCase,
  RemoveClipUseCase,
  TrimClipUseCase,
  SplitClipUseCase,
  MoveClipUseCase,
  AddTrackUseCase,
  RemoveTrackUseCase,
  ReorderTracksUseCase,
  ImportMediaUseCase,
  DecodeMediaUseCase,
  ProcessMediaUseCase,
  PreviewRenderUseCase,
  ExportRenderUseCase,
  EditorService,
  MediaService,
  MediaRepository,
  RenderRepository,
  ProjectRepository,
} from '@swiftav/sdk';

class Container {
  private instances = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.instances.set(key, factory());
  }

  get<T>(key: string): T {
    const instance = this.instances.get(key);
    if (!instance) {
      throw new Error(`Service ${key} not found`);
    }
    return instance as T;
  }

  has(key: string): boolean {
    return this.instances.has(key);
  }
}

const container = new Container();

// 注册领域服务
container.register('ClipService', () => new ClipService());
container.register('TimelineService', () => new TimelineService());

// 注册基础设施 Repository
container.register('MediaRepository', () => new MediaRepository());
container.register('RenderRepository', () => new RenderRepository());
container.register('ProjectRepository', () => new ProjectRepository('indexedDB'));

// 注册编辑器 Use Cases
container.register('AddClipUseCase', () =>
  new AddClipUseCase(container.get<ClipService>('ClipService')),
);
container.register('RemoveClipUseCase', () => new RemoveClipUseCase());
container.register('TrimClipUseCase', () => new TrimClipUseCase());
container.register('SplitClipUseCase', () => new SplitClipUseCase());
container.register('MoveClipUseCase', () =>
  new MoveClipUseCase(container.get<ClipService>('ClipService')),
);

// 注册轨道 Use Cases
container.register('AddTrackUseCase', () => new AddTrackUseCase());
container.register('RemoveTrackUseCase', () => new RemoveTrackUseCase());
container.register('ReorderTracksUseCase', () => new ReorderTracksUseCase());

// 注册媒体 Use Cases
container.register('ImportMediaUseCase', () =>
  new ImportMediaUseCase(container.get<MediaRepository>('MediaRepository')),
);
container.register('DecodeMediaUseCase', () =>
  new DecodeMediaUseCase(container.get<MediaRepository>('MediaRepository')),
);
container.register('ProcessMediaUseCase', () =>
  new ProcessMediaUseCase(container.get<MediaRepository>('MediaRepository')),
);

// 注册渲染 Use Cases
container.register('PreviewRenderUseCase', () =>
  new PreviewRenderUseCase(container.get<RenderRepository>('RenderRepository')),
);
container.register('ExportRenderUseCase', () =>
  new ExportRenderUseCase(
    container.get<RenderRepository>('RenderRepository'),
    container.get<MediaRepository>('MediaRepository'),
  ),
);

// 注册应用服务
container.register('EditorService', () =>
  new EditorService(
    container.get<TimelineService>('TimelineService'),
    container.get<ClipService>('ClipService'),
    container.get<AddClipUseCase>('AddClipUseCase'),
    container.get<RemoveClipUseCase>('RemoveClipUseCase'),
    container.get<TrimClipUseCase>('TrimClipUseCase'),
    container.get<SplitClipUseCase>('SplitClipUseCase'),
    container.get<MoveClipUseCase>('MoveClipUseCase'),
    container.get<AddTrackUseCase>('AddTrackUseCase'),
    container.get<RemoveTrackUseCase>('RemoveTrackUseCase'),
  ),
);

container.register('MediaService', () =>
  new MediaService(
    container.get<MediaRepository>('MediaRepository'),
    container.get<ImportMediaUseCase>('ImportMediaUseCase'),
    container.get<DecodeMediaUseCase>('DecodeMediaUseCase'),
    container.get<ProcessMediaUseCase>('ProcessMediaUseCase'),
  ),
);

export default container;
