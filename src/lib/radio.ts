"use client";

import { useEffect, useState } from "react";

const STATION_ID = "sa699f29e3";

// The audio stream still plays from radio.co; only the song info comes from Spinitron.
export const STREAM_URL = `https://s4.radio.co/${STATION_ID}/listen`;
const POLL_INTERVAL_MS = 15_000;

export type NowPlaying = {
  trackTitle: string;
  trackArtist: string;
  album: string;
  artworkSrc: string | null;
};

// Polls our own /api/now-playing route, which gets the latest spin from Spinitron.
export function useNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        if (!res.ok) return;
        const next: NowPlaying | null = await res.json();
        if (!cancelled) setNowPlaying(next);
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