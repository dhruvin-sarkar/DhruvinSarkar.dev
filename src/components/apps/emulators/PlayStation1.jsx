import React from "react";
import ManifestRomEmulator from "./ManifestRomEmulator";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const PlayStation1 = () => (
  <ManifestRomEmulator
    title="PlayStation 1"
    stateKey="PS1Expand"
    setterKey="setPS1Expand"
    windowName="PlayStation 1"
    icon={resolvePublicUrl("icons/ps1.png")}
    system="ps1"
    core="pcsx_rearmed"
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 110, y: 90 }}
  />
);

export const displayPlayStation1 = () => <PlayStation1 />;
export default PlayStation1;
