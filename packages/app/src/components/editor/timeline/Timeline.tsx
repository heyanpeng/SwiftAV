import { useMemo } from "react";
import { ReactTimeline } from "@swiftav/timeline";
import { PlaybackControls } from "./PlaybackControls";
import "./Timeline.css";

export function Timeline() {
  const editorData = useMemo(
    () => [
      {
        id: "0",
        actions: [
          {
            id: "action00",
            start: 0,
            end: 2,
            effectId: "effect0",
          },
        ],
      },
      {
        id: "1",
        actions: [
          {
            id: "action10",
            start: 1.5,
            end: 5,
            effectId: "effect1",
          },
        ],
      },
    ],
    [],
  );

  const effects = useMemo(
    () => ({
      effect0: {
        id: "effect0",
        name: "效果 0",
      },
      effect1: {
        id: "effect1",
        name: "效果 1",
      },
    }),
    [],
  );

  return (
    <div className="app-editor-layout__timeline">
      <PlaybackControls />
      <div className="app-editor-layout__timeline-content">
        <div className="timeline-editor">
          <ReactTimeline
            // 第三方库目前未导出 TS 类型，这里先使用 any 以便后续迭代替换为真实数据结构
            editorData={editorData as any}
            effects={effects as any}
          />
        </div>
      </div>
    </div>
  );
}
