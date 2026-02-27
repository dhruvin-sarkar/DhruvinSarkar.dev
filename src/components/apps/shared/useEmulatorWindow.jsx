import React, { useCallback, useEffect, useMemo, useState } from 'react';

const useEmulatorWindow = ({
  iframeSrc,
  externalUrl,
  isEnabled = true,
}) => {
  const [src, setSrc] = useState(isEnabled ? iframeSrc : "about:blank");
  const [isLoading, setIsLoading] = useState(isEnabled);
  const [hasError, setHasError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!isEnabled) {
      setSrc("about:blank");
      setIsLoading(false);
      setHasError(false);
      return;
    }

    setSrc(iframeSrc);
    setIsLoading(true);
    setHasError(false);
  }, [iframeSrc, isEnabled]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const reload = useCallback(() => {
    if (!isEnabled) return;
    setReloadToken((previous) => previous + 1);
    setIsLoading(true);
    setHasError(false);
  }, [isEnabled]);

  const iframeUrl = useMemo(() => {
    if (!src) return "";
    if (src === "about:blank") return "about:blank";

    try {
      const url = new URL(src, window.location.href);
      url.searchParams.set("rt", String(reloadToken));
      return url.toString();
    } catch {
      const separator = src.includes("?") ? "&" : "?";
      return `${src}${separator}rt=${reloadToken}`;
    }
  }, [reloadToken, src]);

  const resolvedExternalUrl = externalUrl || iframeSrc;

  return {
    iframeUrl,
    isLoading,
    hasError,
    resolvedExternalUrl,
    setSrc,
    handleLoad,
    handleError,
    reload,
  };
};

export default useEmulatorWindow;
