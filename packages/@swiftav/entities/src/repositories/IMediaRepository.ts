/**
 * 媒体仓储接口
 */
import { MediaSource } from '../value-objects/MediaSource';

export interface DecodedVideoData {
  frames: VideoFrame[];
  duration: number;
  width: number;
  height: number;
  fps: number;
}

export interface DecodedAudioData {
  buffer: AudioBuffer;
  duration: number;
  sampleRate: number;
  channels: number;
}

/**
 * 媒体仓储接口
 */
export interface IMediaRepository {
  /**
   * 解码视频
   */
  decodeVideo(source: MediaSource): Promise<DecodedVideoData>;

  /**
   * 解码音频
   */
  decodeAudio(source: MediaSource): Promise<DecodedAudioData>;

  /**
   * 编码视频
   */
  encodeVideo(
    frames: VideoFrame[],
    options: {
      width: number;
      height: number;
      fps: number;
      bitrate?: number;
    },
  ): Promise<Blob>;

  /**
   * 编码音频
   */
  encodeAudio(
    buffer: AudioBuffer,
    options: {
      sampleRate: number;
      bitrate?: number;
    },
  ): Promise<Blob>;
}
