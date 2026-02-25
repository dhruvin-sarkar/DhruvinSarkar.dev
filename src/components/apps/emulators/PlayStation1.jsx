import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const PlayStation1 = () => (
  <RetroIframeApp
    title="PlayStation 1"
    stateKey="PS1Expand"
    setterKey="setPS1Expand"
    windowName="PlayStation 1"
    icon={resolvePublicUrl("icons/ps1.png")}
    iframeSrc={resolvePublicUrl("emulators/ejs-loader.html?core=ps1")}
    defaultWidth={800}
    defaultHeight={600}
    defaultPosition={{ x: 110, y: 90 }}
    loadingSubtitle="Booting EmulatorJS core (PS1)..."
  />
);

export const displayPlayStation1 = () => <PlayStation1 />;
export default PlayStation1;
