/**
 * 画布编辑工具（基于 Konva.js）
 *
 * 模块结构：
 * - CanvasEditor: 主类，提供画布编辑的完整功能
 * - SelectionManager: 元素选中和编辑控件管理
 * - VideoAnimationManager: 视频播放动画管理
 * - ElementSynchronizer: 元素同步渲染管理
 * - types: 基础类型定义
 * - types/editor: 扩展类型定义（TransformEvent, CanvasEditorCallbacks 等）
 * - utils: 工具函数（nodeToTransformEvent, hasTransformChanged 等）
 * - constants: 常量定义
 */

// 主类
export * from './CanvasEditor';

// 子模块（供高级使用）
export * from './SelectionManager';
export * from './VideoAnimationManager';
export * from './ElementSynchronizer';

// 工具函数和常量
export * from './utils';
export * from './constants';

// 类型定义（从 types 文件夹统一导出）
export * from './types/elements';
export * from './types/editor';
