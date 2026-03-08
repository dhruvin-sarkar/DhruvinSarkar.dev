import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const Ultrakill = () => (
  <RetroIframeApp
    title="ULTRAKILL"
    stateKey="UltrakillExpand"
    setterKey="setUltrakillExpand"
    windowName="ULTRAKILL"
    icon={resolvePublicUrl("icons/Ultrakill.png")}
    iframeSrc="https://gwynfish.github.io/Ultrakill/"
    externalUrl="https://gwynfish.github.io/Ultrakill/"
    defaultWidth={1024}
    defaultHeight={768}
    defaultPosition={{ x: 200, y: 140 }}
    loadingSubtitle="Fast-paced action game loading..."
    awaitRuntimeSignal={false}
  />
);

export const displayUltrakill = () => <Ultrakill />;
export default Ultrakill;
