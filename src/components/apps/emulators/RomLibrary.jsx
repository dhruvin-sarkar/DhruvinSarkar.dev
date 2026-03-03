import React, { useEffect, useMemo, useState } from "react";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const SYSTEM_LABELS = {
  n64: "Nintendo 64",
  ps1: "PlayStation",
  gba: "Game Boy Advance",
  nes: "Nintendo Entertainment System",
};

const getInitials = (title = "") =>
  title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const LibraryState = ({ title, message, action }) => (
  <div className="rom-library-state">
    <div className="rom-library-dialog">
      <h3>{title}</h3>
      <div className="panel-body">
        <div className="win95-panel-icon">!</div>
        <div className="win95-panel-copy">
          <p>{message}</p>
          {action ? <div className="iframe-error-actions">{action}</div> : null}
        </div>
      </div>
    </div>
  </div>
);

const RomLibrary = ({ system, onSelectRom }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [roms, setRoms] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadManifest = async () => {
      setIsLoading(true);
      setError("");
      setRoms([]);

      try {
        const response = await fetch(resolvePublicUrl(`roms/${system}/manifest.json`), {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 404) {
            setRoms([]);
            setIsLoading(false);
            return;
          }

          throw new Error(`Failed to load ROM manifest (${response.status}).`);
        }

        const payload = await response.json();
        const entries = Array.isArray(payload?.roms) ? payload.roms : [];
        setRoms(entries);
      } catch (loadError) {
        if (loadError?.name === "AbortError") return;
        setError(loadError?.message || "Failed to load ROM library.");
      } finally {
        setIsLoading(false);
      }
    };

    loadManifest();
    return () => controller.abort();
  }, [system]);

  const badgeLabel = useMemo(() => system.toUpperCase(), [system]);
  const systemLabel = useMemo(() => SYSTEM_LABELS[system] || badgeLabel, [badgeLabel, system]);

  if (isLoading) {
    return (
      <LibraryState
        title={`${systemLabel} Library`}
        message={`Scanning /public/roms/${system}/ for available games...`}
      />
    );
  }

  if (error) {
    return (
      <LibraryState
        title="Unable to Load Library"
        message={error}
        action={
          <button type="button" className="rom-library-empty-button" onClick={() => window.location.reload()}>
            Refresh
          </button>
        }
      />
    );
  }

  if (!roms.length) {
    return (
      <LibraryState
        title="No ROMs Found"
        message={`Add ROM files to /public/roms/${system}/ and refresh the desktop.`}
        action={
          <button type="button" className="rom-library-empty-button" onClick={() => window.location.reload()}>
            Refresh
          </button>
        }
      />
    );
  }

  return (
    <div className="rom-library-shell">
      <div className="rom-library-toolbar">
        <strong>{systemLabel} Library</strong>
        <span>{roms.length} file(s)</span>
      </div>

      <div className="rom-library-browser">
        <aside className="rom-library-sidebar">
          <span className="system-badge">{badgeLabel}</span>
          <h4>Open a game</h4>
          <p>Select a file from the list to launch it immediately in the emulator.</p>
          <h4>Source folder</h4>
          <p>/public/roms/{system}/</p>
        </aside>

        <section className="rom-library-main">
          <div className="rom-library-listhead">
            <span>Name</span>
            <span>System</span>
            <span>File</span>
          </div>

          <div className="rom-library-list">
            {roms.map((rom) => {
              const title = rom?.title || rom?.id || "Untitled ROM";
              const initials = getInitials(title) || "ROM";
              const cover = rom?.cover ? resolvePublicUrl(rom.cover) : "";

              return (
                <button
                  type="button"
                  className="rom-library-row"
                  key={rom?.id || `${rom?.file}-${title}`}
                  onClick={() => onSelectRom(rom)}
                  title={`Open ${title}`}
                >
                  <span className="rom-library-name">
                    <span className="rom-library-art">
                      {cover ? (
                        <img
                          src={cover}
                          alt={title}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            const fallback = event.currentTarget.parentElement?.querySelector(
                              ".rom-library-art-fallback",
                            );
                            if (fallback) fallback.style.display = "grid";
                          }}
                        />
                      ) : null}
                      <span
                        className="rom-library-art-fallback"
                        style={{ display: cover ? "none" : "grid" }}
                      >
                        {initials}
                      </span>
                    </span>
                    <span className="rom-library-titleblock">
                      <span className="rom-library-title">{title}</span>
                      <span className="rom-library-subtitle">Click to launch</span>
                    </span>
                  </span>
                  <span className="rom-library-system">{badgeLabel}</span>
                  <span className="rom-library-file">{rom?.file || "Unknown file"}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="rom-library-statusbar">
        <span>Ready</span>
        <span>{systemLabel}</span>
      </div>
    </div>
  );
};

export default RomLibrary;
