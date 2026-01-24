/**
 * 格式转换工具
 */

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * 检查是否为视频文件
 */
export function isVideoFile(filename: string): boolean {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
  const ext = getFileExtension(filename).toLowerCase();
  return videoExtensions.includes(ext);
}

/**
 * 检查是否为音频文件
 */
export function isAudioFile(filename: string): boolean {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'];
  const ext = getFileExtension(filename).toLowerCase();
  return audioExtensions.includes(ext);
}
