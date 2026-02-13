import { Cloud, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useProjectStore } from "@/stores";
import "./MediaPanel.css";

const VIDEO_ACCEPT = "video/*,video/x-matroska,video/mp2t,.ts";

export function MediaPanel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const loadVideoFile = useProjectStore((s) => s.loadVideoFile);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await loadVideoFile(file);
    event.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    const file = Array.from(files).find((f) => f.type.startsWith("video/"));
    if (!file) return;
    await loadVideoFile(file);
  };

  return (
    <div className="asset-panel">
      <div
        className={`asset-panel__upload-area ${isDragging ? "asset-panel__upload-area--dragging" : ""}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="asset-panel__upload-icon">
          <Cloud size={48} className="asset-panel__cloud-icon" />
          <Upload size={20} className="asset-panel__arrow-icon" />
        </div>
        <label className="asset-panel__upload-label">
          <span className="asset-panel__upload-text-primary">点击上传</span>
          <span className="asset-panel__upload-text-secondary">
            或将文件拖放到此处
          </span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept={VIDEO_ACCEPT}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
