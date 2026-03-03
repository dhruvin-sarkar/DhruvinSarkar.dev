import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const Quake3Arena = () => (
  <RetroIframeApp
    title="Quake III Arena"
    stateKey="Quake3Expand"
    setterKey="setQuake3Expand"
    windowName="Quake III Arena"
    icon={resolvePublicUrl("icons/quake3.png")}
    iframeSrc={resolvePublicUrl("games/quake3/Quake3.htm?demo")}
    externalUrl={resolvePublicUrl("games/quake3/Quake3.htm?demo")}
    defaultWidth={1024}
    defaultHeight={768}
    defaultPosition={{ x: 160, y: 100 }}
    loadingVariant="quake"
    loadingSubtitle="Loading Quake III Arena..."
    appNotice="Launching the bundled Quake III demo package."
    awaitRuntimeSignal
  />
);

export const displayQuake3Arena = () => <Quake3Arena />;
export default Quake3Arena;
