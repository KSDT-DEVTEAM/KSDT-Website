import Link from "next/link";
import { broadcastArchive } from "@/lib/news-data";
import { BroadcastList } from "@/components/BroadcastList";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the Past Broadcasts content in between.

export default function Page() {
  return (
    // Desktop layout isn't designed yet, so keep the mobile column centered.
    <div className="px-4 pb-16 pt-4 lg:mx-auto lg:max-w-md">
      <Link href="/news" className="text-lg font-light">
        {"<<"} Back
      </Link>

      <h1 className="mt-6 text-2xl font-bold">Past Broadcasts</h1>
      <p className="mt-4">
        Couldn’t make it to our show? No problem. Listen to our complete collection of past news
        broadcasts here.
      </p>

      {broadcastArchive.map((quarter, i) => (
        <section key={quarter.label} className={i === 0 ? "mt-8" : "mt-8 border-t border-white pt-8"}>
          <h2 className="font-mono text-lg">{quarter.label}</h2>
          <div className="mt-4">
            <BroadcastList broadcasts={quarter.broadcasts} />
          </div>
        </section>
      ))}
    </div>
  );
}