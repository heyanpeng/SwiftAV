import { useEffect, useRef } from "react";
import { CanvasEditor } from "@swiftav/canvas";
import { useProjectStore } from "../../../../stores";
import "./Canvas.css";

export function Canvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<CanvasEditor | null>(null);
  const videoUrl = useProjectStore((s) => s.videoUrl);
  const isPlaying = useProjectStore((s) => s.isPlaying);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const targetAspect = 16 / 9;
    let width = rect.width;
    let height = rect.height;

    // 容器尺寸不可用时直接返回，等待下一次布局变更
    if (!width || !height) return;

    const containerAspect = rect.width / rect.height;
    if (containerAspect > targetAspect) {
      // 宽比较富余，以高度为基准撑满
      height = rect.height;
      width = rect.height * targetAspect;
    } else {
      // 高比较富余，以宽度为基准撑满
      width = rect.width;
      height = rect.width / targetAspect;
    }

    const editor = new CanvasEditor({
      container: containerRef.current,
      width,
      height,
      backgroundColor: "#000000",
    });

    editorRef.current = editor;

    // 示例：添加一段占位文本
    editor.addText({
      text: "SwiftAV Canvas",
      x: 40,
      y: 40,
      fontSize: 32,
      fill: "#ffffff",
    });

    const handleResize = () => {
      if (!containerRef.current || !editorRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const targetAspect = 16 / 9;
      let newWidth = r.width;
      let newHeight = r.height;

      if (!newWidth || !newHeight) return;

      const containerAspect = r.width / r.height;
      if (containerAspect > targetAspect) {
        newHeight = r.height;
        newWidth = r.height * targetAspect;
      } else {
        newWidth = r.width;
        newHeight = r.width / targetAspect;
      }

      editorRef.current.resize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Konva 会在 Stage destroy 时清理内部资源
      editor.getStage().destroy();
      editorRef.current = null;
    };
  }, []);

  // 当加载了主视频资源时，在画布中添加一个全屏视频元素，但不自动播放
  useEffect(() => {
    if (!videoUrl) return;
    if (!editorRef.current) return;

    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.autoplay = false;
    videoRef.current = video;

    const editor = editorRef.current;
    const stage = editor.getStage();
    const { width, height } = stage.size();

    const handleLoadedMetadata = () => {
      const id = editor.addVideo({
        id: "video-main",
        video,
        x: 0,
        y: 0,
        width,
        height,
      });
      videoIdRef.current = id;
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.pause();
      videoRef.current = null;
      videoIdRef.current = null;
    };
  }, [videoUrl]);

  // 根据全局播放状态控制视频播放/暂停及 Konva 动画
  useEffect(() => {
    const editor = editorRef.current;
    const video = videoRef.current;
    const videoId = videoIdRef.current;
    if (!editor || !video || !videoId) return;

    if (isPlaying) {
      void video.play();
      editor.playVideo(videoId);
    } else {
      video.pause();
      editor.pauseVideo(videoId);
    }
  }, [isPlaying]);

  return <div className="canvas-container" ref={containerRef} />;
}
