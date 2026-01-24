/**
 * 处理媒体用例
 */
import { MediaSource, IMediaRepository } from '@swiftav/entities';

export interface ProcessMediaRequest {
  source: MediaSource;
  operations: MediaOperation[];
}

export interface MediaOperation {
  type: 'crop' | 'resize' | 'filter' | 'volume';
  params: Record<string, unknown>;
}

export class ProcessMediaUseCase {
  constructor(private mediaRepository: IMediaRepository) {}

  async execute(request: ProcessMediaRequest): Promise<Blob> {
    // TODO: 实现媒体处理逻辑
    // 1. 解码媒体
    // 2. 应用操作
    // 3. 编码回媒体文件
    throw new Error('Not implemented');
  }
}
