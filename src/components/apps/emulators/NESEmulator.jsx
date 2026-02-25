import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const NESEmulator = () => (
  <RetroIframeApp
    title="NES Emulator"
    stateKey="NESExpand"
    setterKey="setNESExpand"
    windowName="NES Emulator"
    icon="/icons/nes.png"
    iframeSrc={resolvePublicUrl("emulators/ejs-loader.html?core=nes")}
    defaultWidth={512}
    defaultHeight={480}
    defaultPosition={{ x: 150, y: 130 }}
    loadingSubtitle="Booting EmulatorJS core (NES)..."
  />
);

export const displayNESEmulator = () => <NESEmulator />;
export default NESEmulator;
