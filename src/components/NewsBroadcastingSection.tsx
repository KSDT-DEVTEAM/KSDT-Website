import Image from "next/image";
import Link from "next/link";
import { newsBroadcasts } from "@/lib/placeholder-data";

export function NewsBroadcastingSection() {
  return (
    <section className="mt-10 border-t border-white px-4 pb-16 pt-6">
      <h2 className="text-2xl font-bold">News Broadcasting</h2>

      <div className="mt-6 flex flex-col gap-1">
        {newsBroadcasts.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex h-[48px] items-center gap-3 border border-white pl-[15px] pr-[10px]"
          >
            <Image src="/images/play-icon.svg" alt="" width={13} height={16} className="shrink-0" />
            <p className="flex-1 text-xs font-normal">
              <span className="text-[#ff8dca]">{item.title}</span>
              <span className="text-white">{` · ${item.duration}`}</span>
            </p>
            <Image src="/images/information-icon.svg" alt="" width={16} height={16} className="shrink-0" />
          </Link>
        ))}
      </div>

      <div className="mt-6 text-right">
        <Link href="#" className="text-lg">
          See More {">>"}
        </Link>
      </div>
    </section>
  );
}
