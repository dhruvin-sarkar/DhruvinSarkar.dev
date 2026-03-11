import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UseContext from "../../Context";
import AppWindowShell from "./shared/AppWindowShell";
import { SPOTIFY_STATS_API_URL } from "../../config/backend";
import "./Spotify.css";

const VIEW_OPTIONS = [
  { key: "recentTracks", label: "Recent" },
  { key: "topTracksWeek", label: "Tracks: Week" },
  { key: "topTracksMonth", label: "Tracks: Month" },
  { key: "topTracksAllTime", label: "Tracks: All Time" },
  { key: "topArtistsWeek", label: "Artists: Week" },
  { key: "topArtistsMonth", label: "Artists: Month" },
  { key: "topArtistsAllTime", label: "Artists: All Time" },
  { key: "topAlbumsWeek", label: "Albums: Week" },
  { key: "topAlbumsMonth", label: "Albums: Month" },
  { key: "topAlbumsAllTime", label: "Albums: All Time" },
  { key: "weeklyTrackChart", label: "Weekly Chart" },
  { key: "friends", label: "Friends" },
];

const DEFAULT_VIEW = VIEW_OPTIONS[0];

const normalizeText = (value) => String(value ?? "").trim().toLowerCase();

const formatCount = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toLocaleString() : "0";
};

