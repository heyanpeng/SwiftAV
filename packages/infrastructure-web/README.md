# @swiftav/infrastructure-web

Web UI 基础设施层 - React + TypeScript + Vite 应用

## 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Zustand** - 状态管理
- **@swiftav/*** - SwiftAV 包（workspace 依赖）

## 开发

```bash
# 安装依赖（在根目录）
pnpm install

# 启动开发服务器
pnpm dev

# 或者直接进入包目录
cd packages/infrastructure-web
pnpm dev
```

## 构建

```bash
# 构建应用（在根目录）
pnpm build:infrastructure-web

# 或者直接进入包目录
cd packages/infrastructure-web
pnpm build
```

## 项目结构

```
packages/infrastructure-web/
├── src/
│   ├── di/              # 依赖注入配置（包含 Controller 实例化）
│   ├── stores/          # Zustand Store 实现（Frameworks & Drivers）
│   ├── components/      # React 组件（UI）
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 应用入口
├── public/              # 静态资源
└── index.html           # HTML 模板
```

## 架构说明

### 整洁架构位置

**Frameworks & Drivers Layer（最外层 - 蓝色层）**

- **UI (React)**：React 组件、用户交互
- **Store 实现**：Zustand Store 实现 `IEditorStore` 接口
- **Controller 实例化**：在 `src/di/container.ts` 中创建 Controller 实例并注入依赖

### Controller 和 Store

- **Controller 定义**：在 `@swiftav/interface-adapters` 包中（Interface Adapters Layer）
- **Controller 实例化**：在 `src/di/container.ts` 中（依赖注入容器）
- **Store 接口**：在 `@swiftav/interface-adapters` 包中定义（`IEditorStore`）
- **Store 实现**：在 `src/stores/` 中使用 Zustand 实现

## 状态管理

使用 Zustand 进行状态管理，store 文件位于 `src/stores/` 目录。

Store 实现 `IEditorStore` 接口（定义在 `@swiftav/interface-adapters` 包中），这样 Controller 可以依赖接口而不是具体实现。

## Controller 使用

Controller 实例在 `src/di/container.ts` 中创建，通过 `src/di/index.ts` 或 `src/stores/index.ts` 导出：

```typescript
// 方式 1：从 di 导入
import { editorController } from '@/di';

// 方式 2：从 stores 导入（推荐，统一入口）
import { editorController, useEditorStore } from '@/stores';
```

## 依赖

- `@swiftav/entities` - Entities 层
- `@swiftav/use-cases` - Use Cases 层
- `@swiftav/interface-adapters` - Interface Adapters 层（Controller 定义、Store 接口）
- `@swiftav/infrastructure-media` - 媒体基础设施
- `@swiftav/infrastructure-render` - 渲染基础设施
- `@swiftav/infrastructure-storage` - 存储基础设施
- `react` / `react-dom` - React 框架
- `zustand` - 状态管理库
