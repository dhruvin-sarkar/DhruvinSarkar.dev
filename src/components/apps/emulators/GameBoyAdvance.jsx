import React from "react";
import ManifestRomEmulator from "./ManifestRomEmulator";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const GameBoyAdvance = () => (
  <ManifestRomEmulator
    title="Game Boy Advance"
    stateKey="GBAExpand"
    setterKey="setGBAExpand"
    windowName="Game Boy Advance"
    icon={resolvePublicUrl("icons/gba.png")}
    system="gba"
    core="mgba"
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 130, y: 110 }}
  />
);

export const displayGameBoyAdvance = () => <GameBoyAdvance />;
export default GameBoyAdvance;
