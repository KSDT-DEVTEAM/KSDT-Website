// The parts of the YouTube IFrame Player API the site uses, for playing a channel's live stream
// as audio (see RadioPlayerProvider). https://developers.google.com/youtube/iframe_api_reference

export type YouTubePlayer = {
  playVideo(): void;
  pauseVideo(): void;
  /** 0–100. */
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
};

type YouTubePlayerEvents = {
  onReady?: () => void;
  onStateChange?: (event: { data: number }) => void;
  onError?: (event: { data: number }) => void;
};

type YouTubeApi = {
  Player: new (iframe: HTMLIFrameElement, options: { events: YouTubePlayerEvents }) => YouTubePlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YouTubeApi> | null = null;

/** Loads the IFrame API script once and resolves when it's ready. */
export function loadYouTubeApi() {
  apiPromise ??= new Promise((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT);
    // The script calls this global when it's ready, so it has to exist before the script loads.
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("Couldn't load the YouTube IFrame API"));
    };
    document.head.append(script);
  });
  return apiPromise;
}

/** Embed URL that always plays whatever `channelId` (the UC… ID, not the @handle) is streaming live. */
export function youtubeLiveEmbedUrl(channelId: string) {
  return `https://www.youtube.com/embed/live_stream?channel=${channelId}&enablejsapi=1&playsinline=1`;
}
