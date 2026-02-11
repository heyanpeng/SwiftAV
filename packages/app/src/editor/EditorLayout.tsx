import { Header } from "@/editor/header/Header";
import { Library } from "@/editor/library/Library";
import { Player } from "@/editor/player/Player";
import { Timeline } from "@/editor/timeline/Timeline";
import "./EditorLayout.css";

export function EditorLayout() {
  return (
    <div className="app-editor-layout">
      <Header />
      <div className="app-editor-layout__content">
        <Library />
        <Player />
      </div>
      <Timeline />
    </div>
  );
}
