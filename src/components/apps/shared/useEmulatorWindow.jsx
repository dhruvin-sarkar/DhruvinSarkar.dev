import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const RETRO_APP_MESSAGE_SOURCE = "retro-app";

const createInstanceSeed = () =>
  `retro-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const SAFETY_TIMEOUT_MS = 20000; // 20 seconds fallback to dismiss loading overlay

const useEmulatorWindow = ({
  iframeSrc,
  externalUrl,
  isEnabled = true,
  awaitRuntimeSignal = false,
}) => {
  const instanceSeedRef = useRef(createInstanceSeed());
  const [src, setSrc] = useState(isEnabled ? iframeSrc : "about:blank");
  const [isLoading, setIsLoading] = useState(isEnabled);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [runtimeTitle, setRuntimeTitle] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const appInstance = useMemo(
    () => `${instanceSeedRef.current}-${reloadToken}`,
    [reloadToken],
  );

  useEffect(() => {
    if (!isEnabled) {
      setSrc("about:blank");
      setIsLoading(false);
      setHasError(false);
      setErrorMessage("");
      setRuntimeTitle("");
      return;
    }

    setSrc(iframeSrc);
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");
    setRuntimeTitle("");

    // Safety fallback: dismiss loading even if signal never arrives
    const timer = setTimeout(() => {
      setIsLoading((currentlyLoading) => {
        if (currentlyLoading) {
          console.warn(`[RetroApp] Safety timeout reached for ${appInstance}. Forcing loading=false.`);
        }
        return false;
      });
    }, SAFETY_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [iframeSrc, isEnabled, appInstance]);

  useEffect(() => {
    const handleMessage = (event) => {
      const payload = event?.data;
      if (!payload || typeof payload !== "object") return;
      if (payload.source !== RETRO_APP_MESSAGE_SOURCE) return;

      if (process.env.NODE_ENV === "development") {
        console.log(`[RetroApp] Signal received:`, payload.type, payload.appInstance, payload);
      }

      if (payload.appInstance !== appInstance) {
        // Log mismatch but don't process unless it's a global notification (if any exist)
        if (process.env.NODE_ENV === "development") {
          console.debug(`[RetroApp] appInstance mismatch. Expected: ${appInstance}, Got: ${payload.appInstance}`);
        }
        return;
      }

      if (typeof payload.title === "string" && payload.title.trim()) {
        setRuntimeTitle(payload.title.trim());
      }

      switch (payload.type) {
        case "retro-app:loading":
          setIsLoading(true);
          setHasError(false);
          setErrorMessage("");
          break;
        case "retro-app:ready":
          setIsLoading(false);
          setHasError(false);
          setErrorMessage("");
          break;
        case "retro-app:error":
          setHasError(true);
          setIsLoading(false);
          setErrorMessage(
            payload.message || payload.error || "The embedded runtime reported an error.",
          );
          break;
        case "retro-app:title":
          break;
        default:
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [appInstance]);

  const handleLoad = useCallback(() => {
    if (awaitRuntimeSignal) return;
    setIsLoading(false);
    setHasError(false);
    setErrorMessage("");
  }, [awaitRuntimeSignal]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    setErrorMessage("The embedded page failed to load.");
  }, []);

  const reload = useCallback(() => {
    if (!isEnabled) return;
    setReloadToken((previous) => previous + 1);
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");
    setRuntimeTitle("");
  }, [isEnabled]);

  const iframeUrl = useMemo(() => {
    if (!src) return "";
    if (src === "about:blank") return "about:blank";

    try {
      const url = new URL(src, window.location.href);
      url.searchParams.set("rt", String(reloadToken));
      url.searchParams.set("retroAppInstance", appInstance);
      return url.toString();
    } catch {
      const separator = src.includes("?") ? "&" : "?";
      return `${src}${separator}rt=${reloadToken}&retroAppInstance=${encodeURIComponent(appInstance)}`;
    }
  }, [appInstance, reloadToken, src]);

  const resolvedExternalUrl = externalUrl || iframeSrc;

  return {
    appInstance,
    iframeUrl,
    isLoading,
    hasError,
    errorMessage,
    runtimeTitle,
    resolvedExternalUrl,
    setSrc,
    handleLoad,
    handleError,
    reload,
  };
};

export default useEmulatorWindow;
