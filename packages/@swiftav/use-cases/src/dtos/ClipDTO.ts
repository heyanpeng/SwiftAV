/**
 * 片段数据传输对象
 */
export interface ClipDTO {
  id: string;
  startTime: number;
  duration: number;
  source: {
    type: 'file' | 'url';
    source: string; // File 转为 URL 或直接是 URL
  };
  inPoint: number;
  outPoint: number;
}
