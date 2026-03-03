import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Draggable from '../../system/WindowDraggable';
import UseContext from "../../../Context";
import ieIcon from "../../../assets/ie.png";

const STORAGE_KEYS = {
  tabs: "ie-tabs",
  activeTab: "ie-active-tab",
  history: "ie-history",
  bookmarks: "ie-bookmarks",
  bookmarksBar: "ie-bookmarks-bar",
};

const GOOGLE_HOME = "https://www.google.com/webhp?igu=1";
const GOOGLE_SEARCH = "https://www.google.com/search?igu=1&q=";
const GOOGLE_DISPLAY = "https://www.google.com";
const MAX_GLOBAL_HISTORY = 100;
const MAX_TAB_TITLE = 20;

const FRIENDLY_HOST_ALLOWLIST = [
  "google.com",
  "wikipedia.org",
  "github.io",
  "itch.io",
  "codepen.io",
  "stackblitz.com",
  "pages.github.com",
  "developer.mozilla.org",
  "w3schools.com",
  "yewtu.be",
  "piped.video",
];

const DEFAULT_PROFILE_BOOKMARKS = [
  { title: "YouTube", url: "https://www.youtube.com/@dhruvinsarkar5501" },
  { title: "Instagram", url: "https://www.instagram.com/dhrv.5kr_/" },
  { title: "ORCID", url: "https://orcid.org/0009-0009-0676-1891" },
  { title: "LinkedIn", url: "https://www.linkedin.com/in/dhruvin-sarkar/" },
  { title: "ComicK", url: "https://comick.dev/user/04c26b83-8bed-40db-a2e3-fcaff5a66d18" },
  { title: "Discord", url: "https://discord.com/users/860006729688154113" },
  { title: "Itch.io", url: "https://lifelessloser.itch.io/" },
  { title: "Email", url: "mailto:dhruvinsarkar@outlook.com" },
  { title: "Steam", url: "https://steamcommunity.com/profiles/76561199346425587/" },
  { title: "GitHub", url: "https://github.com/dhruvin-sarkar" },
  {
    title: "Portfolio",
    url: "https://dhruvin-sarkar.github.io/Win95P-DevPortfolio",
  },
  { title: "E-Commerce (Soon)", url: "https://comingsoon.com" },
  { title: "Project 2 (Soon)", url: "https://comingsoon.com" },
  { title: "Project 3 (Soon)", url: "https://comingsoon.com" },
];

let tabCounter = 0;

const safeParseJson = (value, fallback) => {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const isNavigableUrl = (url) => Boolean(url);

const truncateText = (value, limit = MAX_TAB_TITLE) => {
  if (!value) return "New Tab";
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 3)}...`;
};

const createTabId = () => {
  tabCounter += 1;
  return `ie-tab-${Date.now()}-${tabCounter}-${Math.random().toString(36).slice(2, 8)}`;
};

const getHostFromUrl = (url) => {
  if (!isNavigableUrl(url)) return "";
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

const getDisplayUrlFromUrl = (url) => {
  if (!isNavigableUrl(url)) return "";
  if (url.includes("google.com/webhp?igu=1")) return GOOGLE_DISPLAY;
  return url;
};

const getFaviconUrl = (url) => {
  const host = getHostFromUrl(url);
  if (!host) return ieIcon;
  // Google s2 is a stable way to fetch small favicons from hostnames.
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=16`;
};

const mergeBookmarksWithDefaults = (storedBookmarks) => {
  const defaults = DEFAULT_PROFILE_BOOKMARKS.map((bookmark) => ({
    ...bookmark,
    favicon: bookmark.favicon || getFaviconUrl(bookmark.url),
  }));

  if (!Array.isArray(storedBookmarks) || storedBookmarks.length === 0) {
    return defaults;
  }

  const merged = [...defaults];
  const seen = new Set(defaults.map((bookmark) => bookmark.url));

  storedBookmarks.forEach((bookmark) => {
    if (!bookmark?.url || seen.has(bookmark.url)) return;
    seen.add(bookmark.url);
    merged.push({
      ...bookmark,
      favicon: bookmark.favicon || getFaviconUrl(bookmark.url),
    });
  });

  return merged;
};

const deriveTitleFromUrl = (url, displayUrl) => {
  if (!isNavigableUrl(url)) return "New Tab";
  const host = getHostFromUrl(url);
  if (!host) return truncateText(displayUrl || url);
  return truncateText(host.replace(/^www\./i, ""));
};

const hostMatches = (host, target) =>
  host === target || host.endsWith(`.${target}`);

