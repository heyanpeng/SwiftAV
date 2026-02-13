import { useEffect } from "react";
import { Header } from "@/editor/header/Header";
import { Library } from "@/editor/library/Library";
import { Preview } from "@/editor/preview/Preview";
import { Timeline } from "@/editor/timeline/Timeline";
import { useProjectStore } from "@/stores";
import "./EditorLayout.css";

// 默认视频资源，启动时若无工程则自动加载
import defaultVideoUrl from "@/assets/default.mp4?url";

export function EditorLayout() {
  // 挂载时若无工程则加载默认视频
  useEffect(() => {
    if (1) {
      return;
    }
    const { project, loadVideoFile } = useProjectStore.getState();
    if (project) {
      return;
    }
    fetch(defaultVideoUrl)
      .then((res) => res.blob())
      .then((blob) => new File([blob], "default.mp4", { type: "video/mp4" }))
      .then((file) => loadVideoFile(file))
      .catch((err) => {
        console.warn("默认视频加载失败:", err);
      });
  }, []);

  return (
    <div className="app-editor-layout">
      <Header />
      <div className="app-editor-layout__content">
        <Library />
        <div className="app-editor-layout__preview">
          <Preview />
        </div>
      </div>
      <Timeline />
    </div>
  );
}
