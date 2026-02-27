import React from "react";
import ManifestRomEmulator from "./ManifestRomEmulator";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const GameBoyAdvance = () => (
  <ManifestRomEmulator
    title="Game Boy Advance"
    stateKey="GBAExpand"
    setterKey="setGBAExpand"
    windowName="Game Boy Advance"
    icon={resolvePublicUrl("icons/gba.svg")}
    system="gba"
    core="mgba"
    defaultWidth={480}
    defaultHeight={320}
    defaultPosition={{ x: 130, y: 110 }}
  />
);

export const displayGameBoyAdvance = () => <GameBoyAdvance />;
export default GameBoyAdvance;