const isGoogleLikeInput = (value) => {
  const cleaned = value
    .trim()
    .replace(/^https?:\/\//i, "")
    .split("/")[0]
    .split("?")[0]
    .toLowerCase();
  return hostMatches(cleaned, "google.com");
};

const looksLikeDomain = (value) => {
  if (!value || /\s/.test(value)) return false;
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+([/:?#].*)?$/i.test(value);
};

const isFriendlyHost = (url) => {
  const host = getHostFromUrl(url).toLowerCase();
  if (!host) return false;
  return FRIENDLY_HOST_ALLOWLIST.some((allowed) => hostMatches(host, allowed));
};

const normalizeOmniboxInput = (rawInput) => {
  const value = `${rawInput ?? ""}`.trim();
  if (!value) return null;

  // Google must always remap to /webhp?igu=1 so it can load in an iframe.
  if (isGoogleLikeInput(value)) {
    return {
      url: GOOGLE_HOME,
      displayUrl: GOOGLE_DISPLAY,
    };
  }

  let candidate = value;
  const hasProtocol = /^https?:\/\//i.test(candidate);

  if (!hasProtocol) {
    if (looksLikeDomain(candidate)) {
      candidate = `https://${candidate}`;
    } else {
      const searchUrl = `${GOOGLE_SEARCH}${encodeURIComponent(value)}`;
      return { url: searchUrl, displayUrl: searchUrl };
    }
  }

  try {
    const parsed = new URL(encodeURI(candidate));
    if (hostMatches(parsed.hostname.toLowerCase(), "google.com")) {
      return {
        url: GOOGLE_HOME,
        displayUrl: GOOGLE_DISPLAY,
      };
    }
    const finalUrl = parsed.toString();
    return { url: finalUrl, displayUrl: finalUrl };
  } catch {
    const searchUrl = `${GOOGLE_SEARCH}${encodeURIComponent(value)}`;
    return { url: searchUrl, displayUrl: searchUrl };
  }
};

const makeTab = (partial = {}) => {
  const rawUrl = partial.url ?? GOOGLE_HOME;
  const nextUrl = !rawUrl || rawUrl === "newtab" ? GOOGLE_HOME : rawUrl;
  const displayUrl = partial.displayUrl ?? getDisplayUrlFromUrl(nextUrl);
  const history =
    Array.isArray(partial.history) && partial.history.length > 0
      ? partial.history.filter((entry) => typeof entry === "string" && entry.trim())
      : isNavigableUrl(nextUrl)
        ? [nextUrl]
        : [];

  let historyIndex =
    Number.isInteger(partial.historyIndex) && partial.historyIndex >= -1
      ? partial.historyIndex
      : history.length - 1;
  historyIndex = Math.min(history.length - 1, historyIndex);

  if (!history.length) {
    historyIndex = -1;
  }

  return {
    id: partial.id || createTabId(),
    url: nextUrl,
    displayUrl,
    title: partial.title || deriveTitleFromUrl(nextUrl, displayUrl),
    favicon: partial.favicon || getFaviconUrl(nextUrl),
    isLoading: Boolean(partial.isLoading),
    history,
    historyIndex,
    blocked: partial.blocked || null,
    inputValue: partial.inputValue ?? displayUrl,
  };
};

const sanitizeStoredTab = (tab) => {
  if (!tab || typeof tab !== "object") return null;
  if (tab.url === "newtab" || !tab.url) {
    return makeTab({
      ...tab,
      url: GOOGLE_HOME,
      displayUrl: GOOGLE_DISPLAY,
    });
  }
  return makeTab(tab);
};

const LockIndicator = ({ isLoading, url }) => {
  if (isLoading) {
    return <span className="iex-spinner" aria-label="Loading" />;
  }

  if (!isNavigableUrl(url)) {
    return <span className="iex-lock-indicator">&#8226;</span>;
  }

  return (
    <span className="iex-lock-indicator">
      {url.startsWith("https://") ? "\uD83D\uDD12" : "\u26A0"}
    </span>
  );
};

const TabBar = ({
  tabs,
  activeTabId,
  onSwitchTab,
  onCloseTab,
  onOpenNewTab,
}) => {
  return (
    <div className="iex-tabbar">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            className={`iex-tab ${isActive ? "active" : ""}`}
            onClick={() => onSwitchTab(tab.id)}
            onMouseDown={(event) => {
              if (event.button === 1) {
                event.preventDefault();
                onCloseTab(tab.id);
              }
            }}
            title={tab.title || tab.displayUrl || "New Tab"}
            type="button"
          >
            <img
              src={tab.favicon}
              alt=""
              className="iex-tab-favicon"
              draggable={false}
              onError={(event) => {
                if (event.currentTarget.src !== ieIcon) {
                  event.currentTarget.src = ieIcon;
                }
              }}
            />
            <span className="iex-tab-title">{truncateText(tab.title)}</span>
            <span
              className="iex-tab-close"
              onClick={(event) => {
                event.stopPropagation();
                onCloseTab(tab.id);
              }}
            >
              x
            </span>
          </button>
        );
      })}
      <button className="iex-new-tab" onClick={onOpenNewTab} type="button">
        +
      </button>
    </div>
  );
};

