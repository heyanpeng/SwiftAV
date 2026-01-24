/**
 * 时间转换工具
 */

/**
 * 将秒数转换为时间字符串 (HH:MM:SS)
 */
export function secondsToTimeString(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 将时间字符串转换为秒数
 */
export function timeStringToSeconds(timeString: string): number {
  const parts = timeString.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

/**
 * 将毫秒转换为秒
 */
export function millisecondsToSeconds(ms: number): number {
  return ms / 1000;
}

/**
 * 将秒转换为毫秒
 */
export function secondsToMilliseconds(seconds: number): number {
  return seconds * 1000;
}
