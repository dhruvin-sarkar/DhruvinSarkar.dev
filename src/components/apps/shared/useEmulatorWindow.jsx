import { useCallback, useEffect, useMemo, useState } from "react";

const LOAD_TIMEOUT_MS = 10000;

const useEmulatorWindow = ({
  iframeSrc,
  externalUrl,
  loadTimeoutMs = LOAD_TIMEOUT_MS,
}) => {
  const [src, setSrc] = useState(iframeSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    setSrc(iframeSrc);
    setIsLoading(true);
    setHasError(false);
    setTimedOut(false);
  }, [iframeSrc]);

  useEffect(() => {
    if (!isLoading) return undefined;

    const timer = window.setTimeout(() => {
      setTimedOut(true);
      setHasError(true);
      setIsLoading(false);
    }, loadTimeoutMs);

    return () => window.clearTimeout(timer);
  }, [isLoading, loadTimeoutMs, src, reloadToken]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    setTimedOut(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const reload = useCallback(() => {
    setReloadToken((previous) => previous + 1);
    setIsLoading(true);
    setHasError(false);
    setTimedOut(false);
  }, []);

  const iframeUrl = useMemo(() => {
    if (!src) return "";

    try {
      const url = new URL(src, window.location.href);
      url.searchParams.set("rt", String(reloadToken));
      return url.toString();
    } catch {
      const separator = src.includes("?") ? "&" : "?";
      return `${src}${separator}rt=${reloadToken}`;
    }
  }, [reloadToken, src]);

  const resolvedExternalUrl = externalUrl || src;

  return {
    iframeUrl,
    isLoading,
    hasError,
    timedOut,
    resolvedExternalUrl,
    setSrc,
    handleLoad,
    handleError,
    reload,
  };
};

export default useEmulatorWindow;
