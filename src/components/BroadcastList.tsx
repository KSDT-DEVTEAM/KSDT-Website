import Image from "next/image";
import Link from "next/link";
import type { Broadcast } from "@/lib/news-data";

// Bordered rows of news broadcasts: play button, pink title · duration, info link.
// Used on the News page and the Past Broadcasts page.
// `className` is added to the list itself, e.g. to lay the rows out in a grid on desktop.
export function BroadcastList({ broadcasts, className = "" }: { broadcasts: Broadcast[]; className?: string }) {
  return (
    <ul className={`flex flex-col gap-1.5 ${className}`}>
      {broadcasts.map((broadcast, i) => (
        <li
          key={`${broadcast.title}-${i}`}
          className="flex min-h-14 items-center gap-3 border border-white px-2 py-2 lg:min-h-16 lg:border-2 lg:pr-[30px] lg:pl-[13px] lg:text-lg"
        >
          {/* TODO: play the recording once the audio player is wired up. */}
          <button type="button" aria-label={`Play ${broadcast.title}`} className="shrink-0 p-1">
            <Image src="/images/play-icon.svg" alt="" width={13} height={16} className="lg:h-5 lg:w-4" />
          </button>
          <p className="flex-1">
            <span className="text-ksdt-pink">{broadcast.title}</span> · {broadcast.duration}
          </p>
          <Link href={broadcast.href} aria-label={`About ${broadcast.title}`} className="shrink-0">
            <Image src="/images/information-icon.svg" alt="" width={16} height={16} />
          </Link>
        </li>
      ))}
    </ul>
  );
}