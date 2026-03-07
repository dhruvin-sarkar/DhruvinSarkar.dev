import React from "react";
import RetroIframeApp from "../shared/RetroIframeApp";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const ChromeDino = () => (
  <RetroIframeApp
    title="Chrome Dino"
    stateKey="DinoExpand"
    setterKey="setDinoExpand"
    windowName="Chrome Dino"
    icon={resolvePublicUrl("icons/chromedino.png")}
    iframeSrc={resolvePublicUrl("games/dino/index.html")}
    externalUrl="https://github.com/wayou/t-rex-runner"
    defaultWidth={800}
    defaultHeight={300}
    defaultPosition={{ x: 120, y: 120 }}
    loadingSubtitle="NO INTERNET - press space or tap to start"
  />
);

export const displayChromeDino = () => <ChromeDino />;
export default ChromeDino;
