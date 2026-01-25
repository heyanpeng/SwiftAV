# @swiftav/infrastructure-storage

存储基础设施层 - 项目存储实现

## 概述

实现项目存储相关的 Repository 接口，提供：
- LocalStorage 适配器
- IndexedDB 适配器
- 项目持久化

## 结构

```
src/
├── repositories/      # Repository 实现
│   └── ProjectRepository.ts
└── storage/          # 存储适配器
    ├── LocalStorageAdapter.ts
    └── IndexedDBAdapter.ts
```

## 使用示例

```typescript
import { ProjectRepository } from '@swiftav/infrastructure-storage';
import { Project } from '@swiftav/entities';

const repository = new ProjectRepository('indexedDB');
await repository.save(project);
const savedProject = await repository.findById(project.id);
```

## 原则

- ✅ 实现 Domain 层定义的 IProjectRepository 接口
- ✅ 支持多种存储后端（LocalStorage、IndexedDB）
- ✅ 处理序列化/反序列化
- ❌ 不包含业务逻辑
