import { create } from "zustand";
import {
  type Project,
  type Asset,
  type Track,
  type Clip,
  createEmptyProject,
  addTrack,
  addClip,
  getProjectDuration,
} from "@swiftav/project";
import { probeMedia } from "@swiftav/media";
import { renderVideoWithCanvasLoop } from "@swiftav/renderer";
import { createId } from "@swiftav/utils";
import type { ProjectStore } from "./projectStore.types";

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  loading: false,
  videoUrl: null,
  canvasBackgroundColor: "#000000",

  async loadVideoFile(file: File) {
    const blobUrl = URL.createObjectURL(file);

    set({ loading: true });
    try {
      const info = await probeMedia({ type: "blob", blob: file });

      const existing = get().project;
      let project: Project;

      if (existing) {
        // 已有工程：新增资源 + 新视频轨道（在最上方）+ 新片段
        const assetId = createId("asset");
        const asset: Asset = {
          id: assetId,
          name: file.name,
          source: blobUrl,
          kind: "video",
          duration: info.duration,
          videoMeta: info.video
            ? {
                width: info.video.displayWidth,
                height: info.video.displayHeight,
                rotation: info.video.rotation,
                fps: undefined,
                codec: info.video.codec ?? undefined,
              }
            : undefined,
          audioMeta: info.audio
            ? {
                sampleRate: info.audio.sampleRate,
                channels: info.audio.numberOfChannels,
                codec: info.audio.codec ?? undefined,
              }
            : undefined,
        };

        project = {
          ...existing,
          assets: [...existing.assets, asset],
        };

        const trackId = createId("track");
        const topOrder =
          Math.max(...project.tracks.map((t) => t.order), -1) + 1;
        const trackBase: Omit<Track, "clips"> = {
          id: trackId,
          kind: "video",
          name: file.name,
          order: topOrder,
          muted: false,
          hidden: false,
          locked: false,
        };

        project = addTrack(project, trackBase);

        const clipId = createId("clip");
        const clip: Clip = {
          id: clipId,
          trackId,
          assetId,
          kind: "video",
          start: 0,
          end: info.duration,
          inPoint: 0,
          outPoint: info.duration,
          transform: { x: 0, y: 0 },
        };

        project = addClip(project, clip);
      } else {
        // 无工程：创建新工程，并释放之前可能残留的 blob URL
        const prevUrl = get().videoUrl;
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }

        const projectId = createId("project");
        const width = info.video?.displayWidth ?? 1920;
        const height = info.video?.displayHeight ?? 1080;

        project = createEmptyProject({
          id: projectId,
          name: file.name,
          fps: 30,
          width,
          height,
          exportSettings: { format: "mp4" },
        });

        const assetId = createId("asset");
        const asset: Asset = {
          id: assetId,
          name: file.name,
          source: blobUrl,
          kind: "video",
          duration: info.duration,
          videoMeta: info.video
            ? {
                width: info.video.displayWidth,
                height: info.video.displayHeight,
                rotation: info.video.rotation,
                fps: undefined,
                codec: info.video.codec ?? undefined,
              }
            : undefined,
          audioMeta: info.audio
            ? {
                sampleRate: info.audio.sampleRate,
                channels: info.audio.numberOfChannels,
                codec: info.audio.codec ?? undefined,
              }
            : undefined,
        };

        project = { ...project, assets: [asset] };

        const trackId = createId("track");
        const trackBase: Omit<Track, "clips"> = {
          id: trackId,
          kind: "video",
          name: "主视频",
          order: 0,
          muted: false,
          hidden: false,
          locked: false,
        };

        project = addTrack(project, trackBase);

        const clipId = createId("clip");
        const clip: Clip = {
          id: clipId,
          trackId,
          assetId,
          kind: "video",
          start: 0,
          end: info.duration,
          inPoint: 0,
          outPoint: info.duration,
          transform: { x: 0, y: 0 },
        };

        project = addClip(project, clip);
      }

      const duration = getProjectDuration(project);

      set({
        project,
        duration,
        currentTime: get().currentTime,
        isPlaying: false,
        videoUrl: blobUrl,
      });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentTime(time: number) {
    set({ currentTime: time });
  },

  setIsPlaying(isPlaying: boolean) {
    set({ isPlaying });
  },

  setCanvasBackgroundColor(color: string) {
    set({ canvasBackgroundColor: color });
  },

  async exportToMp4(onProgress?: (progress: number) => void): Promise<Blob | null> {
    const { project } = get();
    if (!project) return null;
    if (!project.assets.length) return null;

    const mainAsset = project.assets.find((a) => a.kind === "video");
    if (!mainAsset) return null;

    set({ loading: true });
    try {
      // 准备离屏 canvas
      const canvas = document.createElement("canvas");
      canvas.width = project.width;
      canvas.height = project.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // 准备 video 元素用于按时间采样帧
      const video = document.createElement("video");
      video.src = mainAsset.source;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;

      await new Promise<void>((resolve, reject) => {
        video.addEventListener("loadedmetadata", () => resolve(), { once: true });
        video.addEventListener("error", () => reject(new Error("视频加载失败")), {
          once: true,
        });
      });

      const duration = getProjectDuration(project);

      const output = await renderVideoWithCanvasLoop({
        canvas,
        duration,
        fps: project.fps,
        async renderFrame(time) {
          // 将 video 跳到指定时间，然后绘制到 canvas
          await new Promise<void>((resolve) => {
            const handler = () => {
              video.removeEventListener("seeked", handler);
              resolve();
            };
            video.addEventListener("seeked", handler);
            video.currentTime = Math.min(time, duration);
          });
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        },
        onProgress,
      });

      // 从 BufferTarget 读取编码后的数据
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const target: any = (output as any).target;
      const buffer: ArrayBuffer | Uint8Array | undefined = target?.buffer;
      if (!buffer) return null;

      // mediabunny 的 BufferTarget 可能返回 ArrayBuffer 或 Uint8Array<ArrayBufferLike>
      // 这里统一将其拷贝为普通 ArrayBuffer，再作为 BlobPart 使用，避免 ArrayBufferLike 类型不兼容。
      let arrayBuffer: ArrayBuffer | null = null;

      if (buffer instanceof Uint8Array) {
        const copy = buffer.slice(); // 拷贝一份，确保底层 buffer 可安全使用
        arrayBuffer = copy.buffer;
      } else {
        const view = new Uint8Array(buffer as ArrayBufferLike);
        const copy = view.slice();
        arrayBuffer = copy.buffer;
      }

      if (!arrayBuffer) return null;

      return new Blob([arrayBuffer], { type: "video/mp4" });
    } finally {
      set({ loading: false });
    }
  },
}));

