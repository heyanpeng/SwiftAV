/**
 * 文字图层
 */

import { Layer } from './Layer';

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  align: 'left' | 'center' | 'right';
}

export class TextLayer extends Layer {
  private text: string;
  private style: TextStyle;

  constructor(id: string, text: string, style: TextStyle) {
    super(id, 'text');
    this.text = text;
    this.style = style;
  }

  /**
   * 设置文字
   */
  setText(text: string): void {
    this.text = text;
  }

  /**
   * 设置样式
   */
  setStyle(style: Partial<TextStyle>): void {
    this.style = { ...this.style, ...style };
  }

  /**
   * 渲染文字图层
   */
  render(canvas: any): void {
    if (!this.visible) {
      return;
    }
    // TODO: 实现文字渲染
  }
}
