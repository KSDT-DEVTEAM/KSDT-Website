"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { liveShow } from "@/lib/placeholder-data";

// Mini player pinned to the bottom of the screen on every page except the homepage,
// which has the full player. The `data-streaming-bar` attribute reserves room for it
// at the bottom of the page (see globals.css).
export function StreamingBar() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (pathname === "/" || dismissed) return null;

  return (
    <div
      data-streaming-bar
      className="fixed inset-x-0 bottom-0 z-40 h-[69px] bg-black lg:h-[72px]"
    >
      <div className="flex h-full items-center bg-[rgba(255,141,202,0.4)] px-4 lg:px-8">
        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          aria-pressed={isPlaying}
          onClick={() => setIsPlaying((value) => !value)}
          className="shrink-0"
        >
          <Image src="/images/stream-play.svg" alt="" width={24} height={24} className="lg:hidden" />
          <Image
            src="/images/stream-play-desktop.svg"
            alt=""
            width={19}
            height={24}
            className="hidden lg:block"
          />
        </button>
        <button
          type="button"
          aria-label={isMuted ? "Unmute" : "Mute"}
          aria-pressed={isMuted}
          onClick={() => setIsMuted((value) => !value)}
          className="ml-1 shrink-0 lg:ml-2.5"
        >
          <Image src="/images/stream-volume.svg" alt="" width={24} height={24} className="lg:hidden" />
          <Image src="/images/volume.svg" alt="" width={24} height={24} className="hidden lg:block" />
        </button>

        <div className="ml-2 flex min-w-0 flex-1 flex-col gap-[3px] text-base/[normal] lg:ml-6 lg:gap-0 lg:text-lg/[normal]">
          <p className="truncate font-bold">{liveShow.title}</p>
          <p className="truncate font-light">{liveShow.hosts}</p>
        </div>

        <button
          type="button"
          aria-label="Close player"
          onClick={() => setDismissed(true)}
          className="ml-4 flex size-4 shrink-0 items-center justify-center lg:size-6"
        >
          <Image src="/images/stream-close.svg" alt="" width={14} height={14} className="lg:hidden" />
          <Image
            src="/images/stream-close-desktop.svg"
            alt=""
            width={21}
            height={21}
            className="hidden lg:block"
          />
        </button>
      </div>
    </div>
  );
}
