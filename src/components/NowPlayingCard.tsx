"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { nowPlaying as placeholder } from "@/lib/placeholder-data";
import { STREAM_URL, useNowPlaying } from "@/lib/radio";

function formatElapsed(since: Date, now: number) {
  const elapsed = Math.max(0, Math.floor((now - since.getTime()) / 1000));
  return `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
}

// Ticks once a second so elapsed time stays current.
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// Draws the bar; an invisible range input on top handles dragging and keyboard input.
function Slider({
  value,
  onChange,
  label,
  className,
  trackClassName,
  fillClassName,
  thumbClassName,
}: {
  value: number;
  onChange?: (value: number) => void;
  label?: string;
  className: string;
  trackClassName: string;
  fillClassName: string;
  thumbClassName: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 rounded-full ${trackClassName}`} />
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full ${fillClassName}`}
        style={{ width: `${value * 100}%` }}
      />
      <div
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${thumbClassName}`}
        style={{ left: `${value * 100}%` }}
      />
      {onChange && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          aria-label={label}
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2 cursor-pointer appearance-none opacity-0"
        />
      )}
    </div>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 51 61" fill="none" className={className} aria-hidden>
      <rect x="6" y="5" width="11" height="51" rx="3" stroke="white" strokeWidth="6" />
      <rect x="34" y="5" width="11" height="51" rx="3" stroke="white" strokeWidth="6" />
    </svg>
  );
}

const desktopSlider = {
  trackClassName: "bg-white",
  fillClassName: "h-[6px] bg-ksdt-blue",
  thumbClassName: "h-[15px] w-[15px] border border-ksdt-blue bg-[#d9d9d9]",
};

export function NowPlayingCard() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const nowPlaying = useNowPlaying();
  const now = useNow();

  const trackTitle = nowPlaying?.trackTitle ?? placeholder.trackTitle;
  const trackArtist = nowPlaying?.trackArtist ?? placeholder.trackArtist;
  const artworkSrc = nowPlaying?.artworkSrc ?? placeholder.artworkSrc;
  const elapsed = nowPlaying?.startedAt ? formatElapsed(nowPlaying.startedAt, now) : null;

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Drop the buffered stream so resuming jumps back to the live broadcast.
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setIsPlaying(false);
      return;
    }

    audio.src = STREAM_URL;
    audio.volume = volume;
    setIsPlaying(true);
    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <section className="px-4 pt-6 lg:mx-8 lg:flex lg:px-0 lg:pt-[72px]">
      <audio ref={audioRef} preload="none" onPause={() => setIsPlaying(false)} />

      <button
        type="button"
        aria-label={isPlaying ? "Pause live stream" : "Play live stream"}
        aria-pressed={isPlaying}
        onClick={togglePlay}
        className="relative block aspect-square w-full cursor-pointer overflow-hidden rounded-t-[25px] border border-white lg:w-[234px] lg:shrink-0 lg:rounded-none lg:border-2 lg:border-r-0"
      >
        <Image
          src={artworkSrc}
          alt={`${trackTitle} artwork`}
          fill
          // Radio.co artwork comes from several hosts, so skip the optimizer for it.
          unoptimized={artworkSrc.startsWith("http")}
          className="object-cover"
          sizes="(min-width: 1024px) 234px, (min-width: 448px) 402px, 100vw"
        />
        <span className="absolute left-1/2 top-1/2 h-[55px] w-[45px] -translate-x-1/2 -translate-y-1/2 lg:h-[45px] lg:w-[37px]">
          {isPlaying ? (
            <PauseIcon className="size-full drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)]" />
          ) : (
            <>
              <Image src="/images/play-button.svg" alt="" fill className="lg:hidden" />
              {/* Desktop icon carries a drop shadow, so the SVG extends past the button's box. */}
              <span className="absolute inset-[-20%_-35.14%_-37.78%_-35.14%] hidden lg:block">
                <Image src="/images/play-button-shadow.svg" alt="" width={63} height={71} className="size-full" />
              </span>
            </>
          )}
        </span>
      </button>

      <div className="rounded-b-[25px] border border-t-0 border-white px-4 py-4 lg:hidden">
        <p className="text-lg font-medium">{trackTitle}</p>
        <p className="text-lg">{trackArtist}</p>

        <div className="mt-4 flex items-center gap-3">
          <Image src="/images/sound-on.svg" alt="Volume" width={24} height={26} />
          <Slider
            value={volume}
            onChange={setVolume}
            label="Volume"
            className="h-[2px] flex-1"
            trackClassName="bg-white/30"
            fillClassName="h-full bg-white"
            thumbClassName="h-[10px] w-[10px] bg-white"
          />
          <span className="text-base tabular-nums">{elapsed ?? "LIVE"}</span>
        </div>
      </div>

      <div className="hidden flex-1 flex-col justify-between border-2 border-white p-8 text-2xl/[normal] lg:flex">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="font-bold">{trackTitle}</p>
            <p className="mt-1">{trackArtist}</p>
          </div>
          <div className="flex shrink-0 items-center gap-4 pt-2">
            <Image src="/images/volume.svg" alt="Volume" width={24} height={24} />
            <Slider value={volume} onChange={setVolume} label="Volume" className="h-[5px] w-[117px]" {...desktopSlider} />
          </div>
        </div>

        {/* Radio.co doesn't report track length, so the bar marks the live stream instead of progress. */}
        <div className="flex items-center gap-3 tabular-nums">
          {elapsed && <span>{elapsed}</span>}
          <Slider value={1} className="h-[5px] flex-1" {...desktopSlider} />
          <span>LIVE</span>
        </div>
      </div>
    </section>
  );
}
