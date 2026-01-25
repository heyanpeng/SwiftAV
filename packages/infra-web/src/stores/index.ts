/**
 * Store 导出文件
 * 
 * 统一导出所有 store，方便在其他组件中使用
 * 
 * 注意：业务逻辑应该通过 Controller 层调用，Store 只负责状态管理
 */

export { useExampleStore } from './exampleStore';
export type { ExampleStore, ExampleState, ExampleActions } from './exampleStore';
// export { useEditorStore } from './editorStore';
// export type { EditorStore } from './editorStore';

// 导出 Controller（从依赖注入容器中获取）
export { todoController } from '../di';
export { useTodoStore } from './todoStore';
