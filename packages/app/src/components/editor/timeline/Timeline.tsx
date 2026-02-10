import { useEffect, useMemo, useRef, useState } from "react";
import type { TimelineState } from "@swiftav/timeline";
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

  const timelineRef = useRef<TimelineState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const duration = useMemo(() => {
    return editorData.reduce((max, row) => {
      const rowMax = row.actions.reduce(
        (rowEnd, action) => Math.max(rowEnd, action.end),
        0,
      );
      return Math.max(max, rowMax);
    }, 0);
  }, [editorData]);

  // 播放时轮询当前播放时间，用于更新 UI
  useEffect(() => {
    if (!isPlaying) return;
    let frameId: number;

    const tick = () => {
      const t = timelineRef.current?.getTime?.() ?? 0;
      setCurrentTime(t);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    const api = timelineRef.current;
    if (!api) return;

    if (isPlaying) {
      api.pause();
      setIsPlaying(false);
    } else {
      api.play({ autoEnd: true });
      setIsPlaying(true);
    }
  };

  const handleStepBackward = () => {
    const api = timelineRef.current;
    if (!api) return;
    const t = api.getTime();
    const next = Math.max(0, t - 0.1);
    api.setTime(next);
    setCurrentTime(next);
  };

  const handleStepForward = () => {
    const api = timelineRef.current;
    if (!api) return;
    const t = api.getTime();
    const next = Math.min(duration, t + 0.1);
    api.setTime(next);
    setCurrentTime(next);
  };

  return (
    <div className="app-editor-layout__timeline">
      <PlaybackControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={handleTogglePlay}
        onStepBackward={handleStepBackward}
        onStepForward={handleStepForward}
      />
      <div className="app-editor-layout__timeline-content">
        <div className="timeline-editor">
          <ReactTimeline
            ref={timelineRef}
            // 第三方库目前未导出 TS 类型，这里先使用 any 以便后续迭代替换为真实数据结构
            editorData={editorData as any}
            effects={effects as any}
          />
        </div>
      </div>
    </div>
  );
}
