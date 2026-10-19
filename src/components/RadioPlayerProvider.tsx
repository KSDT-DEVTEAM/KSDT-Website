"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { STREAM_URL } from "@/lib/radio";

type RadioPlayer = {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  togglePlay: () => void;
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

// Owns the single <audio> element for the live stream. It lives in the root layout,
// which stays mounted across client-side navigation, so playback continues between pages.
export function RadioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
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

  async function play() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = STREAM_URL;
    audio.volume = volume;
    setIsPlaying(true);
    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  }

  function togglePlay() {
    if (isPlaying) stop();
    else play();
  }

  return (
    <RadioPlayerContext.Provider
      value={{
        isPlaying,
        // Sliders show 0 while muted, matching what the listener hears.
        volume: isMuted ? 0 : volume,
        isMuted,
        togglePlay,
        stop,
        // Dragging a slider unmutes, the way most players behave.
        setVolume: (next) => saveVolumeSettings({ volume: next, isMuted: false }),
        toggleMute: () => saveVolumeSettings({ volume, isMuted: !isMuted }),
      }}
    >
      {children}
      <audio ref={audioRef} preload="none" onPause={() => setIsPlaying(false)} />
    </RadioPlayerContext.Provider>
  );
}

export function useRadioPlayer() {
  const player = useContext(RadioPlayerContext);
  if (!player) throw new Error("useRadioPlayer must be used inside RadioPlayerProvider");
  return player;
}
