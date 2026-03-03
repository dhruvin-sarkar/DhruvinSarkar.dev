import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const SpaceCadet = () => (
  <RetroIframeApp
    title="Space Cadet Pinball"
    stateKey="SpaceCadetExpand"
    setterKey="setSpaceCadetExpand"
    windowName="Space Cadet Pinball"
    icon={resolvePublicUrl("icons/spacecadet.png")}
    iframeSrc={resolvePublicUrl("games/spacecadet/index.html")}
    externalUrl={resolvePublicUrl("games/spacecadet/index.html")}
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 140, y: 90 }}
    loadingVariant="warning"
    loadingSubtitle="Use mouse. F2 = New Game, F3 = Pause."
    awaitRuntimeSignal
  />
);

export const displaySpaceCadet = () => <SpaceCadet />;
export default SpaceCadet;
