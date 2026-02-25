import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const GameBoyAdvance = () => (
  <RetroIframeApp
    title="Game Boy Advance"
    stateKey="GBAExpand"
    setterKey="setGBAExpand"
    windowName="Game Boy Advance"
    icon={resolvePublicUrl("icons/gba.png")}
    iframeSrc={resolvePublicUrl("emulators/ejs-loader.html?core=gba")}
    defaultWidth={480}
    defaultHeight={320}
    defaultPosition={{ x: 130, y: 110 }}
    loadingSubtitle="Booting EmulatorJS core (GBA)..."
  />
);

export const displayGameBoyAdvance = () => <GameBoyAdvance />;
export default GameBoyAdvance;
