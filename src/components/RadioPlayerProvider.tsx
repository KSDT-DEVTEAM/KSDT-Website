"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { STREAM_URL } from "@/lib/radio";

/** A stream other than the station, e.g. a KSDT Sports game, with what the player bar shows for it. */
export type ExternalStream = {
  url: string;
  title: string;
  subtitle: string;
};

type RadioPlayer = {
  /** What the player is set to: a sports stream, or null for the station. Stays set while paused. */
  stream: ExternalStream | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  /** Plays or pauses whatever the player is set to. */
  togglePlay: () => void;
  /** Plays `stream` (null for the station), or pauses it if it's already the one playing. */
  toggleStream: (stream: ExternalStream | null) => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
};

const RadioPlayerContext = createContext<RadioPlayer | null>(null);

type VolumeSettings = { volume: number; isMuted: boolean };

const VOLUME_STORAGE_KEY = "ksdt-player-volume";
const DEFAULT_VOLUME: VolumeSettings = { volume: 0.8, isMuted: false };

// Volume and mute are saved per browser so they carry across page loads.
// Kept outside React and read with useSyncExternalStore so the server render
// uses the default and the browser picks up the saved value without a mismatch.
let volumeSettings: VolumeSettings | null = null;
const volumeListeners = new Set<() => void>();

function getVolumeSettings() {
  if (!volumeSettings) {
    volumeSettings = DEFAULT_VOLUME;
    try {
      const saved = JSON.parse(localStorage.getItem(VOLUME_STORAGE_KEY) ?? "null");
      if (typeof saved?.volume === "number" && typeof saved?.isMuted === "boolean") {
        volumeSettings = saved;
      }
    } catch {
      // Storage can be unavailable (private browsing, blocked cookies); use the default.
    }
  }
  return volumeSettings!;
}

function saveVolumeSettings(next: VolumeSettings) {
  volumeSettings = next;
  try {
    localStorage.setItem(VOLUME_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Still applies for this visit even if it can't be saved.
  }
  volumeListeners.forEach((listener) => listener());
}

function subscribeToVolume(listener: () => void) {
  volumeListeners.add(listener);
  return () => volumeListeners.delete(listener);
}

// Owns the single <audio> element for the station stream and the KSDT Sports streams, so only
// one plays at a time. It lives in the root layout, which stays mounted across client-side
// navigation, so playback continues between pages.
export function RadioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [stream, setStream] = useState<ExternalStream | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { volume, isMuted } = useSyncExternalStore(
    subscribeToVolume,
    getVolumeSettings,
    () => DEFAULT_VOLUME,
  );

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted]);

  function stop() {
    const audio = audioRef.current;
    if (!audio) return;
    // Drop the buffered stream so resuming jumps back to the live broadcast.
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setIsPlaying(false);
  }

  async function play(next: ExternalStream | null) {
    const audio = audioRef.current;
    if (!audio) return;
    const url = next?.url ?? STREAM_URL;
    setStream(next);
    audio.src = url;
    audio.volume = volume;
    setIsPlaying(true);
    try {
      await audio.play();
    } catch {
      // Ignore failures from a stream that's already been switched away from.
      if (audio.src === url) setIsPlaying(false);
    }
  }

  function togglePlay() {
    if (isPlaying) stop();
    else play(stream);
  }

  function toggleStream(next: ExternalStream | null) {
    if (isPlaying && stream?.url === next?.url) stop();
    else play(next);
  }

  return (
    <RadioPlayerContext.Provider
      value={{
        stream,
        isPlaying,
        // Sliders show 0 while muted, matching what the listener hears.
        volume: isMuted ? 0 : volume,
        isMuted,
        togglePlay,
        toggleStream,
        stop,
        // Dragging a slider unmutes, the way most players behave.
        setVolume: (next) => saveVolumeSettings({ volume: next, isMuted: false }),
        toggleMute: () => saveVolumeSettings({ volume, isMuted: !isMuted }),
      }}
    >
      {children}
      {/* Switching streams can fire a late "pause" for the old one; the "play" after it sets this back. */}
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
    </RadioPlayerContext.Provider>
  );
}

export function useRadioPlayer() {
  const player = useContext(RadioPlayerContext);
  if (!player) throw new Error("useRadioPlayer must be used inside RadioPlayerProvider");
  return player;
}
