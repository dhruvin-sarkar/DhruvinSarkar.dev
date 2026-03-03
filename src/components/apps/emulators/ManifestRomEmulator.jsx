import React, { useContext, useEffect, useMemo, useState } from "react";
import UseContext from "../../../Context";
import AppWindowShell from "../shared/AppWindowShell";
import EmulatorLoadingScreen from "../shared/EmulatorLoadingScreen";
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
  const [isLoadingGame, setIsLoadingGame] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!state?.show) {
      setSelectedRom(null);
      setIsLoadingGame(false);
      setHasError(false);
    }
  }, [state?.show]);

  const iframeUrl = useMemo(() => {
    if (!selectedRom?.file) return "";
    const romUrl = resolvePublicUrl(`roms/${system}/${selectedRom.file}`);
    const loaderPath = resolvePublicUrl("emulators/ejs-loader.html");
    const query = new URLSearchParams({
      core,
      rom: romUrl,
    });
    return `${loaderPath}?${query.toString()}`;
  }, [core, selectedRom?.file, system]);

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
          system={system}
          onSelectRom={(rom) => {
            setHasError(false);
            setIsLoadingGame(true);
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
                setHasError(false);
                setIsLoadingGame(false);
              }}
            >
              Back
            </button>
            <span className="rom-player-label">{selectedRom.title || selectedRom.file}</span>
            <span className="rom-player-meta">{selectedRom.file}</span>
          </div>

          <div className="rom-player-frame">
            {isLoadingGame ? (
              <EmulatorLoadingScreen
                title={title}
                subtitle={`Launching ${selectedRom.title || selectedRom.file}...`}
                variant="default"
              />
            ) : null}

            <iframe
              title={`${title} Player`}
              src={iframeUrl}
              className="retro-emulator-iframe"
              onLoad={() => {
                setIsLoadingGame(false);
                setHasError(false);
              }}
              onError={() => {
                setIsLoadingGame(false);
                setHasError(true);
              }}
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
                      <p>Unable to load {selectedRom.title || selectedRom.file}.</p>
                      <div className="iframe-error-actions">
                        <button
                          type="button"
                          onClick={() => {
                            setHasError(false);
                            setIsLoadingGame(true);
                            setSelectedRom({ ...selectedRom });
                          }}
                        >
                          Retry
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRom(null);
                            setHasError(false);
                            setIsLoadingGame(false);
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
