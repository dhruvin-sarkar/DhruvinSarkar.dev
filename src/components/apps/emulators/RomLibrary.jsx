import React, { useEffect, useMemo, useRef, useState } from "react";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";
import { getSystemConfig } from "./romLibraryConfig";
import { listUploadedRoms, saveUploadedRom } from "./romStorage";

const getInitials = (title = "") =>
  title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const buildUploadedRomEntry = (record, badgeLabel) => {
  const baseName = String(record?.fileName || "Uploaded ROM").replace(/\.[^.]+$/, "") || "Uploaded ROM";

  return {
    id: `uploaded-${record?.id || baseName}`,
    title: baseName,
    file: record?.fileName || "Uploaded ROM",
    system: badgeLabel,
    source: "uploaded",
    storageId: record?.id,
    uploadedAt: record?.uploadedAt,
    blob: record?.blob,
    mimeType: record?.mimeType,
    size: record?.size,
    lastModified: record?.lastModified,
  };
};

const LibraryState = ({ title, message, notes = [], action }) => (
  <div className="rom-library-state">
    <div className="rom-library-dialog">
      <h3>{title}</h3>
      <div className="panel-body">
        <div className="win95-panel-icon">!</div>
        <div className="win95-panel-copy">
          <p>{message}</p>
          {notes.length ? (
            <div className="rom-library-notices rom-library-notices-inline">
              {notes.map((note) => (
                <p key={note} className="rom-library-notice">
                  {note}
                </p>
              ))}
            </div>
          ) : null}
          {action ? <div className="iframe-error-actions">{action}</div> : null}
        </div>
      </div>
    </div>
  </div>
);

const RomLibrary = ({ system, onSelectRom }) => {
  const uploadInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [roms, setRoms] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const systemConfig = useMemo(() => getSystemConfig(system), [system]);
  const systemLabel = systemConfig.label;
  const badgeLabel = systemConfig.badge;
  const noticeLines = useMemo(
    () =>
      [systemConfig.legalNotice, systemConfig.uploadNotice, systemConfig.extraNotice].filter(Boolean),
    [systemConfig.extraNotice, systemConfig.legalNotice, systemConfig.uploadNotice],
  );

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    const loadLibrary = async () => {
      setIsLoading(true);
      setError("");
      setRoms([]);

      try {
        const bundledPromise = (async () => {
          const response = await fetch(resolvePublicUrl(`roms/${system}/manifest.json`), {
            cache: "no-store",
            signal: controller.signal,
          });

          if (!response.ok) {
            if (response.status === 404) {
              return [];
            }

            throw new Error(`Failed to load ROM manifest (${response.status}).`);
          }

          const payload = await response.json();
          return Array.isArray(payload?.roms) ? payload.roms : [];
        })();

        const [bundledRoms, uploadedRoms] = await Promise.all([
          bundledPromise,
          systemConfig.supportsUpload ? listUploadedRoms(system) : Promise.resolve([]),
        ]);

        if (isCancelled) return;

        const mergedRoms = [
          ...bundledRoms.map((rom) => ({ ...rom, source: "bundled", system: badgeLabel })),
          ...uploadedRoms.map((record) => buildUploadedRomEntry(record, badgeLabel)),
        ];

        setRoms(mergedRoms);
      } catch (loadError) {
        if (loadError?.name === "AbortError") return;
        if (!isCancelled) {
          setError(loadError?.message || "Failed to load ROM library.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadLibrary();
    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [badgeLabel, system]);

  const launchUploadPicker = () => {
    uploadInputRef.current?.click();
  };

  const handleUpload = async (event) => {
    if (!systemConfig.supportsUpload) {
      event.target.value = "";
      return;
    }

    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    setIsUploading(true);
    setUploadError("");

    try {
      await Promise.all(files.map((file) => saveUploadedRom(system, file)));
      const uploadedRoms = await listUploadedRoms(system);

      setRoms((currentRoms) => {
        const bundledRoms = currentRoms.filter((rom) => rom?.source !== "uploaded");
        const mergedUploads = uploadedRoms.map((record) => buildUploadedRomEntry(record, badgeLabel));
        return [...bundledRoms, ...mergedUploads];
      });
    } catch (uploadStorageError) {
      setUploadError(uploadStorageError?.message || "Failed to store the selected ROM upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectRom = (rom) => {
    if (rom?.source === "uploaded" && rom?.blob instanceof Blob) {
      onSelectRom({
        ...rom,
        objectUrl: URL.createObjectURL(rom.blob),
      });
      return;
    }

    onSelectRom(rom);
  };

  if (isLoading) {
    return (
      <LibraryState
        title={`${systemLabel} Library`}
        message={
          systemConfig.supportsUpload
            ? `Scanning bundled and uploaded ${systemLabel} games...`
            : `Scanning bundled ${systemLabel} manifest entries...`
        }
        notes={noticeLines}
        action={
          systemConfig.supportsUpload ? (
            <button type="button" className="rom-library-empty-button" onClick={launchUploadPicker}>
              Upload ROM
            </button>
          ) : null
        }
      />
    );
  }

  if (error) {
    return (
      <LibraryState
        title="Unable to Load Library"
        message={error}
        notes={noticeLines}
        action={
          <>
            {systemConfig.supportsUpload ? (
              <button type="button" className="rom-library-empty-button" onClick={launchUploadPicker}>
                Upload ROM
              </button>
            ) : null}
            <button type="button" className="rom-library-empty-button" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </>
        }
      />
    );
  }

  if (!roms.length) {
    return (
      <LibraryState
        title="No ROMs Found"
        message={systemConfig.emptyStateText}
        notes={[...noticeLines, systemConfig.uploadHelpText].filter(Boolean)}
        action={
          <>
            {systemConfig.supportsUpload ? (
              <button type="button" className="rom-library-empty-button" onClick={launchUploadPicker}>
                Upload ROM
              </button>
            ) : null}
            <button type="button" className="rom-library-empty-button" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </>
        }
      />
    );
  }

  return (
    <div className="rom-library-shell">
      <input
        ref={uploadInputRef}
        className="rom-library-upload-input"
        type="file"
        accept={systemConfig.uploadAccept}
        multiple
        onChange={handleUpload}
      />

      <div className="rom-library-toolbar">
        <strong>{systemLabel} Library</strong>
        <div className="rom-library-actions">
          <span>{roms.length} file(s)</span>
          {systemConfig.supportsUpload ? (
            <button type="button" className="rom-library-empty-button" onClick={launchUploadPicker}>
              {isUploading ? "Uploading..." : "Upload ROM"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="rom-library-browser">
        <aside className="rom-library-sidebar">
          <span className="system-badge">{badgeLabel}</span>
          <h4>Open a game</h4>
          <p>Select a file from the list to launch it immediately in the emulator.</p>
          <h4>Library source</h4>
          <p>{systemConfig.supportsUpload ? `/public/roms/${system}/` : `/public/roms/${system}/manifest.json`}</p>
          <h4>Library notes</h4>
          <div className="rom-library-notices">
            {noticeLines.map((note) => (
              <p key={note} className="rom-library-notice">
                {note}
              </p>
            ))}
            <p className="rom-library-notice">{systemConfig.uploadHelpText}</p>
            {uploadError ? <p className="rom-library-notice rom-library-notice-error">{uploadError}</p> : null}
          </div>
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
                  onClick={() => handleSelectRom(rom)}
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
                      <span className="rom-library-subtitle">
                        {rom?.source === "uploaded" ? "Uploaded from this browser" : "Click to launch"}
                      </span>
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
