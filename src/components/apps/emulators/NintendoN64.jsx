import React from "react";
import ManifestRomEmulator from "./ManifestRomEmulator";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const NintendoN64 = () => (
  <ManifestRomEmulator
    title="Nintendo 64"
    stateKey="N64Expand"
    setterKey="setN64Expand"
    windowName="Nintendo 64"
    icon={resolvePublicUrl("icons/n64.svg")}
    system="n64"
    core="n64"
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 90, y: 70 }}
  />
);

export const displayNintendoN64 = () => <NintendoN64 />;
export default NintendoN64;
