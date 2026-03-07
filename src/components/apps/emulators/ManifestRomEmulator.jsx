import React, { useContext, useEffect, useMemo, useState } from "react";
import UseContext from "../../../Context";
import AppWindowShell from "../shared/AppWindowShell";
import EmulatorLoadingScreen from "../shared/EmulatorLoadingScreen";
import useEmulatorWindow from "../shared/useEmulatorWindow";
import RomLibrary from "./RomLibrary";
import { getSystemConfig } from "./romLibraryConfig";
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
  launchSupport = "supported",
  unavailableTitle = "Emulator unavailable",
  unavailableMessage = "This emulator is not available in the current build.",
}) => {
  const context = useContext(UseContext);
  const state = context[stateKey];
  const setState = context[setterKey];
  const systemConfig = useMemo(() => getSystemConfig(system), [system]);
  const [selectedRom, setSelectedRom] = useState(null);
  const [libraryRefreshKey, setLibraryRefreshKey] = useState(0);

  const resolvedLaunchSupport = systemConfig.launchSupport || launchSupport;
  const resolvedUnavailableTitle = systemConfig.unavailableTitle || unavailableTitle;
  const resolvedUnavailableMessage = systemConfig.unavailableMessage || unavailableMessage;
  const configuredBiosUrl = systemConfig.biosUrl || "";

  useEffect(() => {
    if (!state?.show) {
      setSelectedRom(null);
      setLibraryRefreshKey(0);
    }
  }, [state?.show]);

  useEffect(() => {
    return () => {
      if (selectedRom?.source === "uploaded" && selectedRom?.objectUrl) {
        URL.revokeObjectURL(selectedRom.objectUrl);
      }
    };
  }, [selectedRom]);

  const iframeSrc = useMemo(() => {
    if (!selectedRom?.file || resolvedLaunchSupport === "unavailable") return "";
    const romUrl =
      selectedRom?.source === "uploaded" && selectedRom?.objectUrl
        ? selectedRom.objectUrl
        : /^https?:\/\//i.test(selectedRom.file)
          ? selectedRom.file
          : new URL(resolvePublicUrl(`roms/${system}/${selectedRom.file}`), window.location.origin).toString();
    const biosUrl = selectedRom?.bios || configuredBiosUrl;
    const loaderPath = resolvePublicUrl("emulators/ejs-loader.html");
    const query = new URLSearchParams({
      core,
      rom: romUrl,
      title: selectedRom.title || selectedRom.file,
      system,
    });
    if (biosUrl) {
      query.set("bios", biosUrl);
    }
    return `${loaderPath}?${query.toString()}`;
  }, [
    configuredBiosUrl,
    core,
    resolvedLaunchSupport,
    selectedRom?.bios,
    selectedRom?.file,
    selectedRom?.objectUrl,
    selectedRom?.source,
    selectedRom?.title,
    system,
  ]);

  const isLaunchUnavailable = Boolean(selectedRom?.file) && resolvedLaunchSupport === "unavailable";

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

          </div>

          <div className="rom-player-frame">
            {isLaunchUnavailable ? (
              <div className="iframe-error-overlay">
                <div className="iframe-error-panel">
                  <h3>{resolvedUnavailableTitle}</h3>
                  <div className="panel-body">
                    <div className="win95-panel-icon">!</div>
                    <div className="win95-panel-copy">
                      <p>{resolvedUnavailableMessage}</p>
                      <div className="iframe-error-actions">
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

            {!isLaunchUnavailable && isLoading ? (
              <EmulatorLoadingScreen
                title={title}
                subtitle={`Launching ${runtimeTitle || selectedRom.title || selectedRom.file}...`}
                variant="default"
              />
            ) : null}

            {!isLaunchUnavailable ? (
              <iframe
                title={`${title} Player`}
                src={iframeUrl}
                className="retro-emulator-iframe"
                onLoad={handleLoad}
                onError={handleError}
                allow="autoplay; fullscreen; gamepad"
                loading="eager"
              />
            ) : null}

            {!isLaunchUnavailable && hasError ? (
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
