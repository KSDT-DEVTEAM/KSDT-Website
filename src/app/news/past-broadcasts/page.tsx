import Link from "next/link";
import { broadcastArchive } from "@/lib/news-data";
import { BroadcastList } from "@/components/BroadcastList";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the Past Broadcasts content in between.
//
// Mobile is one column. Desktop (lg:) uses the same 1152px-wide container as the News page,
// with each quarter's broadcasts in two columns.

export default function Page() {
  return (
    <div className="px-4 pb-16 pt-4 lg:mx-auto lg:max-w-[1152px] lg:px-8 lg:pt-12 lg:pb-24">
      <Link href="/news" className="text-lg font-light lg:text-2xl">
        {"<<"} Back
      </Link>

      <h1 className="mt-6 text-2xl font-bold lg:mt-4 lg:text-4xl/[normal]">Past Broadcasts</h1>
      <p className="mt-4 lg:mt-5 lg:text-lg">
        Couldn’t make it to our show? No problem. Listen to our complete collection of past news
        broadcasts here.
      </p>

      {broadcastArchive.map((quarter, i) => (
        <section
          key={quarter.label}
          className={
            i === 0
              ? "mt-8 lg:mt-10"
              : "mt-8 border-t border-white pt-8 lg:mt-16 lg:border-t-2"
          }
        >
          <h2 className="font-mono text-lg lg:text-2xl">{quarter.label}</h2>
          <div className="mt-4 lg:mt-8">
            <BroadcastList
              broadcasts={quarter.broadcasts}
              className="lg:grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-3.5"
            />
          </div>
        </section>
      ))}
    </div>
  );
}