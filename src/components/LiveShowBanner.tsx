import Link from "next/link";
import { liveShow } from "@/lib/placeholder-data";

export function LiveShowBanner() {
  return (
    <section className="w-screen mx-[calc(50%-50vw)] bg-[rgba(255,141,202,0.4)]">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-4 pt-[14px] pb-[13px]">
        <div className="flex flex-col gap-[5px]">
          <p className="text-lg font-bold">{liveShow.title}</p>
          <p className="text-sm font-light">{liveShow.hosts}</p>
        </div>
        <Link
          href={liveShow.scheduleHref}
          className="shrink-0 whitespace-nowrap text-lg font-light underline underline-offset-2"
        >
          See Schedule
        </Link>
      </div>
    </section>
  );
}
