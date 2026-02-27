import React, { useEffect, useMemo, useState } from "react";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const SYSTEM_COLORS = {
  n64: "#2b7f53",
  ps1: "#8c4545",
  gba: "#5a4da8",
  nes: "#6c6c6c",
};

const getInitials = (title = "") =>
  title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

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
        const response = await fetch(
          resolvePublicUrl(`roms/${system}/manifest.json`),
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

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

  if (isLoading) {
    return (
      <div className="rom-library-state">
        <h3>Loading {badgeLabel} ROM library...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rom-library-state">
        <h3>Unable to load ROM library</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!roms.length) {
    return (
      <div className="rom-library-state">
        <h3>No ROMs found</h3>
        <p>Add ROM files to /public/roms/{system}/ and refresh.</p>
      </div>
    );
  }

  return (
    <div className="rom-library-grid">
      {roms.map((rom) => {
        const title = rom?.title || rom?.id || "Untitled ROM";
        const initials = getInitials(title) || "ROM";
        const cover = rom?.cover ? resolvePublicUrl(rom.cover) : "";

        return (
          <button
            type="button"
            className="rom-card"
            key={rom?.id || `${rom?.file}-${title}`}
            onClick={() => onSelectRom(rom)}
          >
            {cover ? (
              <img
                src={cover}
                alt={title}
                className="rom-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  const fallback = event.currentTarget.nextSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="rom-cover rom-cover-fallback"
              style={{
                display: cover ? "none" : "flex",
                background: SYSTEM_COLORS[system] || "#3f3f3f",
              }}
            >
              {initials}
            </div>
            <div className="rom-card-meta">
              <strong>{title}</strong>
              <span>{badgeLabel}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default RomLibrary;
