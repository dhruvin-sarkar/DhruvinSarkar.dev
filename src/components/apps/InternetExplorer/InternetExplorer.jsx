import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Draggable from "react-draggable";
import UseContext from "../../../Context";

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

const SUGGESTED_SITES = [
  { label: "Google", url: GOOGLE_HOME },
  { label: "YouTube Alt", url: "https://yewtu.be" },
  { label: "Wikipedia", url: "https://www.wikipedia.org" },
  { label: "GitHub Pages", url: "https://pages.github.com" },
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

const isNavigableUrl = (url) => Boolean(url && url !== "newtab");

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
  if (!host) return "/assets/ie.png";
  // Google s2 is a stable way to fetch small favicons from hostnames.
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=16`;
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
  const nextUrl = partial.url ?? "newtab";
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
        <button type="button" onClick={onBack} disabled={!canGoBack}>
          {"\u2190"}
        </button>
        <button type="button" onClick={onForward} disabled={!canGoForward}>
          {"\u2192"}
        </button>
        <button type="button" onClick={onRefresh}>
          {"\u21BB"}
        </button>
        <button type="button" onClick={onHome}>
          {"\u2302"}
        </button>
      </div>
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
      </div>
      <div className="iex-right-controls">
        <button type="button" onClick={onToggleBookmark} title="Bookmark">
          {isBookmarked ? "\u2605" : "\u2606"}
        </button>
        <button
          type="button"
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
  const items = bookmarks.length > 0 ? bookmarks : SUGGESTED_SITES;

  return (
    <div className="iex-bookmarks-bar">
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
            <img src={favicon} alt="" draggable={false} />
            <span>{truncateText(title, 16)}</span>
          </button>
        );
      })}
    </div>
  );
};

const NewTabPage = ({
  onSearch,
  mostVisited,
  bookmarks,
  onNavigate,
}) => {
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="iex-newtab-page">
      <div className="iex-newtab-clock">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
      <div className="iex-newtab-search-card">
        <h2>Search the web</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(query);
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type your search"
          />
        </form>
      </div>
      <div className="iex-newtab-grid">
        <section className="iex-glass-card">
          <h3>Most Visited</h3>
          <div className="iex-tile-grid">
            {mostVisited.length > 0 ? (
              mostVisited.map((site) => (
                <button
                  key={site.url}
                  className="iex-tile"
                  onClick={() => onNavigate(site.url)}
                  type="button"
                >
                  <img src={getFaviconUrl(site.url)} alt="" draggable={false} />
                  <span>{truncateText(site.title || site.host, 18)}</span>
                  <small>{site.count} visits</small>
                </button>
              ))
            ) : (
              <p className="iex-empty">No browsing history yet.</p>
            )}
          </div>
        </section>
        <section className="iex-glass-card">
          <h3>Bookmarks</h3>
          <div className="iex-bookmark-list">
            {(bookmarks.length > 0 ? bookmarks : SUGGESTED_SITES).map((bookmark) => (
              <button
                key={`${bookmark.url}-${bookmark.title || bookmark.label || "bookmark"}`}
                className="iex-bookmark-row"
                onClick={() => onNavigate(bookmark.url)}
                type="button"
              >
                <img
                  src={bookmark.favicon || getFaviconUrl(bookmark.url)}
                  alt=""
                  draggable={false}
                />
                <span>{bookmark.title || bookmark.label || bookmark.url}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const BlockedPageOverlay = ({ blocked, onOpenExternal, onGoBack }) => (
  <div className="iex-blocked-overlay">
    <div className="iex-blocked-card">
      <div className="iex-blocked-icon">!</div>
      <h3>This site can't be reached inside the portfolio browser</h3>
      <p>
        <strong>{blocked?.url || "Unknown URL"}</strong> was blocked by its security policy
        (X-Frame-Options / frame-ancestors).
      </p>
      <div className="iex-blocked-actions">
        <button type="button" onClick={onOpenExternal}>
          Open in real browser
        </button>
        <button type="button" onClick={onGoBack}>
          Go Back
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
    return Array.isArray(stored) ? stored : [];
  });

  const [bookmarksBarVisible, setBookmarksBarVisible] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.bookmarksBar);
    if (raw === null) return true;
    return raw === "true";
  });

  const [reloadTokens, setReloadTokens] = useState({});

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

  const mostVisitedSites = useMemo(() => {
    const stats = new Map();
    globalHistory.forEach((entry) => {
      if (!entry || !entry.url) return;
      const current = stats.get(entry.url) || {
        url: entry.url,
        title: entry.title || deriveTitleFromUrl(entry.url, entry.url),
        host: getHostFromUrl(entry.url),
        count: 0,
        latestTimestamp: 0,
      };
      current.count += 1;
      const timestampValue = entry.timestamp ? new Date(entry.timestamp).getTime() : 0;
      current.latestTimestamp = Math.max(current.latestTimestamp, timestampValue);
      stats.set(entry.url, current);
    });

    return [...stats.values()]
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.latestTimestamp - a.latestTimestamp;
      })
      .slice(0, 8);
  }, [globalHistory]);

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
    const tab = makeTab({ url: "newtab", displayUrl: "", inputValue: "", title: "New Tab" });
    setTabs((previous) => [...previous, tab]);
    setActiveTabId(tab.id);
  }, []);

  const closeTab = useCallback((tabId) => {
    setTabs((previousTabs) => {
      if (previousTabs.length <= 1) {
        const existing = previousTabs[0];
        const reset = makeTab({
          ...existing,
          url: "newtab",
          displayUrl: "",
          inputValue: "",
          title: "New Tab",
          isLoading: false,
          history: [],
          historyIndex: -1,
          blocked: null,
          favicon: "/assets/ie.png",
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
    setIEExpand((previous) => ({ ...previous, expand: !previous.expand }));
  };

  const handleDragStop = (_, data) => {
    setIEExpand((previous) => ({
      ...previous,
      x: data.x,
      y: data.y,
    }));
  };

  if (!IEExpand.show) return null;

  const activeUrl = activeTab?.url || "newtab";
  const showNewTab = !isNavigableUrl(activeUrl);
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
        x: window.innerWidth <= 500 ? 20 : 100,
        y: window.innerWidth <= 500 ? 40 : 100,
      }}
      position={{
        x: IEExpand.x ?? (window.innerWidth <= 500 ? 20 : 100),
        y: IEExpand.y ?? (window.innerWidth <= 500 ? 40 : 100),
      }}
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
            <img src="/assets/ie.png" alt="Chrome style browser" />
            <span>Chrome</span>
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
            {showNewTab ? (
              <NewTabPage
                onSearch={(query) => navigateActiveTab(query)}
                mostVisited={mostVisitedSites}
                bookmarks={bookmarks}
                onNavigate={navigateToBookmarkOrSuggestion}
              />
            ) : (
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
                  allowFullScreen
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
                        updateTab(activeTab.id, {
                          url: "newtab",
                          displayUrl: "",
                          inputValue: "",
                          title: "New Tab",
                          isLoading: false,
                          blocked: null,
                        });
                      }
                    }}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

const componentStyles = `
.iex-window {
  width: 100%;
  height: 100%;
  min-width: 740px;
  min-height: 460px;
  display: flex;
  flex-direction: column;
}

.iex-shell {
  display: flex;
  flex-direction: column;
  height: calc(100% - 18px);
  background: #111827;
  color: #e5e7eb;
  overflow: hidden;
}

.iex-tabbar {
  height: 32px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #1a1a2e;
  border-bottom: 1px solid #282c45;
  overflow-x: auto;
}

.iex-tab {
  border: 1px solid #30344a;
  border-radius: 16px;
  background: #1f2438;
  color: #d1d5db;
  height: 24px;
  min-width: 120px;
  max-width: 220px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  cursor: pointer;
}

.iex-tab.active {
  background: #f4f5f7;
  color: #111827;
  border-color: #f4f5f7;
}

.iex-tab:hover {
  filter: brightness(1.08);
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
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.iex-tab-close:hover {
  background: rgba(0, 0, 0, 0.15);
}

.iex-new-tab {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #3d425b;
  background: #1f2438;
  color: #d1d5db;
  cursor: pointer;
  flex-shrink: 0;
}

.iex-urlbar-row {
  height: 40px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #20263a;
  border-bottom: 1px solid #2f354f;
}

.iex-nav-controls,
.iex-right-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.iex-nav-controls button,
.iex-right-controls button {
  height: 28px;
  border: 1px solid #3b4262;
  background: #1d2336;
  color: #d1d5db;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 11px;
  cursor: pointer;
}

.iex-nav-controls button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.iex-omnibox {
  height: 28px;
  display: flex;
  align-items: center;
  border: 1px solid #374056;
  border-radius: 999px;
  background: #0f1526;
  padding: 0 10px;
  gap: 8px;
}

.iex-omnibox input {
  height: 100%;
  width: 100%;
  border: none;
  background: transparent;
  color: #f3f4f6;
  font-size: 12px;
  outline: none;
}

.iex-lock-indicator {
  min-width: 20px;
  font-size: 10px;
  color: #a5b4fc;
}

.iex-spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #7c83a3;
  border-top-color: #60a5fa;
  animation: iex-spin 0.9s linear infinite;
}

.iex-bookmarks-bar {
  height: 28px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #272f45;
  border-bottom: 1px solid #353f5b;
  overflow-x: auto;
}

.iex-bookmark-chip {
  height: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #3e4867;
  border-radius: 12px;
  background: #1d2436;
  color: #d1d5db;
  padding: 0 8px;
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
  background: #0b1020;
}

.iex-loading-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 2px;
  background: linear-gradient(90deg, #22d3ee, #3b82f6);
  animation: iex-loading 1.2s ease-in-out infinite;
  z-index: 5;
}

.iex-frame-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.iex-frame {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.iex-blocked-overlay {
  position: absolute;
  inset: 0;
  background: rgba(8, 12, 24, 0.84);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.iex-blocked-card {
  max-width: 560px;
  width: 100%;
  background: rgba(30, 35, 55, 0.95);
  border: 1px solid #4a5478;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.iex-blocked-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px auto;
  border-radius: 50%;
  background: #dc2626;
  color: white;
  display: grid;
  place-items: center;
  font-size: 24px;
  font-weight: 700;
}

.iex-blocked-card h3 {
  margin-bottom: 10px;
  color: #f9fafb;
}

.iex-blocked-card p {
  color: #d1d5db;
  font-size: 12px;
  margin-bottom: 14px;
}

.iex-blocked-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.iex-blocked-actions button {
  border: 1px solid #4b5678;
  background: #1b2338;
  color: #e5e7eb;
  border-radius: 8px;
  height: 30px;
  padding: 0 12px;
  cursor: pointer;
}

.iex-newtab-page {
  width: 100%;
  height: 100%;
  color: #e5e7eb;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.15), transparent 45%),
    radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.18), transparent 50%),
    #090f1d;
  padding: 20px;
  overflow-y: auto;
}

.iex-newtab-clock {
  text-align: right;
  color: #cbd5e1;
  font-size: 14px;
  margin-bottom: 12px;
}

.iex-newtab-search-card {
  margin: 0 auto 18px auto;
  max-width: 620px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(20, 28, 48, 0.6);
  backdrop-filter: blur(6px);
  border-radius: 16px;
  padding: 16px;
}

.iex-newtab-search-card h2 {
  text-align: center;
  margin-bottom: 10px;
}

.iex-newtab-search-card input {
  width: 100%;
  height: 42px;
  border: 1px solid #3f4a68;
  border-radius: 12px;
  background: rgba(8, 12, 24, 0.75);
  color: #f9fafb;
  padding: 0 12px;
  font-size: 13px;
  outline: none;
}

.iex-newtab-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.iex-glass-card {
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(20, 28, 48, 0.58);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  padding: 14px;
}

.iex-glass-card h3 {
  margin-bottom: 10px;
}

.iex-tile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(116px, 1fr));
  gap: 8px;
}

