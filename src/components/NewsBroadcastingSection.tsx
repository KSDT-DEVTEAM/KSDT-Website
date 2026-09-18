import Image from "next/image";
import Link from "next/link";
import { newsBroadcasts } from "@/lib/placeholder-data";

export function NewsBroadcastingSection() {
  return (
    <section className="mt-10 border-t border-white px-4 pb-16 pt-6">
      <h2 className="text-2xl font-bold">News Broadcasting</h2>

      <ul className="mt-6 space-y-6">
        {newsBroadcasts.map((item) => (
          <li key={item.title}>
            <Link href={item.href} className="flex items-center gap-3">
              <Image src="/images/list-arrow.svg" alt="" width={11} height={14} />
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <Link href="#" className="text-lg">
          See More {">>"}
        </Link>
      </div>
    </section>
  );
}
