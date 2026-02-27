import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const SpaceCadet = () => (
  <RetroIframeApp
    title="Space Cadet Pinball"
    stateKey="SpaceCadetExpand"
    setterKey="setSpaceCadetExpand"
    windowName="Space Cadet Pinball"
    icon={resolvePublicUrl("icons/spacecadet.svg")}
    iframeSrc="https://alula.github.io/SpaceCadetPinball/"
    externalUrl="https://alula.github.io/SpaceCadetPinball/"
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 140, y: 90 }}
    loadingVariant="warning"
    loadingSubtitle="Use mouse. F2 = New Game, F3 = Pause."
  />
);

export const displaySpaceCadet = () => <SpaceCadet />;
export default SpaceCadet;