const formatMemberSince = (value) => {
  if (value == null) return "Unknown";
  const numeric = Number(value);
  const date = Number.isFinite(numeric)
    ? new Date(numeric * 1000)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const buildTrackRows = (items, prefix) =>
  (items ?? []).map((item, index) => {
    const rank = item.rank ?? index + 1;
    const title = item.title ?? "Unknown Track";
    const artist = item.artist ?? "Unknown Artist";
    const album = item.album ?? null;

    return {
      id: `${prefix}-${rank}-${artist}-${title}`,
      type: "track",
      rank,
      title,
      artist,
      primary: `${artist} - ${title}`,
      secondary: album ? `Album: ${album}` : "",
      meta: item.playcount != null ? `${formatCount(item.playcount)} plays` : "",
      image: item.image ?? null,
      album,
      url: item.url ?? null,
    };
  });

const buildArtistRows = (items, prefix) =>
  (items ?? []).map((item, index) => {
    const rank = item.rank ?? index + 1;
    const artist = item.name ?? "Unknown Artist";

    return {
      id: `${prefix}-${rank}-${artist}`,
      type: "artist",
      rank,
      title: artist,
      artist,
      primary: artist,
      secondary: "Artist",
      meta: item.playcount != null ? `${formatCount(item.playcount)} plays` : "",
      image: item.image ?? null,
      url: item.url ?? null,
    };
  });

const buildAlbumRows = (items, prefix) =>
  (items ?? []).map((item, index) => {
    const rank = item.rank ?? index + 1;
    const album = item.name ?? "Unknown Album";
    const artist = item.artist ?? "Unknown Artist";

    return {
      id: `${prefix}-${rank}-${artist}-${album}`,
      type: "album",
      rank,
      title: album,
      artist,
      primary: `${artist} - ${album}`,
      secondary: "Album",
      meta: item.playcount != null ? `${formatCount(item.playcount)} plays` : "",
      image: item.image ?? null,
      url: item.url ?? null,
    };
  });

const buildFriendRows = (items, prefix) =>
  (items ?? []).map((item, index) => {
    const rank = item.rank ?? index + 1;
    const username = item.name ?? "Unknown Friend";

    return {
      id: `${prefix}-${rank}-${username}`,
      type: "friend",
      rank,
      title: username,
      artist: username,
      primary: username,
      secondary: item.realname || item.country || "Last.fm Friend",
      meta:
        item.playcount != null
          ? `${formatCount(item.playcount)} scrobbles`
          : "Scrobbles unavailable",
      image: item.image ?? null,
      url: item.url ?? null,
    };
  });

const resolveRows = (stats, currentView) => {
  if (!stats) {
    return [];
  }

  if (currentView.type === "artist") {
    return buildArtistRows(
      (stats.topArtistsAllTime ?? []).filter(
        (item) => normalizeText(item.name) === normalizeText(currentView.artist)
      ),
      "artist-detail"
    );
  }

  switch (currentView.key) {
    case "recentTracks":
      return buildTrackRows(stats.recentTracks, "recent");
    case "topTracksWeek":
      return buildTrackRows(stats.topTracksWeek, "top-tracks-week");
    case "topTracksMonth":
      return buildTrackRows(stats.topTracksMonth, "top-tracks-month");
    case "topTracksAllTime":
      return buildTrackRows(stats.topTracksAllTime, "top-tracks-all-time");
    case "topArtistsWeek":
      return buildArtistRows(stats.topArtistsWeek, "top-artists-week");
    case "topArtistsMonth":
      return buildArtistRows(stats.topArtistsMonth, "top-artists-month");
    case "topArtistsAllTime":
      return buildArtistRows(stats.topArtistsAllTime, "top-artists-all-time");
    case "topAlbumsWeek":
      return buildAlbumRows(stats.topAlbumsWeek, "top-albums-week");
    case "topAlbumsMonth":
      return buildAlbumRows(stats.topAlbumsMonth, "top-albums-month");
    case "topAlbumsAllTime":
      return buildAlbumRows(stats.topAlbumsAllTime, "top-albums-all-time");
    case "weeklyTrackChart":
      return buildTrackRows(stats.weeklyTrackChart, "weekly-track-chart");
    case "friends":
      return buildFriendRows(stats.friends, "friends");
    default:
      return [];
  }
};

const buildCurrentTrack = (stats) => {
  if (stats?.nowPlaying) {
    return {
      title: stats.nowPlaying.track ?? "Unknown Track",
      artist: stats.nowPlaying.artist ?? "Unknown Artist",
      album: stats.nowPlaying.album ?? "Unknown Album",
      image: stats.nowPlaying.image ?? null,
    };
  }

  const firstRecent = stats?.recentTracks?.[0];
  if (!firstRecent) {
    return null;
  }

  return {
    title: firstRecent.title ?? "Unknown Track",
    artist: firstRecent.artist ?? "Unknown Artist",
    album: firstRecent.album ?? "Unknown Album",
    image: firstRecent.image ?? null,
  };
};

function Spotify() {
  const { SpotifyExpand, setSpotifyExpand } = useContext(UseContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [currentView, setCurrentView] = useState({
    type: "preset",
    key: DEFAULT_VIEW.key,
    label: DEFAULT_VIEW.label,
  });
  const [viewHistory, setViewHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [likedRows, setLikedRows] = useState({});

  useEffect(() => {
    if (SpotifyExpand.show) {
      return;
    }

    setCurrentView({
      type: "preset",
      key: DEFAULT_VIEW.key,
      label: DEFAULT_VIEW.label,
    });
    setViewHistory([]);
    setSelectedId(null);
    setHasFetched(false);
  }, [SpotifyExpand.show]);

  useEffect(() => {
    if (!SpotifyExpand.show || stats || loading || hasFetched) {
      return undefined;
    }

    let ignore = false;

    setHasFetched(true);
    setLoading(true);
    setError("");

    axios
      .get(SPOTIFY_STATS_API_URL, { timeout: 15000 })
      .then((response) => {
        if (ignore) {
          return;
        }

        console.log("Spotify stats raw response:", response.data);
        const payload = response.data?.data ?? response.data ?? null;
        if (!payload || typeof payload !== "object") {
          setError("Unexpected response from Last.fm stats endpoint.");
          setStats(null);
          return;
        }

        setStats(payload);
      })
      .catch((requestError) => {
        if (ignore) {
          return;
        }

        console.error("Spotify stats request failed:", requestError);
        setError(
          requestError.response?.data?.error ||
            requestError.message ||
            "Unable to load Last.fm stats."
        );
        setStats(null);
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [SpotifyExpand.show, stats, loading, hasFetched]);

  const rows = resolveRows(stats, currentView);
  const currentTrack = buildCurrentTrack(stats);
  const user = stats?.user ?? null;
  const totalScrobbles = user?.playcount != null ? formatCount(user.playcount) : "0";
  const selectedRow = rows.find((row) => row.id === selectedId) ?? rows[0] ?? null;

  useEffect(() => {
    if (rows.length === 0) {
      setSelectedId(null);
      return;
    }

    if (!rows.some((row) => row.id === selectedId)) {
      setSelectedId(rows[0].id);
    }
  }, [rows, selectedId]);

  const openView = (nextView, pushHistory = true) => {
    if (pushHistory) {
      setViewHistory((previous) => [...previous, currentView]);
    }

    setCurrentView(nextView);
  };

  const openPresetView = (option) => {
    if (currentView.type === "preset" && currentView.key === option.key) {
      return;
    }

    openView({
      type: "preset",
      key: option.key,
      label: option.label,
    });
  };

  const handleBack = () => {
    setViewHistory((previous) => {
      if (previous.length === 0) {
        return previous;
      }

      const nextView = previous[previous.length - 1];
      setCurrentView(nextView);
      return previous.slice(0, -1);
    });
  };

  const openArtistView = (artistName) => {
    if (!artistName) {
      return;
    }

    openView({
      type: "artist",
      artist: artistName,
      label: `Artist: ${artistName}`,
    });
  };

  const handleRowAction = (row) => {
    if (!row) {
      return;
    }

    if (row.type === "friend" && row.url) {
      window.open(row.url, "_blank", "noopener,noreferrer");
      return;
    }

    openArtistView(row.artist);
  };

  const handleSkip = () => {
    if (rows.length === 0) {
      return;
    }

    const currentIndex = rows.findIndex((row) => row.id === selectedId);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % rows.length : 0;
    setSelectedId(rows[nextIndex].id);
  };

  const handleSearch = () => {
    if (selectedRow?.artist) {
      openArtistView(selectedRow.artist);
    }
  };

  const handleHome = () => {
    openView(
      {
        type: "preset",
        key: DEFAULT_VIEW.key,
        label: DEFAULT_VIEW.label,
      },
      currentView.type !== "preset" || currentView.key !== DEFAULT_VIEW.key
    );
  };

  const handleLike = () => {
    if (!selectedRow) {
      return;
    }

    setLikedRows((previous) => ({
      ...previous,
      [selectedRow.id]: !previous[selectedRow.id],
    }));
  };

  return (
    <AppWindowShell
      title="spotify.exe"
      icon="/spotify.png"
      state={SpotifyExpand}
      setState={setSpotifyExpand}
      stateName="Spotify"
      defaultWidth={520}
      defaultHeight={680}
      defaultPosition={{ x: 180, y: 80 }}
      className="spotify-app"
    >
      <div className="spotify-window">
        <div className="spotify-command-bar">
          <button
            type="button"
            className="spotify-button"
            onClick={handleBack}
            disabled={viewHistory.length === 0}
          >
            Back
          </button>
          <div className="spotify-tabs" role="tablist" aria-label="Spotify stats views">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                role="tab"
                aria-selected={currentView.type === "preset" && currentView.key === option.key}
                className={`spotify-tab ${
                  currentView.type === "preset" && currentView.key === option.key
                    ? "is-active"
                    : ""
                }`}
                onClick={() => openPresetView(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="spotify-body">
          <div className="spotify-hero">
            <div className="spotify-art-frame">
              {currentTrack?.image ? (
                <img
                  src={currentTrack.image}
                  alt={currentTrack.title}
                  className="spotify-art-image"
                />
              ) : (
                <div className="spotify-art-placeholder">No Art</div>
              )}
            </div>

            <div className="spotify-track-heading">
              {currentTrack?.title ?? "No recent track"}
            </div>
            <div className="spotify-track-subheading">
              {currentTrack
                ? `${currentTrack.album || "Unknown Album"} by ${
                    currentTrack.artist || "Unknown Artist"
                  }`
                : "Last.fm stats will appear here once loaded."}
            </div>

            <button
              type="button"
              className="spotify-button spotify-shuffle-button"
              onClick={() => setIsPaused(false)}
            >
              Shuffle play
            </button>

            <fieldset className="spotify-user-group">
              <legend>Last.fm</legend>
              <div className="spotify-user-meta">
                <span>Scrobbles: {totalScrobbles}</span>
                <span>Country: {user?.country || "Unknown"}</span>
                <span>Member since: {formatMemberSince(user?.registered)}</span>
              </div>
            </fieldset>
          </div>

          <div className="spotify-list-panel">
            <div className="spotify-list-header">{currentView.label}</div>
            <div className="spotify-list-body">
              {loading ? (
                <div className="spotify-empty-state">Loading Last.fm stats...</div>
              ) : error ? (
                <div className="spotify-empty-state">{error}</div>
              ) : rows.length === 0 ? (
                <div className="spotify-empty-state">No items available for this view.</div>
              ) : (
                rows.map((row) => (
                  <div
                    key={row.id}
                    className={`spotify-list-row ${
                      selectedRow?.id === row.id ? "is-selected" : ""
                    }`}
                    onClick={() => setSelectedId(row.id)}
                    onDoubleClick={() => handleRowAction(row)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleRowAction(row);
                      }
                    }}
                  >
                    <div className="spotify-row-main">
                      <div className="spotify-row-rank">{row.rank}.</div>
                      <div className="spotify-row-copy">
                        <div className="spotify-row-title">{row.primary}</div>
                        {row.secondary ? (
                          <div className="spotify-row-subtitle">{row.secondary}</div>
                        ) : null}
                        {row.meta ? <div className="spotify-row-meta">{row.meta}</div> : null}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="spotify-button spotify-row-more"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRowAction(row);
                      }}
                    >
                      ...
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="spotify-status-bar">
          <div className="spotify-status-display">
            <span className="spotify-status-caret">{"\u25B6"}</span>
            <span className="spotify-status-text">
              {selectedRow
                ? `${selectedRow.title} - ${selectedRow.artist}`
                : currentTrack
                  ? `${currentTrack.title} - ${currentTrack.artist}`
                  : "Current Track - None"}
            </span>
          </div>
          <span className="spotify-status-separator" aria-hidden="true" />
          <button
            type="button"
            className="spotify-button spotify-status-toggle"
            onClick={() => setIsPaused((previous) => !previous)}
          >
            {isPaused ? ">" : "||"}
          </button>
        </div>

        <div className="spotify-toolbar">
          <button
            type="button"
            className="spotify-button spotify-toolbar-button"
            onClick={handleHome}
            title="Home"
          >
            {"\u2302"}
          </button>
          <button
            type="button"
            className="spotify-button spotify-toolbar-button"
            onClick={handleSkip}
            title="Skip"
          >
            {"\u25B6\u25B6"}
          </button>
          <button
            type="button"
            className="spotify-button spotify-toolbar-button"
            onClick={handleSearch}
            title="Search"
          >
            ?
          </button>
          <button
            type="button"
            className={`spotify-button spotify-toolbar-button ${
              repeatEnabled ? "is-toggled" : ""
            }`}
            onClick={() => setRepeatEnabled((previous) => !previous)}
            title="Repeat"
          >
            {"\u21BA"}
          </button>
          <button
            type="button"
            className={`spotify-button spotify-toolbar-button ${
              selectedRow && likedRows[selectedRow.id] ? "is-toggled" : ""
            }`}
            onClick={handleLike}
            title="Like"
          >
            {"\u2665"}
          </button>
        </div>
      </div>
    </AppWindowShell>
  );
}

export default Spotify;
