import { useEffect, useRef } from "react";
import { CanvasEditor } from "@swiftav/canvas";
import "./Canvas.css";

export function Canvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<CanvasEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const editor = new CanvasEditor({
      container: containerRef.current,
      width: rect.width || 1280,
      height: rect.height || 720,
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
      editorRef.current.resize(r.width, r.height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Konva 会在 Stage destroy 时清理内部资源
      editor.getStage().destroy();
      editorRef.current = null;
    };
  }, []);

  return <div className="canvas-container" ref={containerRef} />;
}
