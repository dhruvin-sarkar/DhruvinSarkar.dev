import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UseContext from "../../Context";
import AppWindowShell from "./shared/AppWindowShell";
import { SPOTIFY_STATS_API_URL } from "../../config/backend";
import "./Spotify.css";

const VIEW_OPTIONS = [
  { key: "recentTracks", label: "Recent" },
  { key: "topTracksWeek", label: "Top Tracks Week" },
  { key: "topTracksMonth", label: "Top Tracks Month" },
  { key: "topTracksAllTime", label: "Top Tracks All Time" },
  { key: "topArtistsWeek", label: "Top Artists Week" },
  { key: "topArtistsMonth", label: "Top Artists Month" },
  { key: "topArtistsAllTime", label: "Top Artists All Time" },
  { key: "topAlbumsWeek", label: "Top Albums Week" },
  { key: "topAlbumsMonth", label: "Top Albums Month" },
  { key: "topAlbumsAllTime", label: "Top Albums All Time" },
  { key: "weeklyTrackChart", label: "Weekly Chart" },
  { key: "friends", label: "Friends" },
];

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
  (items ?? []).map((item, index) => ({
    id: `${prefix}-${item.rank ?? index + 1}-${item.artist ?? "unknown"}-${item.title ?? "track"}`,
    type: "track",
    rank: item.rank ?? index + 1,
    title: item.title ?? "Unknown Track",
    artist: item.artist ?? "Unknown Artist",
    subtitle: item.artist ?? "Unknown Artist",
    meta: item.playcount != null ? `${formatCount(item.playcount)} plays` : "",
    image: item.image ?? null,
    album: item.album ?? null,
    url: item.url ?? null,
  }));

const buildArtistRows = (items, prefix) =>
  (items ?? []).map((item, index) => ({
    id: `${prefix}-${item.rank ?? index + 1}-${item.name ?? "artist"}`,
    type: "artist",
    rank: item.rank ?? index + 1,
    title: item.name ?? "Unknown Artist",
    artist: item.name ?? "Unknown Artist",
    subtitle: "Artist",
    meta: item.playcount != null ? `${formatCount(item.playcount)} plays` : "",
    image: item.image ?? null,
    url: item.url ?? null,
  }));

const buildAlbumRows = (items, prefix) =>
  (items ?? []).map((item, index) => ({
    id: `${prefix}-${item.rank ?? index + 1}-${item.artist ?? "artist"}-${item.name ?? "album"}`,
    type: "album",
    rank: item.rank ?? index + 1,
    title: item.name ?? "Unknown Album",
    artist: item.artist ?? "Unknown Artist",
    subtitle: item.artist ?? "Unknown Artist",
    meta: item.playcount != null ? `${formatCount(item.playcount)} plays` : "",
    image: item.image ?? null,
    url: item.url ?? null,
  }));

