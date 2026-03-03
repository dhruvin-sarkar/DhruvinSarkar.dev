import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const QuakeOriginal = () => (
  <RetroIframeApp
    title="Quake"
    stateKey="Quake1Expand"
    setterKey="setQuake1Expand"
    windowName="Quake"
    icon={resolvePublicUrl("icons/quake1.png")}
    iframeSrc={resolvePublicUrl("games/webquake/index.htm")}
    externalUrl={resolvePublicUrl("games/webquake/index.htm")}
    defaultWidth={960}
    defaultHeight={720}
    defaultPosition={{ x: 180, y: 110 }}
    loadingVariant="quake"
    loadingSubtitle="WebQuake HTML5/WebGL engine loading..."
    awaitRuntimeSignal
  />
);

export const displayQuakeOriginal = () => <QuakeOriginal />;
export default QuakeOriginal;
