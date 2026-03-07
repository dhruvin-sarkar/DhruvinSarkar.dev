import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "public");

const blockedArchiveExtensions = new Set([
  ".3ds",
  ".cia",
  ".zip",
  ".7z",
  ".bin",
  ".cue",
  ".iso",
  ".img",
  ".pbp",
  ".chd",
  ".crdownload",
]);

const isProxyHostedRomPath = (normalizedRelativePath) =>
  normalizedRelativePath.startsWith("roms/3ds/") ||
  normalizedRelativePath.startsWith("roms/ps1/");

const shouldCopyPublicAsset = (sourcePath) => {
  const relativePath = path.relative(publicDir, sourcePath);
  if (!relativePath || relativePath.startsWith("..")) {
    return true;
  }

  const normalizedRelativePath = relativePath.split(path.sep).join("/");
  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    return true;
  }

  if (!isProxyHostedRomPath(normalizedRelativePath)) {
    return true;
  }

  return !blockedArchiveExtensions.has(path.extname(sourcePath).toLowerCase());
};

const filteredPublicCopyPlugin = () => ({
  name: "filtered-public-copy",
  closeBundle() {
    const outDir = path.resolve(__dirname, "dist");

    fs.cpSync(publicDir, outDir, {
      recursive: true,
      filter: shouldCopyPublicAsset,
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), filteredPublicCopyPlugin()],
  // Use a relative base so it works on GitHub Pages subfolder and Vercel root.
  base: "./",
  build: {
    copyPublicDir: false,
    sourcemap: false,
  },
  define: {
    global: "globalThis",
  },
});
