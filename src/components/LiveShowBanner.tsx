import Link from "next/link";
import { liveShow } from "@/lib/placeholder-data";

export function LiveShowBanner() {
  return (
    <section className="bg-[rgba(255,141,202,0.4)] px-4 py-3">
      <p className="text-lg font-bold">{liveShow.title}</p>
      <div className="mt-1 flex items-start justify-between gap-4">
        <p className="text-sm font-light">{liveShow.hosts}</p>
        <Link
          href={liveShow.scheduleHref}
          className="shrink-0 whitespace-nowrap text-sm font-light underline underline-offset-2"
        >
          See Schedule
        </Link>
      </div>
    </section>
  );
}
