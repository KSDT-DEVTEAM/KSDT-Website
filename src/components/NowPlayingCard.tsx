"use client";

import Image from "next/image";
import { useState } from "react";
import { nowPlaying } from "@/lib/placeholder-data";

export function NowPlayingCard() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="px-4 pt-6">
      <div className="relative aspect-square w-full overflow-hidden rounded-t-[25px] border border-white">
        <Image
          src={nowPlaying.artworkSrc}
          alt={`${nowPlaying.trackTitle} artwork`}
          fill
          className="object-cover"
          sizes="(min-width: 448px) 402px, 100vw"
        />
        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={() => setIsPlaying((value) => !value)}
          className="absolute left-1/2 top-1/2 h-[55px] w-[45px] -translate-x-1/2 -translate-y-1/2"
        >
          <Image src="/images/play-button.svg" alt="" fill />
        </button>
      </div>

      <div className="rounded-b-[25px] border border-t-0 border-white px-4 py-4">
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
    </section>
  );
}
