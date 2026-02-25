import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const NintendoN64 = () => (
  <RetroIframeApp
    title="Nintendo 64"
    stateKey="N64Expand"
    setterKey="setN64Expand"
    windowName="Nintendo 64"
    icon={resolvePublicUrl("icons/n64.png")}
    iframeSrc={resolvePublicUrl("emulators/ejs-loader.html?core=n64")}
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 90, y: 70 }}
    loadingSubtitle="Booting EmulatorJS core (n64)..."
  />
);

export const displayNintendoN64 = () => <NintendoN64 />;
export default NintendoN64;
