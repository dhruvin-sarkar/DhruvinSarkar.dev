import React, { useContext, useEffect, useMemo, useState } from "react";
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
  iframeAllow = "autoplay; fullscreen; gamepad; pointer-lock",
  iframeLoading = "lazy",
  iframeAllowFullScreen = true,
  perfWarning,
  appNotice,
}) => {
  const context = useContext(UseContext);
  const state = context[stateKey];
  const setState = context[setterKey];

  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [warningDismissed, setWarningDismissed] = useState(false);

  const warningKey = perfWarning?.storageKey;
  const warningAccepted = useMemo(() => {
    if (!warningKey || typeof window === "undefined") return true;
    return window.localStorage.getItem(warningKey) === "1";
  }, [warningKey]);

  const isWarningActive = Boolean(
    perfWarning && !warningAccepted && !warningDismissed,
  );
  const shouldShowWarning = Boolean(state?.show && isWarningActive);

  const {
    iframeUrl,
    isLoading,
    hasError,
    resolvedExternalUrl,
    handleLoad,
    handleError,
    reload,
  } = useEmulatorWindow({
    iframeSrc,
    externalUrl,
    isEnabled: !isWarningActive,
  });

  useEffect(() => {
    if (!state?.show) {
      setWarningDismissed(false);
      setDontShowAgain(false);
    }
  }, [state?.show]);

  useEffect(() => {
    if (state?.show && state?.hide) {
      setState((previous) => ({ ...previous, hide: false }));
    }
  }, [state?.show, state?.hide, setState]);

  const warningTitle = perfWarning?.title || "Performance Notice";
  const warningText =
    perfWarning?.message ||
    "This app may use high CPU/GPU resources. Continue if your device can handle it.";

  const openExternally = () => {
    if (!resolvedExternalUrl) return;
    window.open(resolvedExternalUrl, "_blank", "noopener,noreferrer");
  };

  const errorDescription = useMemo(() => {
    return `The embedded page for ${title} failed to load. Retry, or open externally.`;
  }, [title]);

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
      {appNotice ? (
        <div className="retro-emulator-note">{appNotice}</div>
      ) : null}

      {shouldShowWarning ? (
        <div className="retro-performance-overlay">
          <div className="retro-performance-card">
            <h3>{warningTitle}</h3>
            <p>{warningText}</p>
            <div className="retro-performance-row">
              <label>
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(event) => setDontShowAgain(event.target.checked)}
                />
                Don&apos;t show again
              </label>
              <div className="iframe-error-actions">
                <button
                  type="button"
                  onClick={() => {
                    setState((previous) => ({
                      ...previous,
                      show: false,
                      hide: false,
                    }));
                  }}
                >
                  Cancel
                </button>
                <button type="button" onClick={openExternally}>
                  Open Externally
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWarningDismissed(true);
                    if (warningKey && dontShowAgain) {
                      window.localStorage.setItem(warningKey, "1");
                    }
                    setState((previous) => ({
                      ...previous,
                      show: true,
                    }));
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
        allowFullScreen={iframeAllowFullScreen}
      />

      {hasError ? (
        <div className="iframe-error-overlay">
          <div className="iframe-error-panel">
            <h3>Unable to load {title}</h3>
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
      ) : null}
    </AppWindowShell>
  );
};

export default RetroIframeApp;
