import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const HollowKnight = () => (
  <RetroIframeApp
    title="Hollow Knight"
    stateKey="HollowKnightExpand"
    setterKey="setHollowKnightExpand"
    windowName="Hollow Knight"
    icon={resolvePublicUrl("icons/Hollow kngiht.png")}
    iframeSrc="https://2games.io/game/hollow-knight/"
    externalUrl="https://2games.io/game/hollow-knight/"
    defaultWidth={1024}
    defaultHeight={768}
    defaultPosition={{ x: 180, y: 120 }}
    loadingSubtitle="Large game — may take up to 2 minutes to load."
    awaitRuntimeSignal={false}
    iframeAllow="autoplay; fullscreen; gamepad; pointer-lock"
    iframeSandbox="allow-scripts allow-same-origin allow-pointer-lock"
    iframeScrolling="no"
    iframeStyle="border:0; width:100%; height:100%"
    timeoutMs={120000}
  />
);

export const displayHollowKnight = () => <HollowKnight />;
export default HollowKnight;
