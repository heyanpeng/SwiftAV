# SwiftAV

SwiftAV 应用 - React + TypeScript + Vite

## 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Zustand** - 状态管理
- **@swiftav/sdk** - SwiftAV SDK（workspace 依赖）

## 开发

```bash
# 安装依赖（在根目录）
pnpm install

# 启动开发服务器
pnpm dev

# 或者直接进入包目录
cd packages/swiftav
pnpm dev
```

## 构建

```bash
# 构建应用（在根目录）
pnpm build:app

# 或者直接进入包目录
cd packages/swiftav
pnpm build
```

## 项目结构

```
packages/swiftav/
├── src/
│   ├── stores/          # Zustand 状态管理
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 应用入口
├── public/              # 静态资源
└── index.html           # HTML 模板
```

## 状态管理

使用 Zustand 进行状态管理，store 文件位于 `src/stores/` 目录。

## 依赖

- `@swiftav/sdk` - SwiftAV SDK（通过 workspace 协议引用）
- `react` / `react-dom` - React 框架
- `zustand` - 状态管理库