const UrlBarRow = ({
  activeTab,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onRefresh,
  onHome,
  onSubmitInput,
  onInputChange,
  onInputSelectAll,
  onToggleBookmark,
  isBookmarked,
  bookmarksBarVisible,
  onToggleBookmarksBar,
  inputRef,
}) => {
  const inputValue = activeTab?.inputValue ?? "";

  return (
    <div className="iex-urlbar-row">
      <div className="iex-nav-controls">
        <button type="button" className="iex-nav-btn" onClick={onBack} disabled={!canGoBack} title="Back">
          {"\u2190"}
        </button>
        <button type="button" className="iex-nav-btn" onClick={onForward} disabled={!canGoForward} title="Forward">
          {"\u2192"}
        </button>
        <button type="button" className="iex-nav-btn" onClick={onRefresh} title="Refresh">
          {"\u21BB"}
        </button>
        <button type="button" className="iex-nav-btn" onClick={onHome} title="Home">
          {"\u2302"}
        </button>
      </div>
      <div className="iex-omnibox-container">
        <div className="iex-omnibox">
        <LockIndicator isLoading={activeTab?.isLoading} url={activeTab?.url} />
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmitInput();
            }
          }}
          onFocus={onInputSelectAll}
          spellCheck={false}
          placeholder="Search Google or type a URL"
        />
          <button type="button" className="iex-bookmark-btn" onClick={onToggleBookmark} title="Bookmark">
            {isBookmarked ? "\u2605" : "\u2606"}
          </button>
        </div>
      </div>
      <div className="iex-right-controls">
        <button
          type="button"
          className={`iex-bar-toggle ${bookmarksBarVisible ? "active" : ""}`}
          onClick={onToggleBookmarksBar}
          title="Toggle bookmarks bar"
        >
          {bookmarksBarVisible ? "Bar On" : "Bar Off"}
        </button>
      </div>
    </div>
  );
};

