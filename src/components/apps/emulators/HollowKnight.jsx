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
    iframeSrc="https://aukak.github.io/hollow-knight/"
    externalUrl="https://aukak.github.io/hollow-knight/"
    defaultWidth={1024}
    defaultHeight={768}
    defaultPosition={{ x: 180, y: 120 }}
    loadingSubtitle="Large game — may take up to 2 minutes to load."
    awaitRuntimeSignal={false}
  />
);

export const displayHollowKnight = () => <HollowKnight />;
export default HollowKnight;
