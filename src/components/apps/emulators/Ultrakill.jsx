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
    iframeAllow="autoplay; fullscreen; gamepad; pointer-lock"
    iframeSandbox="allow-scripts allow-same-origin allow-pointer-lock"
    iframeScrolling="no"
    iframeStyle="border:0; width:100%; height:100%"
    timeoutMs={120000}
  />
);

export const displayUltrakill = () => <Ultrakill />;
export default Ultrakill;
