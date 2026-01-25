import { useRef, useEffect } from "react";
import { useCanvasKit } from "../../../../hooks";
import { CanvasRenderer, type RenderCallback } from "@swiftav/infra-render";
import "./Canvas.css";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const { canvasKit, surface, canvas, isReady, isLoading, error } =
    useCanvasKit(canvasRef, {
      width: 1920,
      height: 1080,
    });

  // 初始化渲染器
  useEffect(() => {
    if (!isReady || !canvasKit || !canvas || !surface) {
      return;
    }

    // 创建渲染器
    const renderer = new CanvasRenderer(surface, canvas, canvasKit, {
      autoStart: true,
      targetFPS: 60,
    });

    // 设置渲染回调
    const renderCallback: RenderCallback = (canvas, canvasKit) => {
      // 清空画布（使用黑色背景）
      canvas.clear(canvasKit.Color(0, 0, 0, 1));

      // TODO: 在这里添加渲染逻辑
      // 1. 渲染视频帧（如果有）
      // 2. 渲染图形图层
    };

    renderer.setRenderCallback(renderCallback);
    rendererRef.current = renderer;

    // 清理函数
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [isReady, canvasKit, canvas, surface]);

  // 错误处理
  useEffect(() => {
    if (error) {
      console.error("CanvasKit error:", error);
    }
  }, [error]);

  return (
    <div className="canvas-container">
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
          }}
        >
          Loading CanvasKit...
        </div>
      )}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#ff0000",
          }}
        >
          Error: {error.message}
        </div>
      )}
      <canvas ref={canvasRef} className="canvas" />
    </div>
  );
}
