import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
  const iframeRef = useRef(null);
  const [showManualDismiss, setShowManualDismiss] = useState(false);


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

  // Handle focus when loading finishes
  useEffect(() => {
    if (!isLoading && !hasError && state?.show && !state?.hide) {
      const timer = setTimeout(() => {
        iframeRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isLoading, hasError, state?.show, state?.hide]);

  // Show manual dismiss button after a delay
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowManualDismiss(true);
      }, 6000); // 6 seconds before showing manual dismiss
      return () => clearTimeout(timer);
    }
    setShowManualDismiss(false);
    return undefined;
  }, [isLoading]);

  const forceDismissLoading = () => {
    // We can't reach into the hook's internal state directly with a simple setter, 
    // but the hook returns handleLoad which we can call manually to simulate "ready"
    handleLoad();
  };


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
              onDismiss={showManualDismiss ? forceDismissLoading : undefined}
            />
          ) : null}

          <iframe
            ref={iframeRef}
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
