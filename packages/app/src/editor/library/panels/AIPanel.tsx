import { Tabs } from "radix-ui";
import { Image, Video } from "lucide-react";
import "./AIPanel.css";

export function AIPanel() {
  return (
    <div className="ai-panel">
      <Tabs.Root defaultValue="image" className="ai-panel__tabs">
        <Tabs.List className="ai-panel__tab-list" aria-label="AI 生成">
          <Tabs.Trigger value="image" className="ai-panel__tab-trigger">
            <Image size={16} className="ai-panel__tab-icon" />
            图片生成
          </Tabs.Trigger>
          <Tabs.Trigger value="video" className="ai-panel__tab-trigger">
            <Video size={16} className="ai-panel__tab-icon" />
            视频生成
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="image" className="ai-panel__tab-content">
          <div className="ai-panel__placeholder">
            <p className="ai-panel__desc">图片生成功能即将推出</p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="video" className="ai-panel__tab-content">
          <div className="ai-panel__placeholder">
            <p className="ai-panel__desc">视频生成功能即将推出</p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
