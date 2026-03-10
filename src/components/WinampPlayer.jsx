import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UseContext from "../Context";
import spotifyIcon from "../assets/Spotify.png";
import AppWindowShell from "./apps/shared/AppWindowShell";
import { SPOTIFY_STATS_API_URL } from "../config/backend";
import "./WinampPlayer.css";

const PLAYER_BUTTONS = [
  { key: "prev", label: "<<", title: "Previous" },
  { key: "play", label: ">", title: "Play" },
  { key: "pause", label: "||", title: "Pause" },
  { key: "stop", label: "[]", title: "Stop" },
  { key: "next", label: ">>", title: "Next" },
];

const TAB_CONFIG = [
  { key: "recentTracks", label: "Recent (50)", type: "track" },
  { key: "topTracksWeek", label: "Top Tracks Week (50)", type: "track" },
  { key: "topTracksMonth", label: "Top Tracks Month (50)", type: "track" },
  {
    key: "topTracksAllTime",
    label: "Top Tracks All Time (50)",
    type: "track",
  },
  { key: "topArtistsWeek", label: "Top Artists Week (50)", type: "artist" },
  {
    key: "topArtistsMonth",
    label: "Top Artists Month (50)",
    type: "artist",
  },
  {
    key: "topArtistsAllTime",
    label: "Top Artists All Time (50)",
    type: "artist",
  },
  { key: "topAlbumsWeek", label: "Top Albums Week (50)", type: "album" },
  { key: "topAlbumsMonth", label: "Top Albums Month (50)", type: "album" },
  {
    key: "topAlbumsAllTime",
    label: "Top Albums All Time (50)",
    type: "album",
  },
  { key: "weeklyChart", label: "Weekly Chart", type: "weekly" },
  { key: "friends", label: "Friends", type: "friend" },
];

const EQ_BANDS = ["PRE", "60", "170", "310", "600", "1K", "3K", "6K", "12K", "16K"];

function formatCount(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "--";
  return numeric.toLocaleString();
}

