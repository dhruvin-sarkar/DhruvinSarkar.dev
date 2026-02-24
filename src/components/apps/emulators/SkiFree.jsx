import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";

const SkiFree = () => (
  <RetroIframeApp
    title="SkiFree"
    stateKey="SkiFreeExpand"
    setterKey="setSkiFreeExpand"
    windowName="SkiFree"
    icon="/icons/skifree.svg"
    iframeSrc="https://basicallydan.github.io/skifree.js/"
    externalUrl="https://basicallydan.github.io/skifree.js/"
    defaultWidth={800}
    defaultHeight={500}
    defaultPosition={{ x: 160, y: 140 }}
    loadingSubtitle="Avoid trees, outrun the yeti."
  />
);

export const displaySkiFree = () => <SkiFree />;
export default SkiFree;
