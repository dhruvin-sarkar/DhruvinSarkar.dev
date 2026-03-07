const LEGAL_NOTICE = "All ROMs were legally sourced.";
const UPLOAD_NOTICE = "You can also upload and run your own ROMs from this browser.";
const PROXY_NOTICE = "This library streams games through the portfolio's Cloudflare ROM proxy.";

const SYSTEM_CONFIG = {
  n64: {
    label: "Nintendo 64",
    badge: "N64",
    legalNotice: LEGAL_NOTICE,
    uploadNotice: UPLOAD_NOTICE,
    supportsUpload: true,
    uploadAccept: ".z64,.n64,.v64,.zip",
    uploadHelpText: "Accepted files: .z64, .n64, .v64, and .zip",
    emptyStateText: "No bundled Nintendo 64 ROMs were found in /public/roms/n64/.",
  },
  ps1: {
    label: "PlayStation 1",
    badge: "PS1",
    legalNotice: LEGAL_NOTICE,
    uploadNotice: PROXY_NOTICE,
    biosUrl: "https://portfolio-rom-proxy.dhruvinsarkar.workers.dev/bios/scph5501.bin",
    extraNotice:
      "PlayStation 1 disc images stay in private R2 storage and are exposed only through Worker-backed manifest entries and a Worker-backed BIOS URL.",
    supportsUpload: false,
    uploadAccept: "",
    uploadHelpText:
      "Manifest entries point at Worker proxy URLs. This build also expects a Worker-backed SCPH-5501 BIOS for USA titles. Local browser uploads are disabled for PlayStation 1.",
    emptyStateText: "No PlayStation 1 proxy entries were found in /public/roms/ps1/manifest.json.",
  },
  "3ds": {
    label: "Nintendo 3DS",
    badge: "3DS",
    legalNotice: LEGAL_NOTICE,
    uploadNotice: PROXY_NOTICE,
    extraNotice:
      "Nintendo 3DS titles use Worker-backed .3ds or .cia URLs from the manifest. The proxy architecture is ready, but EmulatorJS currently lists the Citra core as unavailable for the web build.",
    launchSupport: "unavailable",
    unavailableTitle: "Nintendo 3DS runtime unavailable",
    unavailableMessage:
      "The ROM library and Worker-backed proxy manifest are wired correctly, but EmulatorJS does not currently provide a usable Nintendo 3DS Citra core for the browser build.",
    supportsUpload: false,
    uploadAccept: "",
    uploadHelpText:
      "Add Worker proxy URLs to /public/roms/3ds/manifest.json. Local browser uploads are disabled for Nintendo 3DS.",
    emptyStateText: "No Nintendo 3DS proxy entries were found in /public/roms/3ds/manifest.json.",
  },
  gba: {
    label: "Game Boy Advance",
    badge: "GBA",
    legalNotice: LEGAL_NOTICE,
    uploadNotice: UPLOAD_NOTICE,
    launchSupport: "supported",
    biosUrl: "",
    supportsUpload: true,
    uploadAccept: ".gba,.zip",
    uploadHelpText: "Accepted files: .gba and .zip",
    emptyStateText: "No bundled Game Boy Advance ROMs were found in /public/roms/gba/.",
  },
  nes: {
    label: "Nintendo Entertainment System",
    badge: "NES",
    legalNotice: LEGAL_NOTICE,
    uploadNotice: UPLOAD_NOTICE,
    supportsUpload: true,
    uploadAccept: ".nes,.zip",
    uploadHelpText: "Accepted files: .nes and .zip",
    emptyStateText: "No bundled Nintendo Entertainment System ROMs were found in /public/roms/nes/.",
  },
};

export const getSystemConfig = (system) =>
  SYSTEM_CONFIG[system] || {
    label: system?.toUpperCase?.() || "ROM Library",
    badge: system?.toUpperCase?.() || "ROM",
    legalNotice: LEGAL_NOTICE,
    uploadNotice: UPLOAD_NOTICE,
    launchSupport: "supported",
    unavailableTitle: "Emulator unavailable",
    unavailableMessage: "This emulator is not available in the current build.",
    biosUrl: "",
    supportsUpload: true,
    uploadAccept: "",
    uploadHelpText: "You can upload and run your own ROMs from this browser.",
    emptyStateText: `No bundled ROMs were found in /public/roms/${system}/.`,
  };

export default SYSTEM_CONFIG;
