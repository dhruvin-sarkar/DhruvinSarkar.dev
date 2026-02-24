import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";

const QuakeOriginal = () => (
  <RetroIframeApp
    title="Quake"
    stateKey="Quake1Expand"
    setterKey="setQuake1Expand"
    windowName="Quake"
    icon="/icons/quake1.png"
    iframeSrc="https://www.quakejs.com/"
    externalUrl="https://www.quakejs.com/"
    defaultWidth={960}
    defaultHeight={640}
    defaultPosition={{ x: 180, y: 110 }}
    loadingVariant="quake"
    loadingSubtitle="Classic QuakeJS web build loading..."
  />
);

export const displayQuakeOriginal = () => <QuakeOriginal />;
export default QuakeOriginal;
