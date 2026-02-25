import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const WindowsXPWin95 = () => (
  <RetroIframeApp
    title="Windows 95"
    stateKey="Win95Expand"
    setterKey="setWin95Expand"
    windowName="Windows 95"
    icon="/icons/reference/v86.png"
    iframeSrc={resolvePublicUrl("emulators/win95.html")}
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 70, y: 60 }}
    loadingVariant="warning"
    loadingSubtitle="Booting Virtual x86 (this can take a while)..."
    appNotice="Windows 95 disk image required at /public/emulators/win95.img"
    perfWarning={{
      storageKey: "perf-win95-ok",
      title: "Performance Warning",
      message:
        "Windows 95 emulation can use significant CPU and memory. Continue if your device can handle it.",
    }}
    externalUrl="https://github.com/copy/v86"
  />
);

export const displayWindowsXPWin95 = () => <WindowsXPWin95 />;
export default WindowsXPWin95;
