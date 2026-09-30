"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { SportsStream } from "@/lib/sports-data";

export function Broadcasters({ names, className = "" }: { names: string[]; className?: string }) {
  const [last, ...rest] = [...names].reverse();
  const lines = rest.length ? [`${rest.reverse().join(", ")} &`, last] : [last];

  return (
    <p className={`text-right text-[length:calc(7*var(--u))] lg:text-[15px]/[normal] ${className}`}>
      <span className="block text-[#808080]">Broadcasted by</span>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}

function StatusPill({ live }: { live: boolean }) {
  return (
    <span
      className={`flex h-[calc(19.25*var(--u))] shrink-0 items-center gap-[calc(7*var(--u))] rounded-[calc(14*var(--u))] border-[0.465px] pr-[calc(10*var(--u))] pl-[calc(7.5*var(--u))] text-[length:calc(7.44*var(--u))] lg:h-[35px] lg:gap-[13px] lg:rounded-[30px] lg:border lg:pr-4 lg:text-[16px]/[normal] ${
        live
          ? "border-[#f50000] bg-[rgba(255,0,0,0.5)] lg:pl-[14px]"
          : "border-[#808080] bg-[rgba(82,82,82,0.5)] lg:pl-[17px]"
      }`}
    >
      <Image
        src={live ? "/images/sports-live-dot.svg" : "/images/sports-offline-dot.svg"}
        alt=""
        width={8.07241}
        height={8.25}
        className="h-[calc(8.25*var(--u))] w-[calc(8.07*var(--u))] lg:size-[15px]"
      />
      {live ? "LIVE" : "OFFLINE"}
    </span>
  );
}

// Mobile sizes use `--u` (one design pixel, scaled to the column width) from the Sports page.
export function SportsStreamCard({ stream }: { stream: SportsStream }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const canPlay = stream.live && Boolean(stream.streamUrl);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !stream.streamUrl) return;

    if (playing) {
      // Drop the source instead of just pausing, so the live feed stops downloading
      // and pressing play again rejoins the broadcast live rather than where it paused.
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setPlaying(false);
      return;
    }

    audio.src = stream.streamUrl;
    setPlaying(true);
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  };

  return (
    <article className="flex aspect-square w-full flex-col rounded-[calc(18.6*var(--u))] border-[0.465px] border-[rgba(204,204,204,0.5)] bg-[rgba(0,17,43,0.2)] pt-[calc(12.65*var(--u))] pr-[calc(20*var(--u))] pb-[calc(20*var(--u))] pl-[calc(21.5*var(--u))] lg:aspect-auto lg:min-h-[500px] lg:rounded-[40px] lg:border lg:pt-[22px] lg:pr-[37px] lg:pb-10 lg:pl-10">
      <div className="flex items-center justify-between gap-[calc(8*var(--u))] lg:gap-2">
        <h2 className="text-[length:calc(15*var(--u))] lg:text-[32px]/[normal]">{stream.name}</h2>
        <StatusPill live={stream.live} />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <button
          type="button"
          aria-label={playing ? `Pause ${stream.name}` : `Play ${stream.name}`}
          aria-pressed={playing}
          disabled={!canPlay}
          onClick={togglePlayback}
          className="relative grid h-[calc(82.5*var(--u))] w-[calc(80.72*var(--u))] place-items-center disabled:cursor-not-allowed lg:size-[150px]"
        >
          <Image
            src="/images/sports-play-pause-frame.svg"
            alt=""
            width={179.329}
            height={181.105}
            className="pointer-events-none absolute top-1/2 left-1/2 h-[calc(181.105*var(--u))] w-[calc(179.329*var(--u))] max-w-none -translate-x-1/2 -translate-y-1/2 lg:hidden"
          />
          <Image
            src="/images/sports-play-pause-frame-desktop.svg"
            alt=""
            width={362}
            height={362}
            className="pointer-events-none absolute top-1/2 left-1/2 hidden max-w-none -translate-x-1/2 -translate-y-1/2 lg:block"
          />
          {playing ? (
            <Image
              src="/images/sports-pause-icon.png"
              alt=""
              width={512}
              height={512}
              className="relative size-[calc(62.57*var(--u))] opacity-50 drop-shadow-[0_1.86px_1.86px_rgba(0,0,0,0.25)] lg:size-[115px] lg:drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            />
          ) : (
            <Image
              src="/images/sports-play-icon.png"
              alt=""
              width={512}
              height={512}
              className="relative size-[calc(57.13*var(--u))] opacity-50 lg:size-[105px]"
            />
          )}
        </button>
        {canPlay && <audio ref={audioRef} preload="none" onPause={() => setPlaying(false)} onError={() => setPlaying(false)} />}
      </div>

      <div className="flex items-end justify-between gap-[calc(8*var(--u))] lg:gap-2">
        <div className="max-w-[calc(133*var(--u))] lg:max-w-[247px]">
          <p className="text-[length:calc(7*var(--u))] lg:text-[15px]/[normal]">{stream.sport}</p>
          <p className="mt-[calc(3*var(--u))] text-[length:calc(16.74*var(--u))] lg:mt-0 lg:text-[36px]/[normal]">{stream.matchup}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <Broadcasters names={stream.broadcasters} />
          {!stream.live && <p className="mt-[calc(7*var(--u))] text-[length:calc(7*var(--u))] lg:mt-[7px] lg:text-[15px]/[normal]">UPCOMING</p>}
          <p
            className={`text-[length:calc(11.16*var(--u))] text-[#c3c3c3] lg:text-[24px]/[normal] ${
              stream.live ? "mt-[calc(13*var(--u))] lg:mt-[17px]" : ""
            }`}
          >
            {stream.date}
          </p>
        </div>
      </div>
    </article>
  );
}
