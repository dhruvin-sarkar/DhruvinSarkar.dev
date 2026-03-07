import React from "react";
import ManifestRomEmulator from "./ManifestRomEmulator";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const Nintendo3DS = () => (
  <ManifestRomEmulator
    title="Nintendo 3DS"
    icon={resolvePublicUrl("icons/3ds.png")}
    system="3ds"
    core="citra"
    stateKey="ThreeDSExpand"
    setterKey="setThreeDSExpand"
    windowName="Nintendo 3DS"
    defaultWidth={980}
    defaultHeight={700}
    defaultPosition={{ x: 110, y: 70 }}
  />
);

export const displayNintendo3DS = () => <Nintendo3DS />;
export default Nintendo3DS;
