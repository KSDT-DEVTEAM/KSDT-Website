"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { STREAM_URL } from "@/lib/radio";
import { loadYouTubeApi, type YouTubePlayer } from "@/lib/youtube";

/** A stream other than the station, e.g. a KSDT Sports game, with what the player bar shows for it. */
export type ExternalStream = {
  url: string;
  title: string;
  subtitle: string;
  /** Plays the audio of a YouTube live embed (`url`) through a hidden player instead of the <audio> element. */
  youtube?: boolean;
};

// A YouTube embed for a channel that isn't live doesn't always report an error, so a stream
// that hasn't started playing by then counts as not live.
const YOUTUBE_START_TIMEOUT_MS = 10_000;

type RadioPlayer = {
  /** What the player is set to: a sports stream, or null for the station. Stays set while paused. */
  stream: ExternalStream | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  /** URL of the YouTube stream that last failed to start because the channel isn't live. Cleared on the next play. */
  notLiveUrl: string | null;
  /** Loads the hidden YouTube player for `url` ahead of time, so a click can start it straight away. */
  prepareYouTube: (url: string) => void;
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

function applyYouTubeVolume(player: YouTubePlayer) {
  const { volume, isMuted } = getVolumeSettings();
  player.setVolume(Math.round(volume * 100));
  if (isMuted) player.mute();
  else player.unMute();
}

// Owns the single <audio> element for the station stream and the KSDT Sports streams, plus the
// hidden YouTube player for streams that come from a YouTube live embed, so only one plays at a
// time. It lives in the root layout, which stays mounted across client-side navigation, so
// playback continues between pages.
export function RadioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [stream, setStream] = useState<ExternalStream | null>(null);
  // The latest stream for player event handlers, which can fire after it has changed.
  const streamRef = useRef<ExternalStream | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { volume, isMuted } = useSyncExternalStore(
    subscribeToVolume,
    getVolumeSettings,
    () => DEFAULT_VOLUME,
  );

  // The YouTube embed only loads once a page asks for it (see prepareYouTube), not on every page.
  const [youtubeUrl, setYouTubeUrl] = useState<string | null>(null);
  const youtubeFrameRef = useRef<HTMLIFrameElement>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  // Set when play is pressed before the YouTube player is ready; it starts once it is.
  const youtubePendingRef = useRef(false);
  const youtubeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [notLiveUrl, setNotLiveUrl] = useState<string | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
    if (youtubePlayerRef.current) applyYouTubeVolume(youtubePlayerRef.current);
  }, [volume, isMuted]);

  useEffect(() => {
    const iframe = youtubeFrameRef.current;
    if (!youtubeUrl || !iframe) return;
    let cancelled = false;

    function markNotLive() {
      clearTimeout(youtubeTimeoutRef.current);
      youtubePlayerRef.current?.pauseVideo();
      setIsPlaying(false);
      setNotLiveUrl(streamRef.current?.url ?? null);
    }

    loadYouTubeApi().then(
      (YT) => {
        if (cancelled) return;
        const player = new YT.Player(iframe, {
          events: {
            onReady: () => {
              if (cancelled) return;
              youtubePlayerRef.current = player;
              applyYouTubeVolume(player);
              if (youtubePendingRef.current) {
                youtubePendingRef.current = false;
                player.playVideo();
              }
            },
            onStateChange: ({ data }) => {
              // Pausing YouTube to switch to another stream reports here late; ignore it then.
              if (cancelled || !streamRef.current?.youtube) return;
              if (data === YT.PlayerState.PLAYING) {
                clearTimeout(youtubeTimeoutRef.current);
                setIsPlaying(true);
              } else if (data === YT.PlayerState.PAUSED || data === YT.PlayerState.ENDED) {
                setIsPlaying(false);
              }
            },
            onError: () => {
              if (!cancelled && streamRef.current?.youtube) markNotLive();
            },
          },
        });
      },
      // The start timeout marks the stream not live if the API never loads.
      () => {},
    );

    return () => {
      cancelled = true;
      youtubePlayerRef.current = null;
    };
  }, [youtubeUrl]);

  function stopYouTube() {
    clearTimeout(youtubeTimeoutRef.current);
    youtubePendingRef.current = false;
    youtubePlayerRef.current?.pauseVideo();
  }

  function stopAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    // Drop the buffered stream so resuming jumps back to the live broadcast.
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }

  function stop() {
    if (streamRef.current?.youtube) stopYouTube();
    else stopAudio();
    setIsPlaying(false);
  }

  function playYouTube(url: string) {
    stopAudio();
    setIsPlaying(true);
    clearTimeout(youtubeTimeoutRef.current);
    youtubeTimeoutRef.current = setTimeout(() => {
      youtubePendingRef.current = false;
      youtubePlayerRef.current?.pauseVideo();
      setIsPlaying(false);
      setNotLiveUrl(url);
    }, YOUTUBE_START_TIMEOUT_MS);

    if (youtubeUrl === url && youtubePlayerRef.current) {
      youtubePlayerRef.current.playVideo();
    } else {
      youtubePendingRef.current = true;
      setYouTubeUrl(url);
    }
  }

  async function play(next: ExternalStream | null) {
    // Set first so the old player's late events are ignored.
    streamRef.current = next;
    setStream(next);
    setNotLiveUrl(null);
    if (next?.youtube) return playYouTube(next.url);

    stopYouTube();
    const audio = audioRef.current;
    if (!audio) return;
    const url = next?.url ?? STREAM_URL;
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
        notLiveUrl,
        prepareYouTube: (url) => setYouTubeUrl((current) => current ?? url),
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
      {/* Stopping the audio to switch to YouTube fires its events late; ignore them then. */}
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => !streamRef.current?.youtube && setIsPlaying(true)}
        onPause={() => !streamRef.current?.youtube && setIsPlaying(false)}
        onError={() => !streamRef.current?.youtube && setIsPlaying(false)}
      />
      {/* YouTube embeds have no audio-only mode, so the player is invisible instead. It stays
          200×200 and inside the viewport, since hidden or tiny players can be blocked from playing. */}
      {youtubeUrl && (
        <iframe
          key={youtubeUrl}
          ref={youtubeFrameRef}
          src={youtubeUrl}
          title="KSDT Sports live audio"
          allow="autoplay; encrypted-media"
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none fixed right-0 bottom-0 size-[200px] border-0 opacity-0"
        />
      )}
    </RadioPlayerContext.Provider>
  );
}

export function useRadioPlayer() {
  const player = useContext(RadioPlayerContext);
  if (!player) throw new Error("useRadioPlayer must be used inside RadioPlayerProvider");
  return player;
}
