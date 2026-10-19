"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRadioPlayer } from "@/components/RadioPlayerProvider";
import { Slider } from "@/components/Slider";
import { formatShowTitle, useCurrentShow } from "@/lib/use-current-show";

// Mini player pinned to the bottom of the screen on every page except the homepage,
// which has the full player. Both control the same shared stream (see RadioPlayerProvider).
// The `data-streaming-bar` attribute reserves room for it at the bottom of the page
// (see globals.css).
export function StreamingBar() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume } = useRadioPlayer();
  const currentShow = useCurrentShow();
  // Radio.co's track info lags behind during live sets, so show the scheduled show and DJ.
  const title = formatShowTitle(currentShow);
  const subtitle = currentShow?.slot.dj ?? "";

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
          onClick={togglePlay}
          className="shrink-0"
        >
          {isPlaying ? (
            <PauseIcon />
          ) : (
            <>
              <Image src="/images/stream-play.svg" alt="" width={24} height={24} className="lg:hidden" />
              <Image
                src="/images/stream-play-desktop.svg"
                alt=""
                width={19}
                height={24}
                className="hidden lg:block"
              />
            </>
          )}
        </button>
        {/* The volume slider slides out while the speaker is hovered or focused. Touch screens
            have no hover, so it stays open there. */}
        <div className="group ml-1 flex shrink-0 items-center lg:ml-2.5">
          <button
            type="button"
            aria-label={isMuted ? "Unmute" : "Mute"}
            aria-pressed={isMuted}
            onClick={toggleMute}
            className="shrink-0"
          >
            <Image src="/images/stream-volume.svg" alt="" width={24} height={24} className="lg:hidden" />
            <Image src="/images/volume.svg" alt="" width={24} height={24} className="hidden lg:block" />
          </button>
          <div className="flex h-6 w-0 items-center overflow-hidden opacity-0 transition-all duration-200 group-hover:w-[88px] group-hover:opacity-100 group-focus-within:w-[88px] group-focus-within:opacity-100 lg:group-hover:w-[141px] lg:group-focus-within:w-[141px] [@media(hover:none)]:w-[88px] [@media(hover:none)]:opacity-100">
            <Slider
              value={volume}
              onChange={setVolume}
              label="Volume"
              className="mx-3 h-[3px] w-16 shrink-0 lg:h-[5px] lg:w-[117px]"
              trackClassName="bg-white/40"
              fillClassName="h-full bg-white"
              thumbClassName="size-[10px] bg-white lg:size-[13px]"
            />
          </div>
        </div>

        <div className="ml-2 flex min-w-0 flex-1 flex-col gap-[3px] text-base/[normal] lg:ml-6 lg:gap-0 lg:text-lg/[normal]">
          <p className="truncate font-bold">{title}</p>
          {subtitle && <p className="truncate font-light">{subtitle}</p>}
        </div>

        <button
          type="button"
          aria-label="Close player"
          // Only hides the bar; whatever is playing keeps playing.
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

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="size-6" aria-hidden>
      <rect x="5" y="4" width="5" height="16" />
      <rect x="14" y="4" width="5" height="16" />
    </svg>
  );
}
