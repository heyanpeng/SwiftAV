/**
 * 生成带前缀的唯一 id，用于文本/图片/视频等元素
 */
export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
