/**
 * Todo 实体
 */
export class Todo {
  constructor(
    public readonly id: string,
    public title: string,
    public completed: boolean = false,
    public readonly createdAt: Date = new Date(),
  ) {}

  /**
   * 标记为完成
   */
  markAsCompleted(): void {
    this.completed = true;
  }

  /**
   * 标记为未完成
   */
  markAsIncomplete(): void {
    this.completed = false;
  }

  /**
   * 更新标题
   */
  updateTitle(title: string): void {
    if (!title.trim()) {
      throw new Error('Todo title cannot be empty');
    }
    this.title = title.trim();
  }

  /**
   * 切换完成状态
   */
  toggle(): void {
    this.completed = !this.completed;
  }
}