.iex-tile {
  border: 1px solid #404b69;
  border-radius: 10px;
  background: rgba(15, 21, 38, 0.86);
  color: #d1d5db;
  padding: 8px;
  min-height: 88px;
  display: grid;
  place-items: center;
  gap: 4px;
  cursor: pointer;
  text-align: center;
}

.iex-tile img {
  width: 18px;
  height: 18px;
}

.iex-tile span {
  font-size: 11px;
}

.iex-tile small {
  font-size: 10px;
  color: #94a3b8;
}

.iex-bookmark-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.iex-bookmark-row {
  border: 1px solid #404b69;
  border-radius: 8px;
  background: rgba(15, 21, 38, 0.86);
  color: #d1d5db;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  cursor: pointer;
  text-align: left;
}

.iex-bookmark-row img {
  width: 16px;
  height: 16px;
}

.iex-empty {
  color: #94a3b8;
  font-size: 12px;
}

@keyframes iex-loading {
  0% { transform: translateX(0); opacity: 0.3; }
  50% { transform: translateX(140%); opacity: 1; }
  100% { transform: translateX(260%); opacity: 0.3; }
}

@keyframes iex-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .iex-window {
    min-width: 320px;
    min-height: 380px;
  }

  .iex-urlbar-row {
    grid-template-columns: 1fr;
    height: auto;
  }

  .iex-nav-controls,
  .iex-right-controls {
    flex-wrap: wrap;
  }
}
`;

export const displayInternetExplorer = () => <InternetExplorer />;
export default InternetExplorer;
