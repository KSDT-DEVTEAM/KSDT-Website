"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRadioPlayer } from "@/components/RadioPlayerProvider";
import { Slider } from "@/components/Slider";
import { formatShowTitle, useCurrentShow } from "@/lib/use-current-show";
import { slotMinutes } from "@/lib/schedule-data";

const SHOW_LENGTH_SECONDS = 60 * 60;

function formatClock(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
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
  const { isPlaying, volume, nowPlaying, togglePlay, setVolume } = useRadioPlayer();
  const now = useNow();

  const currentShow = useCurrentShow();

  // Radio.co's track info when it has some, otherwise the scheduled show.
  const trackTitle = nowPlaying?.trackTitle ?? formatShowTitle(currentShow);
  const trackArtist = nowPlaying?.trackArtist ?? currentShow?.slot.dj ?? "";
  const artworkSrc = nowPlaying?.artworkSrc;

  // How far into the hour-long show we are, counted on the visitor's clock (slot times are
  // already local). Null when nothing is on air.
  let showElapsed: number | null = null;
  if (currentShow?.live) {
    const date = new Date(now);
    const secondsIntoDay = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    const start = slotMinutes(currentShow.slot.start) * 60;
    // The show lookup refreshes every 30s, so clamp the moment a new hour starts.
    showElapsed = Math.min(Math.max(secondsIntoDay - start, 0), SHOW_LENGTH_SECONDS);
  }

  return (
    <section className="px-4 pt-6 lg:mx-8 lg:flex lg:px-0 lg:pt-[72px]">
      <button
        type="button"
        aria-label={isPlaying ? "Pause live stream" : "Play live stream"}
        aria-pressed={isPlaying}
        onClick={togglePlay}
        className="relative block aspect-square w-full cursor-pointer overflow-hidden rounded-t-[25px] border border-white lg:w-[234px] lg:shrink-0 lg:rounded-none lg:border-2 lg:border-r-0"
      >
        {/* Left blank until Radio.co sends artwork for the current track. */}
        {artworkSrc && (
          <Image
            src={artworkSrc}
            alt={`${trackTitle} artwork`}
            fill
            // Radio.co artwork comes from several hosts, so skip the optimizer for it.
            unoptimized
            className="object-cover"
            sizes="(min-width: 1024px) 234px, (min-width: 448px) 402px, 100vw"
          />
        )}
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
          {showElapsed !== null && <span className="text-base tabular-nums">{formatClock(showElapsed)}</span>}
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

        {/* Counts through the current hour-long show; Radio.co doesn't report track lengths. */}
        <div className="flex items-center gap-3 tabular-nums">
          {showElapsed !== null && <span>{formatClock(showElapsed)}</span>}
          <Slider value={(showElapsed ?? 0) / SHOW_LENGTH_SECONDS} className="h-[5px] flex-1" {...desktopSlider} />
          {showElapsed !== null && <span>{formatClock(SHOW_LENGTH_SECONDS)}</span>}
        </div>
      </div>
    </section>
  );
}
