"use client";

import Image from "next/image";
import { useState } from "react";
import { nowPlaying } from "@/lib/placeholder-data";

// Placeholder volume level until the player is wired to real audio.
const volume = 0.43;

function formatElapsed(duration: string, progress: number) {
  const [minutes, seconds] = duration.split(":").map(Number);
  const elapsed = Math.floor((minutes * 60 + seconds) * progress);
  return `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
}

function DesktopSlider({ value, className }: { value: number; className: string }) {
  return (
    <div className={`relative h-[5px] ${className}`}>
      <div className="absolute inset-0 rounded-full bg-white" />
      <div
        className="absolute left-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-ksdt-blue"
        style={{ width: `${value * 100}%` }}
      />
      <div
        className="absolute top-1/2 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ksdt-blue bg-[#d9d9d9]"
        style={{ left: `${value * 100}%` }}
      />
    </div>
  );
}

export function NowPlayingCard() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="px-4 pt-6 lg:mx-8 lg:flex lg:px-0 lg:pt-[72px]">
      <div className="relative aspect-square w-full overflow-hidden rounded-t-[25px] border border-white lg:w-[234px] lg:shrink-0 lg:rounded-none lg:border-2 lg:border-r-0">
        <Image
          src={nowPlaying.artworkSrc}
          alt={`${nowPlaying.trackTitle} artwork`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 234px, (min-width: 448px) 402px, 100vw"
        />
        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={() => setIsPlaying((value) => !value)}
          className="absolute left-1/2 top-1/2 h-[55px] w-[45px] -translate-x-1/2 -translate-y-1/2 lg:h-[45px] lg:w-[37px]"
        >
          <Image src="/images/play-button.svg" alt="" fill className="lg:hidden" />
          {/* Desktop icon carries a drop shadow, so the SVG extends past the button's box. */}
          <span className="absolute inset-[-20%_-35.14%_-37.78%_-35.14%] hidden lg:block">
            <Image src="/images/play-button-shadow.svg" alt="" width={63} height={71} className="size-full" />
          </span>
        </button>
      </div>

      <div className="rounded-b-[25px] border border-t-0 border-white px-4 py-4 lg:hidden">
        <p className="text-lg font-medium">{nowPlaying.trackTitle}</p>
        <p className="text-lg">{nowPlaying.trackArtist}</p>

        <div className="mt-4 flex items-center gap-3">
          <Image src="/images/sound-on.svg" alt="Sound on" width={24} height={26} />
          <div className="relative h-[2px] flex-1">
            <div className="absolute inset-0 rounded-full bg-white/30" />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${nowPlaying.progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 h-[10px] w-[10px] -translate-y-1/2 -translate-x-1/2 rounded-full bg-white"
              style={{ left: `${nowPlaying.progress * 100}%` }}
            />
          </div>
          <span className="text-base tabular-nums">{nowPlaying.duration}</span>
        </div>
      </div>

      <div className="hidden flex-1 flex-col justify-between border-2 border-white p-8 text-2xl/[normal] lg:flex">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="font-bold">{nowPlaying.trackTitle}</p>
            <p className="mt-1">{nowPlaying.trackArtist}</p>
          </div>
          <div className="flex shrink-0 items-center gap-4 pt-2">
            <Image src="/images/volume.svg" alt="Volume" width={24} height={24} />
            <DesktopSlider value={volume} className="w-[117px]" />
          </div>
        </div>

        <div className="flex items-center gap-3 tabular-nums">
          <span>{formatElapsed(nowPlaying.duration, nowPlaying.progress)}</span>
          <DesktopSlider value={nowPlaying.progress} className="flex-1" />
          <span>{nowPlaying.duration}</span>
        </div>
      </div>
    </section>
  );
}
