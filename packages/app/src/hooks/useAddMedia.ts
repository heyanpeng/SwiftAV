import { useRef, useCallback } from "react";
import { useProjectStore } from "@/stores";

const VIDEO_ACCEPT = "video/*,video/x-matroska,video/mp2t,.ts";

/**
 * 复用添加媒体（视频）逻辑：触发文件选择器并调用 loadVideoFile。
 * 可用于 SidebarNav 添加按钮、MediaPanel 上传区域等。
 */
export function useAddMedia() {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const loadVideoFile = useProjectStore((s) => s.loadVideoFile);

	const trigger = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFileChange: React.ChangeEventHandler<HTMLInputElement> =
		useCallback(
			async (event) => {
				const file = event.target.files?.[0];
				if (!file) return;
				await loadVideoFile(file);
				event.target.value = "";
			},
			[loadVideoFile],
		);

	const loadFile = useCallback(
		async (file: File) => {
			await loadVideoFile(file);
		},
		[loadVideoFile],
	);

	return {
		/** 触发文件选择（供按钮 onClick 调用） */
		trigger,
		/** 直接加载指定文件（供拖放等场景） */
		loadFile,
		/** input 的 ref */
		fileInputRef,
		/** 隐藏的 file input 的 props，需配合 ref 渲染到 DOM */
		fileInputProps: {
			type: "file" as const,
			accept: VIDEO_ACCEPT,
			style: { display: "none" },
			onChange: handleFileChange,
		},
	};
}
