import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const QuakeOriginal = () => (
  <RetroIframeApp
    title="Quake"
    stateKey="Quake1Expand"
    setterKey="setQuake1Expand"
    windowName="Quake"
    icon={resolvePublicUrl("icons/quake1.svg")}
    iframeSrc={resolvePublicUrl("games/webquake/index.htm")}
    externalUrl="https://github.com/Triang3l/WebQuake"
    defaultWidth={960}
    defaultHeight={640}
    defaultPosition={{ x: 180, y: 110 }}
    loadingVariant="quake"
    loadingSubtitle="WebQuake HTML5/WebGL engine loading..."
    loadTimeoutMs={30000}
  />
);

export const displayQuakeOriginal = () => <QuakeOriginal />;
export default QuakeOriginal;
