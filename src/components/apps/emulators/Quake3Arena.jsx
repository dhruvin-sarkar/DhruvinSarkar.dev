import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const Quake3Arena = () => (
  <RetroIframeApp
    title="Quake III Arena"
    stateKey="Quake3Expand"
    setterKey="setQuake3Expand"
    windowName="Quake III Arena"
    icon={resolvePublicUrl("icons/reference/quake3.png")}
    iframeSrc="https://lrusso.github.io/Quake3/"
    externalUrl="https://lrusso.github.io/Quake3/"
    defaultWidth={1024}
    defaultHeight={768}
    defaultPosition={{ x: 160, y: 100 }}
    loadingVariant="quake"
    loadingSubtitle="Click to capture mouse, press Escape to release."
    perfWarning={{
      storageKey: "perf-quake3-ok",
      title: "Performance Warning",
      message:
        "Quake III is resource-heavy and may impact frame rate on weaker hardware.",
    }}
  />
);

export const displayQuake3Arena = () => <Quake3Arena />;
export default Quake3Arena;
