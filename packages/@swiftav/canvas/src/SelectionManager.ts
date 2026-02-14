/**
 * SelectionManager
 * ================
 * 管理画布元素的选中状态和编辑控件（Transformer）
 */

import Konva from "konva";
import type { TransformEvent, CanvasEditorCallbacks } from "./types/editor";
import { nodeToTransformEvent, hasTransformChanged } from "./utils";

export interface SelectionManagerOptions {
  elementLayer: Konva.Layer;
  getElementNodeById: (id: string) => Konva.Node | null;
  getNodeTypeById: (id: string) => "text" | "image" | "video" | null;
}

export class SelectionManager {
  private elementLayer: Konva.Layer;
  private getElementNodeById: (id: string) => Konva.Node | null;
  private getNodeTypeById: (id: string) => "text" | "image" | "video" | null;

  private selectedId: string | null = null;
  private transformer: Konva.Transformer | null = null;
  private callbacks: CanvasEditorCallbacks = {};
  private transformStartState: TransformEvent | null = null;

  constructor(options: SelectionManagerOptions) {
    this.elementLayer = options.elementLayer;
    this.getElementNodeById = options.getElementNodeById;
    this.getNodeTypeById = options.getNodeTypeById;
  }

  /**
   * 设置回调函数
   */
  setCallbacks(callbacks: CanvasEditorCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * 获取当前选中的元素 id
   */
  getSelectedId(): string | null {
    return this.selectedId;
  }

  /**
   * 设置选中元素
   */
  setSelectedElement(id: string | null): void {
    if (this.selectedId === id) return;

    this.clearSelection();

    if (!id) {
      this.callbacks.onElementSelect?.(null);
      return;
    }

    const node = this.getElementNodeById(id);
    if (!node) {
      this.callbacks.onElementSelect?.(null);
      return;
    }

    this.selectedId = id;
    this.createTransformer(node);
    this.callbacks.onElementSelect?.(id);
  }

  /**
   * 获取当前选中元素的变换状态
   */
  getSelectedTransform(): TransformEvent | null {
    if (!this.selectedId) return null;

    const node = this.getElementNodeById(this.selectedId);
    if (!node) return null;

    return nodeToTransformEvent(this.selectedId, node);
  }

  /**
   * 清除选中状态
   */
  clearSelection(): void {
    this.selectedId = null;
    this.transformStartState = null;

    if (this.transformer) {
      this.transformer.destroy();
      this.transformer = null;
    }

    this.elementLayer.batchDraw();
  }

  /**
   * 创建 Transformer 编辑控件
   */
  private createTransformer(node: Konva.Node): void {
    if (this.transformer) {
      this.transformer.destroy();
    }

    this.transformer = new Konva.Transformer({
      nodes: [node],
      enabledAnchors: [
        "top-left",
        "top-center",
        "top-right",
        "middle-right",
        "middle-left",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      rotateEnabled: true,
      rotateAnchorOffset: 20,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      rotationSnapTolerance: 5,
      borderStroke: "#00d4ff",
      borderStrokeWidth: 2,
      anchorFill: "#ffffff",
      anchorStroke: "#00d4ff",
      anchorSize: 10,
      anchorCornerRadius: 2,
      keepRatio: false,
    });

    // 监听变换开始
    this.transformer.on("transformstart", () => {
      this.transformStartState = this.getSelectedTransform();
    });

    // 监听变换过程
    this.transformer.on("transform", () => {
      const transform = this.getSelectedTransform();
      if (transform) {
        this.callbacks.onElementTransform?.(transform);
      }
    });

    // 监听变换结束
    this.transformer.on("transformend", () => {
      const transform = this.getSelectedTransform();
      if (transform && this.transformStartState) {
        if (hasTransformChanged(this.transformStartState, transform)) {
          this.callbacks.onElementTransformEnd?.(transform);
        }
      }
      this.transformStartState = null;
    });

    this.elementLayer.add(this.transformer);
    this.elementLayer.batchDraw();
  }

  /**
   * 为节点绑定选中相关事件
   */
  bindSelectionEvents(
    node: Konva.Node,
    id: string,
    onTransformStart?: () => void,
  ): void {
    // 点击选中
    node.on("click tap", (e) => {
      e.cancelBubble = true;
      this.setSelectedElement(id);
    });

    // 拖拽事件
    node.on("dragstart", () => {
      this.transformStartState = nodeToTransformEvent(id, node);
      onTransformStart?.();
    });

    node.on("dragmove", () => {
      const transform = nodeToTransformEvent(id, node);
      this.callbacks.onElementTransform?.(transform);
    });

    node.on("dragend", () => {
      const transform = nodeToTransformEvent(id, node);
      if (
        this.transformStartState &&
        hasTransformChanged(this.transformStartState, transform)
      ) {
        this.callbacks.onElementTransformEnd?.(transform);
      }
      this.transformStartState = null;
    });
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.clearSelection();
    this.callbacks = {};
  }
}
