import Image from "next/image";
import Link from "next/link";
import type { Broadcast } from "@/lib/news-data";

// Bordered rows of news broadcasts: play button, pink title · duration, info link.
// Used on the News page and the Past Broadcasts page.
export function BroadcastList({ broadcasts }: { broadcasts: Broadcast[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {broadcasts.map((broadcast, i) => (
        <li
          key={`${broadcast.title}-${i}`}
          className="flex min-h-14 items-center gap-3 border border-white px-2 py-2"
        >
          {/* TODO: play the recording once the audio player is wired up. */}
          <button type="button" aria-label={`Play ${broadcast.title}`} className="shrink-0 p-1">
            <Image src="/images/play-icon.svg" alt="" width={13} height={16} />
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