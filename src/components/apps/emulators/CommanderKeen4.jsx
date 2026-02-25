import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const CommanderKeen4 = () => (
  <RetroIframeApp
    title="Commander Keen 4"
    stateKey="Keen4Expand"
    setterKey="setKeen4Expand"
    windowName="Commander Keen 4"
    icon={resolvePublicUrl("icons/reference/jsdos.png")}
    iframeSrc={resolvePublicUrl("emulators/keen4.html")}
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 100, y: 80 }}
    loadingSubtitle="Loading js-dos runtime..."
    appNotice="Use your own .jsdos/.zip/.exe package, or add /public/games/commanderkeen/keen4.jsdos."
  />
);

export const displayCommanderKeen4 = () => <CommanderKeen4 />;
export default CommanderKeen4;
