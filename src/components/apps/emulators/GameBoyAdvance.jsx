import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";

const GameBoyAdvance = () => (
  <RetroIframeApp
    title="Game Boy Advance"
    stateKey="GBAExpand"
    setterKey="setGBAExpand"
    windowName="Game Boy Advance"
    icon="/icons/reference/emulator.png"
    iframeSrc="/emulators/ejs-loader.html?core=gba"
    defaultWidth={480}
    defaultHeight={320}
    defaultPosition={{ x: 130, y: 110 }}
    loadingSubtitle="Booting EmulatorJS core (GBA)..."
  />
);

export const displayGameBoyAdvance = () => <GameBoyAdvance />;
export default GameBoyAdvance;