const buildFriendRows = (items, prefix) =>
  (items ?? []).map((item, index) => ({
    id: `${prefix}-${item.rank ?? index + 1}-${item.name ?? "friend"}`,
    type: "friend",
    rank: item.rank ?? index + 1,
    title: item.name ?? "Unknown Friend",
    artist: item.name ?? "Unknown Friend",
    subtitle: item.realname || item.country || "Last.fm Friend",
    meta: item.country || "",
    image: item.image ?? null,
    url: item.url ?? null,
  }));

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState({
    type: "preset",
    key: "recentTracks",
    label: "Recent",
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

    setMenuOpen(false);
    setCurrentView({
      type: "preset",
      key: "recentTracks",
      label: "Recent",
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
      .get(SPOTIFY_STATS_API_URL)
      .then((response) => {
        if (ignore) {
          return;
        }

        setStats(response.data ?? null);
      })
      .catch((requestError) => {
        if (ignore) {
          return;
        }

        setError(requestError.message || "Unable to load Last.fm stats.");
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
    setMenuOpen(false);

    if (pushHistory) {
      setViewHistory((previous) => [...previous, currentView]);
    }

    setCurrentView(nextView);
  };

  const openPresetView = (option) => {
    if (currentView.type === "preset" && currentView.key === option.key) {
      setMenuOpen(false);
      return;
    }

    openView({
      type: "preset",
      key: option.key,
      label: option.label,
    });
  };

  const handleBack = () => {
    setMenuOpen(false);

    setViewHistory((previous) => {
      if (previous.length === 0) {
        return previous;
      }

      const nextView = previous[previous.length - 1];
      setCurrentView(nextView);
      return previous.slice(0, -1);
    });
  };

  const handleSave = () => {
    if (!stats) {
      return;
    }

    const payload = {
      view: currentView,
      user: stats.user,
      rows,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `spotify-${currentView.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
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
      return;
    }

    setMenuOpen((previous) => !previous);
  };

  const handleHome = () => {
    openView(
      {
        type: "preset",
        key: "recentTracks",
        label: "Recent",
      },
      currentView.type !== "preset" || currentView.key !== "recentTracks"
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
      defaultWidth={540}
      defaultHeight={640}
      defaultPosition={{ x: 180, y: 80 }}
      className="spotify-app"
    >
      <div className="spotify-window">
        <div className="spotify-menu-bar">
          <button type="button" className="spotify-menu-button">File</button>
          <button type="button" className="spotify-menu-button">Edit</button>
          <div className="spotify-menu-group">
            <button
              type="button"
              className={`spotify-menu-button ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((previous) => !previous)}
            >
              View
            </button>
            {menuOpen ? (
              <div className="spotify-view-menu">
                {VIEW_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`spotify-view-option ${
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
            ) : null}
          </div>
          <button type="button" className="spotify-menu-button">Options</button>
          <button type="button" className="spotify-menu-button">Help</button>
        </div>

        <div className="spotify-command-bar">
          <button
            type="button"
            className="spotify-button"
            onClick={handleBack}
            disabled={viewHistory.length === 0}
          >
            Back
          </button>

          <div className="spotify-command-actions">
            <button
              type="button"
              className="spotify-button"
              onClick={handleSave}
              disabled={!stats}
            >
              Save
            </button>
            <button
              type="button"
              className="spotify-button spotify-square-button"
              onClick={() => setMenuOpen((previous) => !previous)}
            >
              ...
            </button>
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
                ? `${currentTrack.album || "Unknown Album"} by ${currentTrack.artist || "Unknown Artist"}`
                : "Last.fm stats will appear here once loaded."}
            </div>

            <button
              type="button"
              className="spotify-button spotify-shuffle-button"
              onClick={() => setIsPaused(false)}
            >
              Shuffle play
            </button>

            <div className="spotify-user-meta">
              <span>Scrobbles: {totalScrobbles}</span>
              <span>Country: {user?.country || "Unknown"}</span>
              <span>Member since: {formatMemberSince(user?.registered)}</span>
            </div>
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
                  >
                    <div className="spotify-row-main">
                      <div className="spotify-row-rank">{row.rank}.</div>
                      <div className="spotify-row-copy">
                        <div className="spotify-row-title">{row.title}</div>
                        <div className="spotify-row-subtitle">{row.subtitle}</div>
                        {row.meta ? (
                          <div className="spotify-row-meta">{row.meta}</div>
                        ) : null}
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
          <span className="spotify-status-caret">▶</span>
          <span className="spotify-status-text">
            {selectedRow
              ? `${selectedRow.title} — ${selectedRow.artist}`
              : currentTrack
                ? `${currentTrack.title} — ${currentTrack.artist}`
                : "Current Track — None"}
          </span>
          <button
            type="button"
            className="spotify-button spotify-status-toggle"
            onClick={() => setIsPaused((previous) => !previous)}
          >
            {isPaused ? ">" : "||"}
          </button>
        </div>

        <div className="spotify-toolbar">
          <button type="button" className="spotify-button spotify-toolbar-button" onClick={handleHome}>
            ⌂
          </button>
          <button type="button" className="spotify-button spotify-toolbar-button" onClick={handleSkip}>
            &gt;&gt;|
          </button>
          <button type="button" className="spotify-button spotify-toolbar-button" onClick={handleSearch}>
            ?
          </button>
          <button
            type="button"
            className={`spotify-button spotify-toolbar-button ${repeatEnabled ? "is-toggled" : ""}`}
            onClick={() => setRepeatEnabled((previous) => !previous)}
          >
            R
          </button>
          <button
            type="button"
            className={`spotify-button spotify-toolbar-button ${
              selectedRow && likedRows[selectedRow.id] ? "is-toggled" : ""
            }`}
            onClick={handleLike}
          >
            ♥
          </button>
        </div>
      </div>
    </AppWindowShell>
  );
}

export default Spotify;
