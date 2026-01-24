/**
 * 渲染管线
 */

import { Layer } from '../layer';

export class RenderPipeline {
  private layers: Layer[] = [];

  /**
   * 添加图层
   */
  addLayer(layer: Layer): void {
    this.layers.push(layer);
    this.sortLayers();
  }

  /**
   * 移除图层
   */
  removeLayer(layerId: string): void {
    this.layers = this.layers.filter((layer) => layer.id !== layerId);
  }

  /**
   * 获取图层
   */
  getLayer(layerId: string): Layer | undefined {
    return this.layers.find((layer) => layer.id === layerId);
  }

  /**
   * 获取所有图层（按 zIndex 排序）
   */
  getLayers(): Layer[] {
    return [...this.layers].sort((a, b) => a.zIndex - b.zIndex);
  }

  /**
   * 按 zIndex 排序图层
   */
  private sortLayers(): void {
    this.layers.sort((a, b) => a.zIndex - b.zIndex);
  }

  /**
   * 清空所有图层
   */
  clear(): void {
    this.layers = [];
  }
}
