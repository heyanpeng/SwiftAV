/**
 * 媒体源值对象
 */
export class MediaSource {
  readonly type: 'file' | 'url';
  readonly source: File | string;

  constructor(type: 'file' | 'url', source: File | string) {
    this.type = type;
    this.source = source;
  }

  /**
   * 判断是否为文件类型
   */
  isFile(): boolean {
    return this.type === 'file';
  }

  /**
   * 判断是否为 URL 类型
   */
  isUrl(): boolean {
    return this.type === 'url';
  }

  /**
   * 获取文件（如果是文件类型）
   */
  getFile(): File | null {
    return this.isFile() ? (this.source as File) : null;
  }

  /**
   * 获取 URL（如果是 URL 类型）
   */
  getUrl(): string | null {
    return this.isUrl() ? (this.source as string) : null;
  }
}
