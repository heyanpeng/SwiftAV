/**
 * 图像处理工具
 */

export class ImageTool {
  /**
   * 绘制图像
   */
  drawImage(canvas: any, image: HTMLImageElement | ImageBitmap, x: number, y: number): void {
    // TODO: 实现图像绘制
  }

  /**
   * 绘制图像（带缩放）
   */
  drawImageScaled(
    canvas: any,
    image: HTMLImageElement | ImageBitmap,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    // TODO: 实现缩放图像绘制
  }

  /**
   * 裁剪图像
   */
  drawImageCropped(
    canvas: any,
    image: HTMLImageElement | ImageBitmap,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ): void {
    // TODO: 实现裁剪图像绘制
  }
}
