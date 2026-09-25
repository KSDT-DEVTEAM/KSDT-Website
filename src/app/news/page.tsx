import Image from "next/image";
import Link from "next/link";
import { featuredNewsPost, moreNewsPosts } from "@/lib/placeholder-data";
import {
  globalNewsPosts,
  newsShows,
  pastBroadcasts,
  ucsdNewsPosts,
  type NewsPost,
} from "@/lib/news-data";
import { MediaCard } from "@/components/MediaCard";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the News content in between.

function SeeMore({ href }: { href: string }) {
  return (
    <div className="mt-4 text-right">
      <Link href={href} className="text-lg">
        See More {">>"}
      </Link>
    </div>
  );
}

// Compact card used in the two-column grids.
function NewsCard({ post }: { post: NewsPost }) {
  return (
    <Link
      href={post.href}
      className="flex flex-col border border-white p-2.5 transition-opacity hover:opacity-90"
    >
      <div className="relative aspect-[160/112] w-full bg-zinc-300">
        {post.imageSrc && (
          <Image
            src={post.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 448px) 190px, 45vw"
          />
        )}
      </div>
      <p className="mt-3 font-mono text-ksdt-pink">{post.label}</p>
      <p className="mt-1 font-light leading-tight">{post.title}</p>
      <div className="mt-auto flex items-end justify-between gap-2 pt-4 font-mono text-xs">
        <span>{post.author}</span>
        <span className="shrink-0">{post.date}</span>
      </div>
    </Link>
  );
}

function NewsGrid({ title, posts }: { title: string; posts: NewsPost[] }) {
  return (
    <section className="px-4 pt-12">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3.5">
        {posts.map((post) => (
          <NewsCard key={post.href} post={post} />
        ))}
      </div>
      {/* TODO: link to the full list once that page exists. */}
      <SeeMore href="#" />
    </section>
  );
}

export default function Page() {
  return (
    <>
      {/* Pink title bar, full width like the homepage's live show banner. */}
      <div className="mx-[calc(50%-50vw)] w-screen bg-[rgba(255,141,202,0.4)]">
        <h1 className="mx-auto flex h-16 max-w-md items-center px-4 text-2xl font-bold">
          News
        </h1>
      </div>

      {/* Desktop layout isn't designed yet, so keep the mobile column centered. */}
      <div className="pb-16 lg:mx-auto lg:max-w-md">
        {/* News show schedule */}
        <section className="px-4 pt-20">
          <table className="w-full table-fixed border-collapse font-mono">
            <thead>
              <tr>
                <td className="w-[71px]" />
                {newsShows.map((show) => (
                  <th
                    key={show.day}
                    scope="col"
                    className="border border-white px-2.5 py-1 text-left font-normal text-ksdt-pink"
                  >
                    {show.day} {show.time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th
                  scope="row"
                  className="border border-white px-2.5 py-2 text-left align-top font-normal"
                >
                  HOSTS
                </th>
                {newsShows.map((show) => (
                  <td key={show.day} className="border border-white px-2.5 py-2 align-top">
                    {show.hosts}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        {/* Past Broadcasts */}
        <section className="px-4 pt-20">
          <h2 className="text-2xl font-bold">Past Broadcasts</h2>
          <ul className="mt-4 flex flex-col gap-1.5">
            {pastBroadcasts.map((broadcast) => (
              <li
                key={broadcast.title}
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
          {/* TODO: link to the Past Broadcasts page once it exists. */}
          <SeeMore href="#" />
        </section>

        <hr className="mx-4 mt-8 border-white" />

        {/* Featured Work */}
        <section className="px-4 pt-8">
          <h2 className="text-2xl font-bold">Featured Work</h2>
          <div className="mt-4">
            <MediaCard
              href={featuredNewsPost.href}
              imageSrc={featuredNewsPost.imageSrc}
              label="FEATURED"
              title={featuredNewsPost.title}
              byline={featuredNewsPost.author}
              date={featuredNewsPost.date}
            />
          </div>
          <div className="mt-3.5 grid grid-cols-2 gap-3.5">
            {moreNewsPosts.map((post) => (
              <NewsCard key={post.href} post={post} />
            ))}
          </div>
          {/* TODO: link to the Featured Work page once it exists. */}
          <SeeMore href="#" />
        </section>

        <NewsGrid title="UC San Diego News" posts={ucsdNewsPosts} />
        <NewsGrid title="Global News" posts={globalNewsPosts} />
      </div>
    </>
  );
}