const BookmarksBar = ({ bookmarks, onNavigate }) => {
  const items = bookmarks.length > 0 ? bookmarks : DEFAULT_PROFILE_BOOKMARKS;
  const barRef = useRef(null);

  const handleWheel = (e) => {
    if (barRef.current) {
      barRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="iex-bookmarks-bar" ref={barRef} onWheel={handleWheel}>
      <div className="iex-bookmarks-inner">
      {items.map((item) => {
        const favicon = item.favicon || getFaviconUrl(item.url);
        const title = item.title || item.label || deriveTitleFromUrl(item.url, item.url);
        return (
          <button
            key={`${item.url}-${title}`}
            className="iex-bookmark-chip"
            onClick={() => onNavigate(item.url)}
            title={item.url}
            type="button"
          >
            <img
              src={favicon}
              alt=""
              draggable={false}
              onError={(event) => {
                if (event.currentTarget.src !== ieIcon) {
                  event.currentTarget.src = ieIcon;
                }
              }}
            />
            <span>{truncateText(title, 16)}</span>
          </button>
        );
      })}
      </div>
    </div>
  );
};

const BlockedPageOverlay = ({ blocked, onOpenExternal, onGoBack }) => (
  <div className="iex-blocked-overlay">
    <div className="iex-blocked-card">
      <div className="iex-blocked-titlebar">Navigation Canceled</div>
      <div className="iex-blocked-body">
        <div className="iex-blocked-icon">!</div>
        <div className="iex-blocked-copy">
          <h3>This page cannot be displayed in the portfolio browser.</h3>
          <p>
            <strong>{blocked?.url || "Unknown URL"}</strong> refused to load inside a frame.
          </p>
          <p>This is usually caused by X-Frame-Options or a frame-ancestors policy.</p>
        </div>
      </div>
      <div className="iex-blocked-actions">
        <button type="button" onClick={onOpenExternal}>
          Open in Browser
        </button>
        <button type="button" onClick={onGoBack}>
          Back
        </button>
      </div>
    </div>
  </div>
);

const InternetExplorer = () => {
  const {
    setRightClickDefault,
    themeDragBar,
    IEExpand,
    setIEExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  const rootRef = useRef(null);
  const iframeRef = useRef(null);
  const urlInputRef = useRef(null);
  const tabsRef = useRef([]);
  const activeTabIdRef = useRef("");

  const launchPosition = useMemo(
    () => ({
      x:
        window.innerWidth <= 700
          ? 16
          : Math.max(36, Math.floor((window.innerWidth - 1080) / 2)),
      y: window.innerWidth <= 700 ? 48 : 68,
    }),
    [],
  );

  const [tabs, setTabs] = useState(() => {
    const storedTabs = safeParseJson(localStorage.getItem(STORAGE_KEYS.tabs), []);
    if (!Array.isArray(storedTabs) || storedTabs.length === 0) {
      return [makeTab({ url: GOOGLE_HOME, displayUrl: GOOGLE_DISPLAY, isLoading: true })];
    }
    const normalized = storedTabs.map(sanitizeStoredTab).filter(Boolean);
    return normalized.length > 0
      ? normalized
      : [makeTab({ url: GOOGLE_HOME, displayUrl: GOOGLE_DISPLAY, isLoading: true })];
  });

  const [activeTabId, setActiveTabId] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.activeTab);
    if (!raw) return "";
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  });

  const [globalHistory, setGlobalHistory] = useState(() => {
    const stored = safeParseJson(localStorage.getItem(STORAGE_KEYS.history), []);
    return Array.isArray(stored) ? stored : [];
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const stored = safeParseJson(localStorage.getItem(STORAGE_KEYS.bookmarks), []);
    return mergeBookmarksWithDefaults(stored);
  });

  const [bookmarksBarVisible, setBookmarksBarVisible] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.bookmarksBar);
    if (raw === null) return true;
    return raw === "true";
  });

  const [reloadTokens, setReloadTokens] = useState({});
  const hasPersistedPosition = useMemo(
    () =>
      IEExpand?.hasPosition === true ||
      (Number.isFinite(IEExpand?.x) &&
        Number.isFinite(IEExpand?.y) &&
        !(IEExpand?.x === 0 && IEExpand?.y === 0 && IEExpand?.hasPosition !== true)),
    [IEExpand?.hasPosition, IEExpand?.x, IEExpand?.y],
  );
  const resolvedWindowPosition = hasPersistedPosition
    ? {
        x: IEExpand.x,
        y: IEExpand.y,
      }
    : undefined;

  useEffect(() => {
    tabsRef.current = tabs;
  }, [tabs]);

  useEffect(() => {
    activeTabIdRef.current = activeTabId;
  }, [activeTabId]);

  useEffect(() => {
    if (tabs.length === 0) return;
    if (!activeTabId || !tabs.some((tab) => tab.id === activeTabId)) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.tabs, JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeTab, JSON.stringify(activeTabId || ""));
  }, [activeTabId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(globalHistory));
  }, [globalHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookmarksBar, bookmarksBarVisible ? "true" : "false");
  }, [bookmarksBarVisible]);

  const updateTab = useCallback((tabId, updater) => {
    if (!tabId) return;
    setTabs((previousTabs) =>
      previousTabs.map((tab) => {
        if (tab.id !== tabId) return tab;
        const nextTab =
          typeof updater === "function"
            ? updater(tab)
            : { ...tab, ...updater };
        return makeTab({ ...tab, ...nextTab, id: tab.id });
      }),
    );
  }, []);

  const pushGlobalHistory = useCallback((url, title) => {
    if (!isNavigableUrl(url)) return;
    const safeTitle = title || deriveTitleFromUrl(url, url);
    const timestamp = new Date().toISOString();
    setGlobalHistory((previous) => {
      if (previous[0]?.url === url) {
        return previous;
      }
      return [{ url, title: safeTitle, timestamp }, ...previous].slice(0, MAX_GLOBAL_HISTORY);
    });
  }, []);

  const activeTab = useMemo(() => {
    const matched = tabs.find((tab) => tab.id === activeTabId);
    return matched || tabs[0] || null;
  }, [tabs, activeTabId]);

  const canGoBack = Boolean(activeTab && activeTab.historyIndex > 0);
  const canGoForward = Boolean(
    activeTab &&
      activeTab.historyIndex >= 0 &&
      activeTab.historyIndex < activeTab.history.length - 1,
  );

  const isBookmarked = useMemo(() => {
    if (!activeTab || !isNavigableUrl(activeTab.url)) return false;
    return bookmarks.some((bookmark) => bookmark.url === activeTab.url);
  }, [bookmarks, activeTab]);

  const navigateActiveTab = useCallback(
    (rawInput, options = {}) => {
      const targetTabId = options.tabId || activeTabIdRef.current;
      const normalized = options.preNormalized || normalizeOmniboxInput(rawInput);
      if (!normalized || !targetTabId) return false;

      let tabTitle = "";

      setTabs((previousTabs) =>
        previousTabs.map((tab) => {
          if (tab.id !== targetTabId) return tab;

          let nextHistory = Array.isArray(tab.history) ? [...tab.history] : [];
          let nextHistoryIndex = Number.isInteger(tab.historyIndex)
            ? tab.historyIndex
            : nextHistory.length - 1;

          if (!options.fromHistory) {
            nextHistory = nextHistory.slice(0, nextHistoryIndex + 1);
            if (nextHistory[nextHistory.length - 1] !== normalized.url) {
              nextHistory.push(normalized.url);
            }
            nextHistoryIndex = nextHistory.length - 1;
          }

          tabTitle = deriveTitleFromUrl(normalized.url, normalized.displayUrl);
          return makeTab({
            ...tab,
            url: normalized.url,
            displayUrl: normalized.displayUrl,
            title: tabTitle,
            favicon: getFaviconUrl(normalized.url),
            isLoading: isNavigableUrl(normalized.url),
            blocked: null,
            history: nextHistory,
            historyIndex: nextHistoryIndex,
            inputValue: normalized.displayUrl,
          });
        }),
      );

      setActiveTabId(targetTabId);

      if (!options.fromHistory && !options.skipGlobalHistory) {
        pushGlobalHistory(normalized.url, tabTitle);
      }

      return true;
    },
    [pushGlobalHistory],
  );

  const goHome = useCallback(() => {
    navigateActiveTab("", {
      preNormalized: { url: GOOGLE_HOME, displayUrl: GOOGLE_DISPLAY },
    });
  }, [navigateActiveTab]);

  const openNewTab = useCallback(() => {
    const tab = makeTab({
      url: GOOGLE_HOME,
      displayUrl: GOOGLE_DISPLAY,
      inputValue: GOOGLE_DISPLAY,
      title: deriveTitleFromUrl(GOOGLE_HOME, GOOGLE_DISPLAY),
      isLoading: true,
    });
    setTabs((previous) => [...previous, tab]);
    setActiveTabId(tab.id);
  }, []);

  const closeTab = useCallback((tabId) => {
    setTabs((previousTabs) => {
      if (previousTabs.length <= 1) {
        const existing = previousTabs[0];
        const reset = makeTab({
          ...existing,
          url: GOOGLE_HOME,
          displayUrl: GOOGLE_DISPLAY,
          inputValue: GOOGLE_DISPLAY,
          title: deriveTitleFromUrl(GOOGLE_HOME, GOOGLE_DISPLAY),
          isLoading: false,
          history: [GOOGLE_HOME],
          historyIndex: 0,
          blocked: null,
          favicon: ieIcon,
        });
        setActiveTabId(reset.id);
        return [reset];
      }

      const tabIndex = previousTabs.findIndex((tab) => tab.id === tabId);
      if (tabIndex === -1) return previousTabs;

      const nextTabs = previousTabs.filter((tab) => tab.id !== tabId);
      if (tabId === activeTabIdRef.current) {
        const nextIndex = Math.max(0, tabIndex - 1);
        const nextActive = nextTabs[nextIndex] || nextTabs[0];
        setActiveTabId(nextActive.id);
      }
      return nextTabs;
    });
  }, []);

  const goBack = useCallback(() => {
    const tab = tabsRef.current.find((item) => item.id === activeTabIdRef.current);
    if (!tab || tab.historyIndex <= 0) return;

    try {
      iframeRef.current?.contentWindow?.history?.back();
    } catch {
      // Cross-origin iframes may block direct history access.
    }

    const targetIndex = tab.historyIndex - 1;
    const targetUrl = tab.history[targetIndex];
    const nextDisplay = getDisplayUrlFromUrl(targetUrl);

    updateTab(tab.id, (current) => ({
      ...current,
      historyIndex: targetIndex,
      url: targetUrl,
      displayUrl: nextDisplay,
      inputValue: nextDisplay,
      title: deriveTitleFromUrl(targetUrl, nextDisplay),
      favicon: getFaviconUrl(targetUrl),
      isLoading: isNavigableUrl(targetUrl),
      blocked: null,
    }));
  }, [updateTab]);

  const goForward = useCallback(() => {
    const tab = tabsRef.current.find((item) => item.id === activeTabIdRef.current);
    if (!tab || tab.historyIndex >= tab.history.length - 1) return;

    try {
      iframeRef.current?.contentWindow?.history?.forward();
    } catch {
      // Cross-origin iframes may block direct history access.
    }

    const targetIndex = tab.historyIndex + 1;
    const targetUrl = tab.history[targetIndex];
    const nextDisplay = getDisplayUrlFromUrl(targetUrl);

    updateTab(tab.id, (current) => ({
      ...current,
      historyIndex: targetIndex,
      url: targetUrl,
      displayUrl: nextDisplay,
      inputValue: nextDisplay,
      title: deriveTitleFromUrl(targetUrl, nextDisplay),
      favicon: getFaviconUrl(targetUrl),
      isLoading: isNavigableUrl(targetUrl),
      blocked: null,
    }));
  }, [updateTab]);

  const refreshActiveTab = useCallback(() => {
    const tab = tabsRef.current.find((item) => item.id === activeTabIdRef.current);
    if (!tab || !isNavigableUrl(tab.url)) return;

    updateTab(tab.id, { isLoading: true, blocked: null });
    setReloadTokens((previous) => ({
      ...previous,
      [tab.id]: (previous[tab.id] || 0) + 1,
    }));
  }, [updateTab]);

  const toggleBookmark = useCallback(() => {
    const tab = tabsRef.current.find((item) => item.id === activeTabIdRef.current);
    if (!tab || !isNavigableUrl(tab.url)) return;

    setBookmarks((previous) => {
      const existingIndex = previous.findIndex((entry) => entry.url === tab.url);
      if (existingIndex >= 0) {
        return previous.filter((entry) => entry.url !== tab.url);
      }
      const nextBookmark = {
        url: tab.url,
        title: tab.title || deriveTitleFromUrl(tab.url, tab.displayUrl),
        favicon: getFaviconUrl(tab.url),
      };
      return [nextBookmark, ...previous];
    });
  }, []);

  const navigateToBookmarkOrSuggestion = useCallback(
    (url) => {
      if (!url) return;
      if (/^mailto:/i.test(url)) {
        window.location.href = url;
        return;
      }
      navigateActiveTab(url);
    },
    [navigateActiveTab],
  );

  const handleIframeLoad = useCallback(() => {
    const tabId = activeTabIdRef.current;
    const currentTab = tabsRef.current.find((tab) => tab.id === tabId);
    if (!currentTab || !isNavigableUrl(currentTab.url)) return;

    const iframe = iframeRef.current;
    let blocked = null;
    let resolvedHref = "";
    let resolvedTitle = "";

    try {
      resolvedHref = iframe?.contentWindow?.location?.href || "";
      resolvedTitle = iframe?.contentDocument?.title || "";

      if (resolvedHref === "about:blank" && currentTab.url !== "about:blank") {
        blocked = {
          url: currentTab.url,
          reason: "Iframe resolved to about:blank",
          detectedAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      // Probe pattern for XFO/CSP frame blocking: cross-origin access throws SecurityError.
      const isSecurityError =
        error?.name === "SecurityError" ||
        /cross-origin|permission denied|blocked/i.test(String(error));

      if (isSecurityError && !isFriendlyHost(currentTab.url)) {
        blocked = {
          url: currentTab.url,
          reason: "Blocked by X-Frame-Options or frame-ancestors policy",
          detectedAt: new Date().toISOString(),
        };
      }
    }

    updateTab(tabId, (tab) => {
      const nextTab = {
        ...tab,
        isLoading: false,
        blocked,
      };

      if (!blocked) {
        if (resolvedTitle && resolvedTitle.trim()) {
          nextTab.title = truncateText(resolvedTitle.trim(), 30);
        }
        if (resolvedHref && resolvedHref !== "about:blank") {
          const nextDisplay = getDisplayUrlFromUrl(resolvedHref);
          nextTab.displayUrl = nextDisplay;
          nextTab.inputValue = nextDisplay;
        }
      }
      return nextTab;
    });
  }, [updateTab]);

  const handleIframeError = useCallback(() => {
    const tabId = activeTabIdRef.current;
    const currentTab = tabsRef.current.find((tab) => tab.id === tabId);
    if (!currentTab || !isNavigableUrl(currentTab.url)) return;

    updateTab(tabId, {
      isLoading: false,
      blocked: {
        url: currentTab.url,
        reason: "iframe onError fired",
        detectedAt: new Date().toISOString(),
      },
    });
  }, [updateTab]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const handleKeyDown = (event) => {
      const lowerKey = event.key.toLowerCase();

      if (event.ctrlKey && lowerKey === "t") {
        event.preventDefault();
        openNewTab();
        return;
      }

      if (event.ctrlKey && lowerKey === "w") {
        event.preventDefault();
        closeTab(activeTabIdRef.current);
        return;
      }

      if (event.ctrlKey && lowerKey === "r") {
        event.preventDefault();
        refreshActiveTab();
        return;
      }

      if (event.ctrlKey && lowerKey === "l") {
        event.preventDefault();
        urlInputRef.current?.focus();
        urlInputRef.current?.select();
        return;
      }

      if (event.altKey && event.key === "ArrowLeft") {
        event.preventDefault();
        goBack();
        return;
      }

      if (event.altKey && event.key === "ArrowRight") {
        event.preventDefault();
        goForward();
      }
    };

    root.addEventListener("keydown", handleKeyDown);
    return () => root.removeEventListener("keydown", handleKeyDown);
  }, [closeTab, goBack, goForward, openNewTab, refreshActiveTab]);

  useEffect(() => {
    if (IEExpand.show && IEExpand.focusItem) {
      rootRef.current?.focus();
    }
  }, [IEExpand.show, IEExpand.focusItem]);

  const handleClose = () => {
    deleteTap("InternetExplorer");
  };

  const handleMinimize = () => {
    setIEExpand((previous) => ({ ...previous, hide: true, focusItem: false }));
    StyleHide("InternetExplorer");
  };

  const handleMaximize = () => {
    // Let WindowDraggable manage pre-max snapshot and restore; keeps position sync stable.
    setIEExpand((previous) => ({
      ...previous,
      expand: !previous.expand,
      hide: false,
      focusItem: true,
    }));
  };

  const handleDragStop = (_, data) => {
    setIEExpand((previous) => ({
      ...previous,
      x: Number.isFinite(data?.x) ? data.x : previous.x,
      y: Number.isFinite(data?.y) ? data.y : previous.y,
      hasPosition: true,
    }));
  };

  if (!IEExpand.show) return null;

  const activeUrl = activeTab?.url || GOOGLE_HOME;
  const reloadToken = activeTab ? reloadTokens[activeTab.id] || 0 : 0;

  return (
    <Draggable
      axis="both"
      handle=".folder_dragbar-InternetExplorer"
      grid={[1, 1]}
      scale={1}
      disabled={IEExpand.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: launchPosition.x,
        y: launchPosition.y,
      }}
      position={resolvedWindowPosition}
      onStop={handleDragStop}
      onStart={() => handleSetFocusItemTrue("InternetExplorer")}
    >
      <div
        ref={rootRef}
        tabIndex={0}
        className="folder_folder-InternetExplorer iex-window"
        onClick={(event) => {
          event.stopPropagation();
          handleSetFocusItemTrue("InternetExplorer");
        }}
        onMouseDown={() => rootRef.current?.focus()}
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setRightClickDefault(false);
        }}
        style={IEExpand.expand ? inlineStyleExpand("InternetExplorer") : inlineStyle("InternetExplorer")}
      >
        <style>{componentStyles}</style>
        <div
          className="folder_dragbar-InternetExplorer"
          style={{ background: IEExpand.focusItem ? themeDragBar : "#757579" }}
        >
          <div className="folder_barname-InternetExplorer">
            <img src={ieIcon} alt="Internet Explorer" />
            <span>Internet Explorer</span>
          </div>
          <div className="folder_barbtn-InternetExplorer">
            <div
              onClick={
                !isTouchDevice
                  ? (event) => {
                      event.stopPropagation();
                      handleMinimize();
                    }
                  : undefined
              }
              onTouchEnd={(event) => {
                event.stopPropagation();
                handleMinimize();
              }}
              onTouchStart={(event) => event.stopPropagation()}
            >
              <p className="dash-InternetExplorer" />
            </div>
            <div
              onClick={
                !isTouchDevice
                  ? (event) => {
                      event.stopPropagation();
                      handleMaximize();
                    }
                  : undefined
              }
              onTouchEnd={(event) => {
                event.stopPropagation();
                handleMaximize();
              }}
              onTouchStart={(event) => event.stopPropagation()}
            >
              <div className={`expand-InternetExplorer ${IEExpand.expand ? "full" : ""}`} />
              {IEExpand.expand ? <div className="expand_2-InternetExplorer" /> : null}
            </div>
            <div>
              <p
                className="x-InternetExplorer"
                onClick={!isTouchDevice ? handleClose : undefined}
                onTouchEnd={handleClose}
              >
                {"\u00D7"}
              </p>
            </div>
          </div>
        </div>

        <div className="iex-shell">
          <TabBar
            tabs={tabs}
            activeTabId={activeTab?.id}
            onSwitchTab={setActiveTabId}
            onCloseTab={closeTab}
            onOpenNewTab={openNewTab}
          />
          <UrlBarRow
            activeTab={activeTab}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onBack={goBack}
            onForward={goForward}
            onRefresh={refreshActiveTab}
            onHome={goHome}
            onSubmitInput={() => navigateActiveTab(activeTab?.inputValue)}
            onInputChange={(value) => updateTab(activeTab?.id, { inputValue: value })}
            onInputSelectAll={(event) => event.target.select()}
            onToggleBookmark={toggleBookmark}
            isBookmarked={isBookmarked}
            bookmarksBarVisible={bookmarksBarVisible}
            onToggleBookmarksBar={() => setBookmarksBarVisible((previous) => !previous)}
            inputRef={urlInputRef}
          />
          {bookmarksBarVisible ? (
            <BookmarksBar bookmarks={bookmarks} onNavigate={navigateToBookmarkOrSuggestion} />
          ) : null}
          <div className="iex-content-area">
            {activeTab?.isLoading ? <div className="iex-loading-bar" /> : null}
            <div className="iex-frame-container">
              <iframe
                key={`${activeTab?.id}-${reloadToken}-${activeUrl}`}
                ref={iframeRef}
                src={activeUrl}
                title={activeTab?.title || "Browser Frame"}
                className="iex-frame"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                allow="fullscreen"
              />
              {activeTab?.blocked ? (
                <BlockedPageOverlay
                  blocked={activeTab.blocked}
                  onOpenExternal={() => {
                    if (activeTab.blocked?.url) {
                      window.open(activeTab.blocked.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  onGoBack={() => {
                    if (canGoBack) {
                      goBack();
                    } else {
                      goHome();
                    }
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

const componentStyles = `
.iex-window {
  width: min(1080px, calc(100vw - 72px));
  height: min(700px, calc(100vh - 110px));
  min-width: 760px;
  min-height: 500px;
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  font-family: 'win95', sans-serif;
  color: #000;
}

.iex-shell {
  display: flex;
  flex-direction: column;
  height: calc(100% - 18px);
  background: #c0c0c0;
  color: #000;
  overflow: hidden;
}

.iex-tabbar {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding: 4px 4px 0;
  background: #c0c0c0;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-right: 1px solid #808080;
  border-bottom: 1px solid #808080;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.iex-tabbar::-webkit-scrollbar,
.iex-bookmarks-bar::-webkit-scrollbar {
  height: 0;
  width: 0;
}

.iex-tab {
  height: 24px;
  min-width: 132px;
  max-width: 220px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  color: #000;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  cursor: pointer;
}

.iex-tab.active {
  position: relative;
  top: 1px;
  border-bottom-color: #c0c0c0;
}

.iex-tab:hover,
.iex-tab:focus-visible,
.iex-new-tab:hover,
.iex-nav-btn:hover:not(:disabled),
.iex-bookmark-chip:hover,
.iex-bookmark-btn:hover,
.iex-bar-toggle:hover {
  background: #d4d0c8;
}

.iex-tab-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
}

.iex-tab-favicon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.iex-tab-close {
  margin-left: auto;
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 10px;
}

.iex-new-tab,
.iex-nav-btn,
.iex-bookmark-btn,
.iex-bar-toggle,
.iex-blocked-actions button {
  min-width: 24px;
  min-height: 22px;
  padding: 0 8px;
  color: #000;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  font-family: 'win95', sans-serif;
  font-size: 11px;
  cursor: pointer;
}

.iex-new-tab:active,
.iex-nav-btn:active,
.iex-bookmark-btn:active,
.iex-bar-toggle:active,
.iex-blocked-actions button:active {
  border-top-color: #404040;
  border-left-color: #404040;
  border-right-color: #fff;
  border-bottom-color: #fff;
}

.iex-nav-btn:disabled {
  color: #808080;
  cursor: not-allowed;
}

.iex-urlbar-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  background: #c0c0c0;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #808080;
}

.iex-nav-controls,
.iex-right-controls,
.iex-bookmarks-inner {
  display: flex;
  align-items: center;
  gap: 4px;
}

.iex-omnibox-container {
  min-width: 0;
}

.iex-omnibox {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 6px;
  background: #fff;
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

.iex-omnibox input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  color: #000;
  font-family: 'win95', sans-serif;
  font-size: 11px;
  outline: none;
}

.iex-lock-indicator {
  min-width: 16px;
  color: #000080;
  font-size: 10px;
}

.iex-spinner {
  width: 18px;
  height: 12px;
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  background: repeating-linear-gradient(
    90deg,
    #000080 0,
    #000080 4px,
    #1084d0 4px,
    #1084d0 8px
  );
  animation: iex-throb 0.8s linear infinite;
}

.iex-bookmarks-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  background: #c0c0c0;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #808080;
  overflow-x: auto;
  overflow-y: hidden;
}

.iex-bookmark-chip {
  height: 22px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  color: #000;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  font-family: 'win95', sans-serif;
  font-size: 11px;
  cursor: pointer;
}

.iex-bookmark-chip img {
  width: 14px;
  height: 14px;
}

.iex-content-area {
  position: relative;
  flex: 1;
  min-height: 0;
  margin: 2px;
  background: #fff;
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

.iex-loading-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 2px;
  background: #000080;
  animation: iex-loading 1.2s linear infinite;
  z-index: 4;
}

.iex-frame-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
}

.iex-frame {
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
}

.iex-blocked-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(192, 192, 192, 0.72);
}

.iex-blocked-card {
  width: min(460px, calc(100% - 24px));
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  box-shadow: 1px 1px 0 #000;
}

.iex-blocked-titlebar {
  padding: 2px 4px;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(90deg, #000080 0%, #1084d0 100%);
}

.iex-blocked-body {
  display: flex;
  gap: 12px;
  padding: 14px 14px 8px;
}

.iex-blocked-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background: #ffff9c;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
}

.iex-blocked-copy h3,
.iex-blocked-copy p {
  margin: 0;
}

.iex-blocked-copy h3 {
  margin-bottom: 6px;
  font-size: 14px;
}

.iex-blocked-copy p + p {
  margin-top: 4px;
}

.iex-blocked-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 14px 12px;
}

@keyframes iex-throb {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 24px 0;
  }
}

@keyframes iex-loading {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(330%);
  }
}

@media (max-width: 900px) {
  .iex-window {
    min-width: 0;
    min-height: 0;
    width: calc(100vw - 24px);
    height: calc(100vh - 56px);
  }

  .iex-urlbar-row {
    grid-template-columns: 1fr;
  }

  .iex-nav-controls,
  .iex-right-controls {
    flex-wrap: wrap;
  }
}
`;

export const displayInternetExplorer = () => <InternetExplorer />;
export default InternetExplorer;
