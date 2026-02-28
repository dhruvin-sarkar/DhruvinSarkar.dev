import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const Quake3Arena = () => (
  <RetroIframeApp
    title="Quake III Arena"
    stateKey="Quake3Expand"
    setterKey="setQuake3Expand"
    windowName="Quake III Arena"
    icon={resolvePublicUrl("icons/quake3.svg")}
    iframeSrc="https://lrusso.github.io/Quake3/Quake3.htm"
    externalUrl="https://lrusso.github.io/Quake3/Quake3.htm"
    defaultWidth={1024}
    defaultHeight={768}
    defaultPosition={{ x: 160, y: 100 }}
    loadingVariant="quake"
    loadingSubtitle="Loading Quake III Arena..."
    appNotice="Quake III Arena requires retail PAK files (pak0.pk3, pak1.pk3, pak4.pk3) in the in-game loader."
    perfWarning={{
      storageKey: "perf-quake3-ok",
      title: "Performance Warning",
      message:
        "Quake III Arena is resource-heavy and may impact frame rate on weaker hardware.",
    }}
  />
);

export const displayQuake3Arena = () => <Quake3Arena />;
export default Quake3Arena;
