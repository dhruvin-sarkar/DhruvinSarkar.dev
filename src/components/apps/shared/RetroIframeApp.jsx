import React, { useContext, useEffect, useMemo } from "react";
import UseContext from "../../../Context";
import AppWindowShell from "./AppWindowShell";
import EmulatorLoadingScreen from "./EmulatorLoadingScreen";
import useEmulatorWindow from "./useEmulatorWindow";
import "../../../css/RetroEmulatorWindow.css";

const RetroIframeApp = ({
  title,
  stateKey,
  setterKey,
  windowName,
  icon,
  iframeSrc,
  externalUrl,
  defaultWidth,
  defaultHeight,
  defaultPosition,
  loadingVariant,
  loadingSubtitle,
  iframeAllow = "autoplay; fullscreen; gamepad",
  iframeLoading = "lazy",
  perfWarning,
  appNotice,
  awaitRuntimeSignal = false,
}) => {
  const context = useContext(UseContext);
  const state = context[stateKey];
  const setState = context[setterKey];

  const isWarningActive = false;

  const {
    iframeUrl,
    isLoading,
    hasError,
    resolvedExternalUrl,
    handleLoad,
    handleError,
    reload,
    errorMessage,
    runtimeTitle,
  } = useEmulatorWindow({
    iframeSrc,
    externalUrl,
    isEnabled: !isWarningActive,
    awaitRuntimeSignal,
  });

  useEffect(() => {
    if (state?.show && state?.hide) {
      setState((previous) => ({ ...previous, hide: false }));
    }
  }, [state?.show, state?.hide, setState]);

  const openExternally = () => {
    if (!resolvedExternalUrl) return;
    window.open(resolvedExternalUrl, "_blank", "noopener,noreferrer");
  };

  const errorDescription = useMemo(() => {
    return errorMessage || `The embedded page for ${title} did not finish loading in this window.`;
  }, [errorMessage, title]);

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
      <div className="retro-embed-shell">
        {appNotice ? <div className="retro-emulator-note">{appNotice}</div> : null}

        <div className="retro-embed-frame">
          {isLoading ? (
            <EmulatorLoadingScreen
              title={title}
              subtitle={loadingSubtitle}
              variant={loadingVariant}
            />
          ) : null}

          <iframe
            title={title}
            src={iframeUrl}
            className="retro-emulator-iframe"
            onLoad={handleLoad}
            onError={handleError}
            allow={iframeAllow}
            loading={iframeLoading}
          />

          {hasError ? (
            <div className="iframe-error-overlay">
              <div className="iframe-error-panel">
                <h3>{runtimeTitle || title}</h3>
                <div className="panel-body">
                  <div className="win95-panel-icon">!</div>
                  <div className="win95-panel-copy">
                    <p>{errorDescription}</p>
                    <div className="iframe-error-actions">
                      <button type="button" onClick={reload}>
                        Retry
                      </button>
                      <button type="button" onClick={openExternally}>
                        Open Externally
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </AppWindowShell>
  );
};

export default RetroIframeApp;