function formatDuration(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return "--:--";
  const minutes = Math.floor(numeric / 60);
  const seconds = numeric % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatElapsed(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return "00:00";
  const minutes = Math.floor(numeric / 60);
  const seconds = numeric % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatMemberSince(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return "--";
  return new Date(numeric * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatListenedAt(value) {
  if (!value) return "NOW";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildWeeklyRows(stats) {
  const sections = [
    {
      title: "TRACKS",
      items: normalizeArray(stats?.weeklyTrackChart),
      type: "track",
    },
    {
      title: "ARTISTS",
      items: normalizeArray(stats?.weeklyArtistChart),
      type: "artist",
    },
    {
      title: "ALBUMS",
      items: normalizeArray(stats?.weeklyAlbumChart),
      type: "album",
    },
  ];

  return sections.flatMap((section) => {
    const rows = section.items.map((item, index) => {
      if (section.type === "track") {
        return {
          kind: "row",
          key: `${section.title}-${index}-${item.artist}-${item.track}`,
          index: item.rank ?? index + 1,
          title: `${item.artist || "Unknown"} - ${item.track || "Untitled"}`,
          meta: item.playcount ? `${formatCount(item.playcount)} plays` : formatDuration(item.duration),
          highlight: false,
        };
      }

      if (section.type === "artist") {
        return {
          kind: "row",
          key: `${section.title}-${index}-${item.artist}`,
          index: item.rank ?? index + 1,
          title: item.artist || "Unknown Artist",
          meta: item.playcount ? `${formatCount(item.playcount)} plays` : "--",
          highlight: false,
        };
      }

      return {
        kind: "row",
        key: `${section.title}-${index}-${item.artist}-${item.album}`,
        index: item.rank ?? index + 1,
        title: `${item.artist || "Unknown"} - ${item.album || "Untitled"}`,
        meta: item.playcount ? `${formatCount(item.playcount)} plays` : "--",
        highlight: false,
      };
    });

    return [{ kind: "section", key: section.title, title: section.title }, ...rows];
  });
}

function buildRowsForTab(tabKey, tabType, stats) {
  const currentArtist = stats?.nowPlaying?.artist || "";
  const currentTrack = stats?.nowPlaying?.track || "";
  const currentAlbum = stats?.nowPlaying?.album || "";

  if (tabType === "weekly") {
    return buildWeeklyRows(stats);
  }

  if (tabType === "friend") {
    return normalizeArray(stats?.friends).map((friend, index) => ({
      kind: "row",
      key: `${friend.name || "friend"}-${index}`,
      index: index + 1,
      title: friend.realname || friend.name || "Unknown Friend",
      subtitle: friend.country || friend.name || "",
      meta: friend.playcount ? `${formatCount(friend.playcount)} plays` : "--",
      highlight: false,
    }));
  }

  return normalizeArray(stats?.[tabKey]).map((item, index) => {
    if (tabType === "artist") {
      return {
        kind: "row",
        key: `${item.artist || "artist"}-${index}`,
        index: item.rank ?? index + 1,
        title: item.artist || "Unknown Artist",
        subtitle: item.url || "",
        meta: item.playcount ? `${formatCount(item.playcount)} plays` : "--",
        highlight: currentArtist && currentArtist === item.artist,
      };
    }

    if (tabType === "album") {
      return {
        kind: "row",
        key: `${item.artist || "artist"}-${item.album || item.name || "album"}-${index}`,
        index: item.rank ?? index + 1,
        title: `${item.artist || "Unknown"} - ${item.album || item.name || "Untitled"}`,
        subtitle: "",
        meta: item.playcount ? `${formatCount(item.playcount)} plays` : "--",
        highlight: currentArtist === item.artist && currentAlbum && currentAlbum === (item.album || item.name),
      };
    }

    if (tabKey === "recentTracks") {
      return {
        kind: "row",
        key: `${item.artist || "artist"}-${item.track || "track"}-${index}`,
        index: index + 1,
        title: `${item.artist || "Unknown"} - ${item.track || "Untitled"}`,
        subtitle: item.album || "",
        meta: item.nowPlaying ? "NOW PLAYING" : formatListenedAt(item.listenedAt || item.date),
        highlight: Boolean(item.nowPlaying),
      };
    }

    return {
      kind: "row",
      key: `${item.artist || "artist"}-${item.track || item.name || "track"}-${index}`,
      index: item.rank ?? index + 1,
      title: `${item.artist || "Unknown"} - ${item.track || item.name || "Untitled"}`,
      subtitle: "",
      meta: item.playcount ? `${formatCount(item.playcount)} plays` : formatDuration(item.duration),
      highlight: currentArtist === item.artist && currentTrack && currentTrack === (item.track || item.name),
    };
  });
}

function WinampPlayer() {
  const { WinampExpand, setWinampExpand } = useContext(UseContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(TAB_CONFIG[0].key);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [volume, setVolume] = useState(72);
  const [balance, setBalance] = useState(0);
  const [elapsed, setElapsed] = useState(68);
  const [eqBands, setEqBands] = useState([7, 2, 5, 3, 7, 4, 6, 8, 4, 7]);
  const [visualizerBars, setVisualizerBars] = useState(() =>
    Array.from({ length: 19 }, () => Math.floor(Math.random() * 90) + 10),
  );

  useEffect(() => {
    if (!WinampExpand.show || stats || loading) return;

    let ignore = false;

    async function loadStats() {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(SPOTIFY_STATS_API_URL);
        if (!ignore) {
          setStats(response.data || {});
        }
      } catch (fetchError) {
        if (!ignore) {
          setError("Unable to load Last.fm stats.");
        }
        console.error("Error loading Last.fm stats:", fetchError);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      ignore = true;
    };
  }, [WinampExpand.show, stats, loading]);

  useEffect(() => {
    if (!WinampExpand.show) return undefined;

    const interval = window.setInterval(() => {
      setVisualizerBars((previous) =>
        previous.map(() => Math.floor(Math.random() * 90) + 10),
      );
    }, 240);

    return () => window.clearInterval(interval);
  }, [WinampExpand.show]);

  useEffect(() => {
    if (!WinampExpand.show) return undefined;

    const interval = window.setInterval(() => {
      setElapsed((previous) => (previous + 1) % 3600);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [WinampExpand.show]);

  const activeTabConfig =
    TAB_CONFIG.find((tab) => tab.key === activeTab) || TAB_CONFIG[0];
  const playlistRows = buildRowsForTab(activeTabConfig.key, activeTabConfig.type, stats);
  const nowPlaying =
    stats?.nowPlaying ||
    normalizeArray(stats?.recentTracks)[0] ||
    null;
  const ledText = nowPlaying
    ? `${nowPlaying.artist || "Unknown"} - ${nowPlaying.track || "Nothing Selected"}`
    : "WINAMP READY :: CONNECT TO LAST.FM";

  const handleRetry = async () => {
    setStats(null);
    setError("");
  };

  return (
    <AppWindowShell
      title="Winamp"
      icon={spotifyIcon}
      state={WinampExpand}
      setState={setWinampExpand}
      stateName="Winamp"
      defaultWidth={1180}
      defaultHeight={620}
      defaultPosition={{ x: 120, y: 70 }}
      className="winamp-app-window"
    >
      <div className="winamp-shell">
        <div className="winamp-player-column">
          <div className="winamp-module-head">WINAMP</div>

          <div className="winamp-led-panel">
            <div className="winamp-led-track">
              <div className="winamp-led-index">1.</div>
              <div className="winamp-led-marquee">
                <span>{ledText}</span>
              </div>
            </div>
            <div className="winamp-led-bottom">
              <div className="winamp-digital-time">{formatElapsed(elapsed)}</div>
              <div className="winamp-led-mini-grid">
                {visualizerBars.slice(0, 8).map((value, index) => (
                  <span key={`led-${index}`} style={{ height: `${8 + value / 4}px` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="winamp-status-strip">
            <span>128 kbps</span>
            <span>44 kHz</span>
            <span>stereo</span>
          </div>

          <div className="winamp-controls">
            <div className="winamp-button-row">
              {PLAYER_BUTTONS.map((button) => (
                <button key={button.key} type="button" className="winamp-control-button" title={button.title}>
                  {button.label}
                </button>
              ))}
            </div>
            <div className="winamp-toggle-row">
              <button
                type="button"
                className={`winamp-mode-button ${shuffleEnabled ? "active" : ""}`}
                onClick={() => setShuffleEnabled((previous) => !previous)}
              >
                SHUFFLE
              </button>
              <button
                type="button"
                className={`winamp-mode-button ${repeatEnabled ? "active" : ""}`}
                onClick={() => setRepeatEnabled((previous) => !previous)}
              >
                REPEAT
              </button>
            </div>
          </div>

          <div className="winamp-slider-group">
            <label>
              <span>VOL</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
              />
            </label>
            <label>
              <span>BAL</span>
              <input
                type="range"
                min="-50"
                max="50"
                value={balance}
                onChange={(event) => setBalance(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="winamp-spectrum-panel">
            {visualizerBars.map((value, index) => (
              <span key={`spectrum-${index}`} style={{ height: `${18 + value / 1.8}px` }} />
            ))}
          </div>

          <div className="winamp-user-panel">
            <div className="winamp-user-row">
              <span>Total scrobbles</span>
              <strong>{formatCount(stats?.user?.playcount)}</strong>
            </div>
            <div className="winamp-user-row">
              <span>Country</span>
              <strong>{stats?.user?.country || "--"}</strong>
            </div>
            <div className="winamp-user-row">
              <span>Member since</span>
              <strong>{formatMemberSince(stats?.user?.registered)}</strong>
            </div>
          </div>
        </div>

        <div className="winamp-eq-column">
          <div className="winamp-module-head">WINAMP EQUALIZER</div>
          <div className="winamp-eq-toolbar">
            <button type="button" className="winamp-eq-button active">ON</button>
            <button type="button" className="winamp-eq-button">AUTO</button>
            <button type="button" className="winamp-eq-button">PRESETS</button>
          </div>

          <div className="winamp-eq-panel">
            <div className="winamp-eq-scale">
              <span>+12db</span>
              <span>0db</span>
              <span>-12db</span>
            </div>
            <div className="winamp-eq-sliders">
              {EQ_BANDS.map((band, index) => (
                <label key={band} className="winamp-eq-band">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    value={eqBands[index]}
                    onChange={(event) =>
                      setEqBands((previous) =>
                        previous.map((value, valueIndex) =>
                          valueIndex === index ? Number(event.target.value) : value,
                        ),
                      )
                    }
                  />
                  <span>{band}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="winamp-playlist-column">
          <div className="winamp-module-head">WINAMP PLAYLIST</div>

          <div className="winamp-tabs">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`winamp-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="winamp-playlist-content">
            {loading ? (
              <div className="winamp-status-card">
                <p>Loading Last.fm data...</p>
              </div>
            ) : error ? (
              <div className="winamp-status-card">
                <p>{error}</p>
                <button type="button" className="winamp-small-button" onClick={handleRetry}>
                  RETRY
                </button>
              </div>
            ) : (
              <div className="winamp-playlist-list">
                {playlistRows.length === 0 ? (
                  <div className="winamp-status-card">
                    <p>No items available.</p>
                  </div>
                ) : (
                  playlistRows.map((row) =>
                    row.kind === "section" ? (
                      <div key={row.key} className="winamp-playlist-section">
                        {row.title}
                      </div>
                    ) : (
                      <div
                        key={row.key}
                        className={`winamp-playlist-row ${row.highlight ? "active" : ""}`}
                      >
                        <span className="winamp-playlist-index">{row.index}</span>
                        <div className="winamp-playlist-copy">
                          <span className="winamp-playlist-title">{row.title}</span>
                          {row.subtitle ? (
                            <span className="winamp-playlist-subtitle">{row.subtitle}</span>
                          ) : null}
                        </div>
                        <span className="winamp-playlist-meta">{row.meta}</span>
                      </div>
                    ),
                  )
                )}
              </div>
            )}
          </div>

          <div className="winamp-playlist-footer">
            <div className="winamp-footer-buttons">
              <button type="button" className="winamp-small-button">ADD</button>
              <button type="button" className="winamp-small-button">REM</button>
              <button type="button" className="winamp-small-button">SEL</button>
              <button type="button" className="winamp-small-button">MISC</button>
            </div>
            <div className="winamp-footer-stats">
              <span>{playlistRows.filter((row) => row.kind === "row").length} items</span>
              <span>{formatCount(stats?.user?.playcount)} scrobbles</span>
            </div>
          </div>
        </div>
      </div>
    </AppWindowShell>
  );
}

export default WinampPlayer;
