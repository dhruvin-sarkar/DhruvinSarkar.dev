import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";

const SpaceCadet = () => (
  <RetroIframeApp
    title="Space Cadet Pinball"
    stateKey="SpaceCadetExpand"
    setterKey="setSpaceCadetExpand"
    windowName="Space Cadet Pinball"
    icon="/icons/spacecadet.svg"
    iframeSrc="https://pinball.alula.me/"
    externalUrl="https://pinball.alula.me/"
    defaultWidth={800}
    defaultHeight={640}
    defaultPosition={{ x: 140, y: 90 }}
    loadingVariant="warning"
    loadingSubtitle="Use mouse. F2 = New Game, F3 = Pause."
  />
);

export const displaySpaceCadet = () => <SpaceCadet />;
export default SpaceCadet;
