import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";

const DXBall = () => (
  <RetroIframeApp
    title="DX-Ball"
    stateKey="DXBallExpand"
    setterKey="setDXBallExpand"
    windowName="DX-Ball"
    icon="/icons/reference/dxball.png"
    iframeSrc="/games/dxball/index.html"
    externalUrl="https://dustinbrett.com/"
    defaultWidth={640}
    defaultHeight={480}
    defaultPosition={{ x: 140, y: 130 }}
    loadingSubtitle="Loading classic DX-Ball assets..."
  />
);

export const displayDXBall = () => <DXBall />;
export default DXBall;
