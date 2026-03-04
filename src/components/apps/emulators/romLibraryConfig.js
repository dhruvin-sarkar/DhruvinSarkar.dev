const LEGAL_NOTICE = "All ROMs were legally sourced.";
const UPLOAD_NOTICE = "You can also upload and run your own ROMs from this browser.";

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
    uploadNotice: UPLOAD_NOTICE,
    extraNotice:
      "PlayStation 1 game files were too large to bundle in this repository. The emulator works, but you need to use your own PS1 ROMs.",
    supportsUpload: true,
    uploadAccept: ".chd,.iso,.img,.pbp,.zip",
    uploadHelpText:
      "Upload a single-file disc image or a zipped package. Raw multi-file .cue + .bin sets should be zipped first.",
    emptyStateText: "No bundled PlayStation 1 ROMs are stored in this repository.",
  },
  gba: {
    label: "Game Boy Advance",
    badge: "GBA",
    legalNotice: LEGAL_NOTICE,
    uploadNotice: UPLOAD_NOTICE,
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
    supportsUpload: true,
    uploadAccept: "",
    uploadHelpText: "You can upload and run your own ROMs from this browser.",
    emptyStateText: `No bundled ROMs were found in /public/roms/${system}/.`,
  };

export default SYSTEM_CONFIG;
