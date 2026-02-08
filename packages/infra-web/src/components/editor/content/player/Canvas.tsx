import { useRef, useEffect } from "react";
import { useCanvasKit } from "../../../../hooks";
import { CanvasRenderer } from "@swiftav/infra-render";
import { useCanvasStore } from "../../../../stores";
import "./Canvas.css";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const { canvasKit, surface, canvas, isReady, isLoading, error } =
    useCanvasKit(canvasRef, {
      width: 1920,
      height: 1080,
    });

  // 从 store 获取元素列表
  const elements = useCanvasStore((state) => state.elements);

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

    // 不设置自定义渲染回调，使用默认的元素渲染逻辑
    // 元素会通过 setElements 方法设置

    rendererRef.current = renderer;

    // 清理函数
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [isReady, canvasKit, canvas, surface]);

  // 当元素列表变化时，更新渲染器
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setElements(elements);
    }
  }, [elements]);

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
