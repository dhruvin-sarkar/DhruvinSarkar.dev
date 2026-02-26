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
    iframeSrc={resolvePublicUrl("games/quake3/Quake3.htm")}
    externalUrl="https://lrusso.github.io/Quake3/Quake3.htm"
    defaultWidth={1024}
    defaultHeight={768}
    defaultPosition={{ x: 160, y: 100 }}
    loadingVariant="quake"
    loadingSubtitle="Click the red icon to load PK3 files, then the game boots automatically."
    loadTimeoutMs={30000}
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
