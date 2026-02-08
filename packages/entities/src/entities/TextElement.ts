import { ResourceElement } from './ResourceElement';
import { Transform } from '../value-objects/Transform';

/**
 * 文字元素
 * 
 * 用于在画布上渲染文字内容
 * 继承 ResourceElement，文字内容本身就是资源（无需额外加载）
 */
export class TextElement extends ResourceElement {
  readonly type: 'text' = 'text';

  /**
   * 文字内容
   */
  content: string;

  /**
   * 字体大小（像素）
   */
  fontSize: number;

  /**
   * 文字颜色（CSS 颜色值，如 '#000000' 或 'rgb(0, 0, 0)'）
   */
  color: string;

  /**
   * 字体族（如 'Arial', 'Helvetica'）
   */
  fontFamily: string;

  /**
   * 字体粗细（'normal' | 'bold' | '100' | '200' | ... | '900'）
   */
  fontWeight: string | number;

  /**
   * 文字对齐方式
   */
  textAlign: 'left' | 'center' | 'right' | 'justify';

  /**
   * 行高（相对于字体大小的倍数）
   */
  lineHeight: number;

  /**
   * 文字装饰（下划线、删除线等）
   */
  textDecoration: 'none' | 'underline' | 'line-through' | 'overline';

  /**
   * 文字描边颜色（可选）
   */
  strokeColor?: string;

  /**
   * 文字描边宽度（像素）
   */
  strokeWidth: number;

  /**
   * 背景颜色（可选）
   */
  backgroundColor?: string;

  /**
   * 背景圆角（像素）
   */
  borderRadius: number;

  /**
   * 内边距（像素）
   */
  padding: number;

  constructor(
    id: string,
    content: string = '',
    transformOrX?: Transform | number,
    y?: number,
    width?: number,
    height?: number,
    fontSize: number = 16,
    color: string = '#000000',
    fontFamily: string = 'Arial',
    fontWeight: string | number = 'normal',
    textAlign: 'left' | 'center' | 'right' | 'justify' = 'left',
    lineHeight: number = 1.2,
    textDecoration: 'none' | 'underline' | 'line-through' | 'overline' = 'none',
    strokeColor?: string,
    strokeWidth: number = 0,
    backgroundColor?: string,
    borderRadius: number = 0,
    padding: number = 0,
    rotation?: number,
    opacity?: number,
    visible: boolean = true,
    zIndex: number = 0,
  ) {
    // 如果第一个参数是 Transform，使用它；否则使用单独的参数创建 Transform
    let transform: Transform;
    if (transformOrX instanceof Transform) {
      transform = transformOrX;
    } else {
      const x = transformOrX ?? 0;
      const yPos = y ?? 0;
      const w = width ?? 200;
      const h = height ?? 50;
      const rot = rotation ?? 0;
      const op = opacity ?? 1;
      transform = new Transform(x, yPos, w, h, rot, op);
    }

    super(id, transform, visible, zIndex);

    this.content = content;
    this.fontSize = fontSize;
    this.color = color;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
    this.textAlign = textAlign;
    this.lineHeight = lineHeight;
    this.textDecoration = textDecoration;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.backgroundColor = backgroundColor;
    this.borderRadius = borderRadius;
    this.padding = padding;

    // 文字元素不需要加载外部资源，内容本身就是资源，直接标记为 ready
    this.setResourceReady();
  }

  /**
   * 更新文字内容
   */
  setContent(content: string): void {
    this.content = content;
  }

  /**
   * 更新字体大小
   */
  setFontSize(fontSize: number): void {
    if (fontSize <= 0) {
      throw new Error('Font size must be greater than 0');
    }
    this.fontSize = fontSize;
  }

  /**
   * 更新文字颜色
   */
  setColor(color: string): void {
    this.color = color;
  }

  /**
   * 更新字体族
   */
  setFontFamily(fontFamily: string): void {
    this.fontFamily = fontFamily;
  }

  /**
   * 加载资源（文字元素不需要加载外部资源）
   */
  protected loadResource(context?: any): void {
    // 文字内容本身就是资源，无需加载
    // 如果未来需要加载字体文件，可以在这里实现
    this.setResourceReady();
  }

  /**
   * 执行具体渲染
   */
  protected doRender(
    canvas: any,
    canvasKit: any,
    context?: any,
  ): void {
    const ck = canvasKit;

    // 创建字体
    const font = new ck.Font(null, this.fontSize);
    // 注意：CanvasKit 的字体加载需要字体文件，这里使用默认字体
    // 实际使用时需要加载字体文件

    // 创建文字画笔
    const paint = new ck.Paint();
    paint.setColor(ck.Color(this.color));
    paint.setStyle(ck.PaintStyle.Fill);
    paint.setAntiAlias(true);

    // 如果有描边
    if (this.strokeColor && this.strokeWidth > 0) {
      const strokePaint = new ck.Paint();
      strokePaint.setColor(ck.Color(this.strokeColor));
      strokePaint.setStyle(ck.PaintStyle.Stroke);
      strokePaint.setStrokeWidth(this.strokeWidth);
      strokePaint.setAntiAlias(true);

      // 先绘制描边
      canvas.drawText(
        this.content,
        this.padding,
        this.padding + this.fontSize,
        strokePaint,
        font,
      );
    }

    // 绘制文字
    canvas.drawText(
      this.content,
      this.padding,
      this.padding + this.fontSize,
      paint,
      font,
    );

    // 如果有背景色
    if (this.backgroundColor) {
      const bgPaint = new ck.Paint();
      bgPaint.setColor(ck.Color(this.backgroundColor));
      bgPaint.setStyle(ck.PaintStyle.Fill);

      // 绘制圆角矩形背景
      const rect = ck.XYWHRect(
        this.padding,
        this.padding,
        this.width - this.padding * 2,
        this.height - this.padding * 2,
      );
      const rrect = ck.RRectXY(rect, this.borderRadius, this.borderRadius);
      canvas.drawRRect(rrect, bgPaint);
    }
  }
}
