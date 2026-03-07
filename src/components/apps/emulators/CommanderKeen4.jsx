import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const CommanderKeen4 = () => (
  <RetroIframeApp
    title="Commander Keen 4"
    stateKey="Keen4Expand"
    setterKey="setKeen4Expand"
    windowName="Commander Keen 4"
    icon={resolvePublicUrl("icons/commanderkeen.ico")}
    iframeSrc={resolvePublicUrl("emulators/keen4.html")}
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 100, y: 80 }}
    loadingSubtitle="Loading Commander Keen 4..."
    appNotice="Launching Commander Keen 4 through the bundled local DOS package."
    awaitRuntimeSignal
  />
);

export const displayCommanderKeen4 = () => <CommanderKeen4 />;
export default CommanderKeen4;
