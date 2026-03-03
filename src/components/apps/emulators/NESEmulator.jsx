import React from "react";
import ManifestRomEmulator from "./ManifestRomEmulator";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const NESEmulator = () => (
  <ManifestRomEmulator
    title="NES Emulator"
    stateKey="NESExpand"
    setterKey="setNESExpand"
    windowName="NES Emulator"
    icon={resolvePublicUrl("icons/nes.png")}
    system="nes"
    core="fceumm"
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 150, y: 130 }}
  />
);

export const displayNESEmulator = () => <NESEmulator />;
export default NESEmulator;
