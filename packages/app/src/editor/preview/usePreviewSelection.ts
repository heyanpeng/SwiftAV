/**
 * Preview 选中编辑同步 Hook
 * ==========================
 * 该 hook 负责同步画布选中状态与全局 store，并处理元素变换事件。
 *
 * 功能：
 * - 监听全局 selectedClipId，同步到 CanvasEditor 显示选中框
 * - 设置 CanvasEditor 回调，处理元素选中、变换过程、变换结束事件
 * - 变换结束时调用 updateClipTransform 写入工程数据并生成历史记录
 */
import { useEffect, useRef } from "react";
import { useProjectStore } from "@/stores";
import type { CanvasEditor, TransformEvent } from "@swiftav/canvas";

interface UsePreviewSelectionOptions {
  /** 是否禁用选中编辑（播放时禁用） */
  disabled?: boolean;
}

/**
 * Preview 选中编辑同步 Hook
 * @param editorRef CanvasEditor 实例 ref
 * @param options 配置选项
 */
export function usePreviewSelection(
  editorRef: React.MutableRefObject<CanvasEditor | null>,
  options: UsePreviewSelectionOptions = {},
) {
  const { disabled = false } = options;

  // 全局状态
  const selectedClipId = useProjectStore((s) => s.selectedClipId);
  const setSelectedClipId = useProjectStore((s) => s.setSelectedClipId);
  const updateClipTransform = useProjectStore((s) => s.updateClipTransform);
  const project = useProjectStore((s) => s.project);

  // 使用 ref 缓存回调，避免重复设置
  const callbacksRef = useRef({
    onElementSelect: (id: string | null) => {
      setSelectedClipId(id);
    },
    onElementTransform: (_event: TransformEvent) => {
      // 变换过程中可以实时更新 UI（如属性面板），但不写入历史
      // 如果需要实时预览属性变化，可以在这里调用 updateClipTransform 但不 pushHistory
    },
    onElementTransformEnd: (event: TransformEvent) => {
      // 变换结束，写入工程数据并生成历史记录
      const { id, x, y, scaleX, scaleY, rotation } = event;
      updateClipTransform(id, {
        x,
        y,
        scaleX,
        scaleY,
        rotation,
      });
    },
  });

  // 设置 CanvasEditor 回调
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || disabled) return;

    editor.setCallbacks({
      onElementSelect: callbacksRef.current.onElementSelect,
      onElementTransform: callbacksRef.current.onElementTransform,
      onElementTransformEnd: callbacksRef.current.onElementTransformEnd,
    });
  }, [editorRef, disabled]);

  // 同步全局 selectedClipId 到画布
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || disabled) return;

    // 检查 clip 是否仍然存在（可能已被删除）
    if (selectedClipId && project) {
      const exists = project.tracks.some((track) =>
        track.clips.some((clip) => clip.id === selectedClipId),
      );
      if (!exists) {
        // clip 已不存在，取消选中
        setSelectedClipId(null);
        editor.setSelectedElement(null);
        return;
      }
    }

    editor.setSelectedElement(selectedClipId);
  }, [selectedClipId, project, editorRef, disabled, setSelectedClipId]);

  // 播放时禁用选中编辑
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (disabled) {
      // 禁用时取消选中
      editor.setSelectedElement(null);
    } else if (selectedClipId) {
      // 恢复选中
      editor.setSelectedElement(selectedClipId);
    }
  }, [disabled, selectedClipId, editorRef]);
}
