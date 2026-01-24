/**
 * 历史记录（撤销/重做）
 */

export interface HistoryState {
  type: string;
  data: any;
}

export class History {
  private history: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxSize: number = 50;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  /**
   * 添加历史记录
   */
  push(state: HistoryState): void {
    // 移除当前位置之后的所有记录
    this.history = this.history.slice(0, this.currentIndex + 1);
    // 添加新记录
    this.history.push(state);
    this.currentIndex++;
    // 限制历史记录大小
    if (this.history.length > this.maxSize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  /**
   * 撤销
   */
  undo(): HistoryState | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * 重做
   */
  redo(): HistoryState | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * 是否可以撤销
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * 是否可以重做
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * 清空历史记录
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }
}
