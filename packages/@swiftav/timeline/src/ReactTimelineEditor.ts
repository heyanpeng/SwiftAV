/**
 * React Timeline Editor 集成封装
 *
 * 目前三方库仅导出 `Timeline` 组件，这里：
 * - 注入其内置样式
 * - 暴露一个别名组件 `ReactTimeline` 供外层使用
 */

// 注入第三方组件的默认样式
import "@xzdarcy/react-timeline-editor/dist/react-timeline-editor.css";

export { Timeline as ReactTimeline } from "@xzdarcy/react-timeline-editor";
export type { TimelineState } from "@xzdarcy/react-timeline-editor";
