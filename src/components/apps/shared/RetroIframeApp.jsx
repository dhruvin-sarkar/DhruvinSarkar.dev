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
  iframeAllow = "autoplay; fullscreen; gamepad; pointer-lock",
  iframeLoading = "lazy",
  iframeAllowFullScreen = true,
  perfWarning,
  appNotice,
}) => {
  const context = useContext(UseContext);
  const state = context[stateKey];
  const setState = context[setterKey];

  // Performance warnings are disabled globally.  The original
  // implementation prompted users before launching CPU‑/memory‑heavy iframe
  // apps; we suppress that overlay entirely so nothing ever appears.
  // Any props passed via `perfWarning` are now ignored.
  const warningKey = perfWarning?.storageKey;
  const warningAccepted = true; // always pretend the user accepted the warning

  const isWarningActive = false; // never show warning
  const shouldShowWarning = false; // shortcut

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
    if (state?.show && state?.hide) {
      setState((previous) => ({ ...previous, hide: false }));
    }
  }, [state?.show, state?.hide, setState]);


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
