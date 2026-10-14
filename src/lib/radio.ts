"use client";

import { useEffect, useState } from "react";

const STATION_ID = "sa699f29e3";

export const STREAM_URL = `https://s4.radio.co/${STATION_ID}/listen`;
const STATUS_URL = `https://public.radio.co/stations/${STATION_ID}/status`;
const POLL_INTERVAL_MS = 15_000;

export type NowPlaying = {
  trackTitle: string;
  trackArtist: string;
  artworkSrc: string | null;
  // When the current track began, used to show elapsed time. Null during a live DJ set.
  startedAt: Date | null;
};

type StationStatus = {
  current_track: {
    title: string;
    start_time: string;
    artwork_url: string | null;
    artwork_url_large: string | null;
  } | null;
  collaborators: { name: string; status: string }[];
};

// Radio.co reports the track as a single "Artist - Title" string.
function parseStatus(status: StationStatus): NowPlaying {
  const track = status.current_track;
  if (!track) {
    // Live broadcasts from Radio.co Studio don't carry track metadata.
    const dj = status.collaborators.find((c) => c.status === "streaming");
    return {
      trackTitle: "Live on KSDT",
      trackArtist: dj?.name ?? "KSDT Radio",
      artworkSrc: null,
      startedAt: null,
    };
  }

  const separator = track.title.indexOf(" - ");
  return {
    trackTitle: separator === -1 ? track.title : track.title.slice(separator + 3),
    trackArtist: separator === -1 ? "" : track.title.slice(0, separator),
    artworkSrc: track.artwork_url_large ?? track.artwork_url,
    startedAt: new Date(track.start_time),
  };
}

// Polls the station's public status endpoint for the current track.
export function useNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(STATUS_URL, { cache: "no-store" });
        if (!res.ok) return;
        const status: StationStatus = await res.json();
        if (!cancelled) setNowPlaying(parseStatus(status));
      } catch {
        // Keep showing the last known track if a poll fails.
      }
    }

    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return nowPlaying;
}
