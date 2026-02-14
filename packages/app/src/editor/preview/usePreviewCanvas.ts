import { useEffect, useRef, type RefObject } from "react";
import { CanvasEditor } from "@swiftav/canvas";
import { useProjectStore } from "@/stores";

/**
 * 创建并维护预览画布：
 * - 初始化 CanvasEditor，自动适应容器大小（固定 16:9 比例，居中内嵌）
 * - 监听 resize 自动调整画布尺寸
 * - 画布背景色支持动态同步
 * - 卸载时销毁 stage 并清理 rAF
 *
 * @param containerRef - 画布挂载用的 div ref，由 Preview 组件负责绑定
 * @param rafIdRef - 当前 requestAnimationFrame id，供外部清理/取消
 * @returns editorRef - 画布编辑器实例，供文本/视频/图片同步 hooks 使用
 */
export function usePreviewCanvas(
  containerRef: RefObject<HTMLDivElement | null>,
  rafIdRef: RefObject<number | null>,
): RefObject<CanvasEditor | null> {
  // 存储 CanvasEditor 实例，挂载/卸载生命周期管理
  const editorRef = useRef<CanvasEditor | null>(null);

  // 项目的画布背景色（响应全局 store 的变动）
  const canvasBackgroundColor = useProjectStore((s) => s.canvasBackgroundColor);
  // 画布宽高比：有 project 用 project，无 project 用 preferredCanvasSize
  const project = useProjectStore((s) => s.project);
  const preferredCanvasSize = useProjectStore((s) => s.preferredCanvasSize);
  const canvasAspect =
    project != null
      ? project.width / project.height
      : preferredCanvasSize.width / preferredCanvasSize.height;

  useEffect(() => {
    // 若无容器节点，直接跳过
    if (!containerRef.current) {
      return;
    }

    // 获取容器宽高，据此适配画布比例（来自 project 或 preferredCanvasSize）
    const rect = containerRef.current.getBoundingClientRect();
    const targetAspect = canvasAspect;
    let width = rect.width;
    let height = rect.height;

    if (!width || !height) {
      return;
    }

    const containerAspect = rect.width / rect.height;

    // 根据容器实际比例，调整宽高以保持 16:9，无拉伸
    if (containerAspect > targetAspect) {
      // 容器较宽，按高度定，高度撑满，宽度收缩
      height = rect.height;
      width = rect.height * targetAspect;
    } else {
      // 容器较高，按宽度定，宽度撑满，高度收缩
      width = rect.width;
      height = rect.width / targetAspect;
    }

    // 创建 CanvasEditor 并指定挂载点、初始尺寸及背景色
    const editor = new CanvasEditor({
      container: containerRef.current,
      width,
      height,
      backgroundColor: canvasBackgroundColor,
    });

    editorRef.current = editor;

    /**
     * 处理窗口 resize：按当前画布比例重新计算尺寸
     */
    const handleResize = () => {
      if (!containerRef.current || !editorRef.current) return;

      const state = useProjectStore.getState();
      const aspect =
        state.project != null
          ? state.project.width / state.project.height
          : state.preferredCanvasSize.width / state.preferredCanvasSize.height;

      const r = containerRef.current.getBoundingClientRect();
      const targetAspect = aspect;
      let newWidth = r.width;
      let newHeight = r.height;

      if (!newWidth || !newHeight) {
        return;
      }

      const containerAspect = r.width / r.height;
      // 重新对齐 16:9
      if (containerAspect > targetAspect) {
        newHeight = r.height;
        newWidth = r.height * targetAspect;
      } else {
        newWidth = r.width;
        newHeight = r.width / targetAspect;
      }

      editorRef.current.resize(newWidth, newHeight);
    };

    // 挂载后监听全局窗口 resize 事件，动态布局
    window.addEventListener("resize", handleResize);

    // 清理函数：卸载/刷新时移除监听，销毁画布资源，取消任何 rAF 调度
    return () => {
      window.removeEventListener("resize", handleResize);
      editor.getStage().destroy(); // 销毁 Konva Stage
      editorRef.current = null;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
    // 仅首次挂载时运行/卸载时 cleanup
  // eslint-disable-next-line react-hooks/exhaustive-deps -- 故意只在挂载时运行
  }, []);

  // 当画布比例变化时（用户选择新尺寸），重新计算并 resize
  useEffect(() => {
    const editor = editorRef.current;
    const container = containerRef.current;
    if (!editor || !container) return;

    const r = container.getBoundingClientRect();
    if (!r.width || !r.height) return;

    const containerAspect = r.width / r.height;
    let newWidth: number;
    let newHeight: number;

    if (containerAspect > canvasAspect) {
      newHeight = r.height;
      newWidth = r.height * canvasAspect;
    } else {
      newWidth = r.width;
      newHeight = r.width / canvasAspect;
    }

    editor.resize(newWidth, newHeight);
  }, [canvasAspect]);

  /**
   * 实时同步画布背景色
   * 当全局 canvasBackgroundColor 变化时，动态更新 CanvasEditor 背景色
   */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    editor.setBackgroundColor(canvasBackgroundColor);
  }, [canvasBackgroundColor]);

  // 交还 editorRef，供上层/子模块 hooks 使用
  return editorRef;
}
