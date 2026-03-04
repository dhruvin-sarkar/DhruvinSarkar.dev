import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const WindowsXPWin95 = () => (
  <RetroIframeApp
    title="Windows 95"
    stateKey="Win95Expand"
    setterKey="setWin95Expand"
    windowName="Windows 95"
    icon={resolvePublicUrl("icons/win95.png")}
    iframeSrc={resolvePublicUrl("emulators/win95.html")}
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 70, y: 60 }}
    loadingVariant="warning"
    loadingSubtitle="Booting Virtual x86 (this can take a while)..."
    appNotice="Boots the local image when present. If win95.img is missing, this window stays local and shows a compatibility dialog with an optional hosted fallback."
    externalUrl="https://copy.sh/v86/?profile=windows95"
    awaitRuntimeSignal
  />
);

export const displayWindowsXPWin95 = () => <WindowsXPWin95 />;
export default WindowsXPWin95;
