import React, { useContext, useEffect, useMemo, useState } from "react";
import UseContext from "../../../Context";
import AppWindowShell from "../shared/AppWindowShell";
import EmulatorLoadingScreen from "../shared/EmulatorLoadingScreen";
import useEmulatorWindow from "../shared/useEmulatorWindow";
import RomLibrary from "./RomLibrary";
import { resolvePublicUrl } from "../shared/resolvePublicUrl";

const ManifestRomEmulator = ({
  title,
  icon,
  system,
  core,
  stateKey,
  setterKey,
  windowName,
  defaultWidth,
  defaultHeight,
  defaultPosition,
}) => {
  const context = useContext(UseContext);
  const state = context[stateKey];
  const setState = context[setterKey];
  const [selectedRom, setSelectedRom] = useState(null);
  const [libraryRefreshKey, setLibraryRefreshKey] = useState(0);

  useEffect(() => {
    if (!state?.show) {
      setSelectedRom(null);
      setLibraryRefreshKey(0);
    }
  }, [state?.show]);

  const iframeSrc = useMemo(() => {
    if (!selectedRom?.file) return "";
    const romUrl = resolvePublicUrl(`roms/${system}/${selectedRom.file}`);
    const loaderPath = resolvePublicUrl("emulators/ejs-loader.html");
    const query = new URLSearchParams({
      core,
      rom: romUrl,
      title: selectedRom.title || selectedRom.file,
      system,
    });
    return `${loaderPath}?${query.toString()}`;
  }, [core, selectedRom?.file, selectedRom?.title, system]);

  const {
    iframeUrl,
    isLoading,
    hasError,
    errorMessage,
    runtimeTitle,
    handleLoad,
    handleError,
    reload,
  } = useEmulatorWindow({
    iframeSrc,
    isEnabled: Boolean(selectedRom?.file),
    awaitRuntimeSignal: true,
  });

  if (!state || !setState) return null;

  return (
    <AppWindowShell
      title={title}
      icon={icon}
      state={state}
      setState={setState}
      stateName={windowName || stateKey}
      defaultWidth={defaultWidth}
      defaultHeight={defaultHeight}
      defaultPosition={defaultPosition}
      className="retro-emulator-window"
    >
      {!selectedRom ? (
        <RomLibrary
          key={libraryRefreshKey}
          system={system}
          onSelectRom={(rom) => {
            setLibraryRefreshKey((value) => value + 1);
            setSelectedRom(rom);
          }}
        />
      ) : (
        <div className="rom-player-shell">
          <div className="rom-player-bar">
            <button
              type="button"
              onClick={() => {
                setSelectedRom(null);
              }}
            >
              Back
            </button>
            <span className="rom-player-label">{runtimeTitle || selectedRom.title || selectedRom.file}</span>
            <span className="rom-player-meta">{selectedRom.file}</span>
          </div>

          <div className="rom-player-frame">
            {isLoading ? (
              <EmulatorLoadingScreen
                title={title}
                subtitle={`Launching ${runtimeTitle || selectedRom.title || selectedRom.file}...`}
                variant="default"
              />
            ) : null}

            <iframe
              title={`${title} Player`}
              src={iframeUrl}
              className="retro-emulator-iframe"
              onLoad={handleLoad}
              onError={handleError}
              allow="autoplay; fullscreen; gamepad; pointer-lock"
              loading="eager"
              allowFullScreen
            />

            {hasError ? (
              <div className="iframe-error-overlay">
                <div className="iframe-error-panel">
                  <h3>{title}</h3>
                  <div className="panel-body">
                    <div className="win95-panel-icon">!</div>
                    <div className="win95-panel-copy">
                      <p>{errorMessage || `Unable to load ${selectedRom.title || selectedRom.file}.`}</p>
                      <div className="iframe-error-actions">
                        <button
                          type="button"
                          onClick={() => {
                            reload();
                          }}
                        >
                          Retry
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRom(null);
                          }}
                        >
                          Library
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AppWindowShell>
  );
};

export default ManifestRomEmulator;
