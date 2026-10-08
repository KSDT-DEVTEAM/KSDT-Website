import Image from "next/image";
import Link from "next/link";
import { broadcastArchive, newsShows } from "@/lib/news-data";
import { getCategoryPosts, getFeaturedPosts, type PostCard } from "@/sanity/lib/posts";
import { MediaCard, MediaListCard } from "@/components/MediaCard";
import { BroadcastList } from "@/components/BroadcastList";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the News content in between.
//
// Mobile is one column. Desktop (lg:) uses the same 1152px-wide container as the homepage and
// Media page: broadcasts in two columns, Featured Work as one big card + two wide cards, and the
// UCSD / Global grids merged into a single "All News" grid.

// Most recent broadcasts: mobile shows the first 3, desktop shows 6.
const recentBroadcasts = broadcastArchive[0].broadcasts.slice(0, 6);

function SeeMore({ href }: { href: string }) {
  return (
    <div className="mt-4 text-right lg:mt-6">
      <Link href={href} className="text-lg lg:text-2xl">
        See More {">>"}
      </Link>
    </div>
  );
}

// News post card: compact and stacked on mobile (two-column grids), wide with the photo
// on the left on desktop (like MediaListCard, but keeps the grey box when there's no photo).
function NewsCard({ post }: { post: PostCard }) {
  return (
    <Link
      href={post.href}
      className="flex flex-col border border-white p-2.5 transition-opacity hover:opacity-90 lg:flex-row lg:gap-5 lg:border-2 lg:py-4 lg:pr-5 lg:pl-[10px]"
    >
      <div className="relative aspect-[160/112] w-full bg-zinc-300 lg:aspect-auto lg:h-[148px] lg:w-[211px] lg:shrink-0 lg:self-center">
        {post.imageSrc && (
          <Image
            src={post.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 211px, (min-width: 448px) 190px, 45vw"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="mt-3 font-mono text-ksdt-pink lg:mt-0 lg:text-lg/[normal]">{post.label}</p>
        <p className="mt-1 font-light leading-tight lg:mt-2 lg:text-lg/none">{post.title}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4 font-mono text-xs lg:items-center lg:border-t lg:border-white lg:pt-3 lg:text-lg/[normal]">
          <span>{post.author}</span>
          <span className="shrink-0">{post.date}</span>
        </div>
      </div>
    </Link>
  );
}

// Mobile only: on desktop these are merged into "All News".
function NewsGrid({ title, posts }: { title: string; posts: PostCard[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="px-4 pt-12 lg:hidden">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3.5">
        {posts.map((post) => (
          <NewsCard key={post._id} post={post} />
        ))}
      </div>
      {/* TODO: link to the full list once that page exists. */}
      <SeeMore href="#" />
    </section>
  );
}

export default async function Page() {
  const [[featuredNewsPost, ...moreNewsPosts], ucsdNewsPosts, globalNewsPosts] = await Promise.all([
    getFeaturedPosts("news"),
    getCategoryPosts("news", "ucsd", 2),
    getCategoryPosts("news", "global", 2),
  ]);
  const allNewsPosts = [...ucsdNewsPosts, ...globalNewsPosts];

  return (
    <>
      {/* Pink title bar, full width like the homepage's live show banner. */}
      <div className="mx-[calc(50%-50vw)] w-screen bg-[rgba(255,141,202,0.4)]">
        <h1 className="mx-auto flex h-16 max-w-md items-center px-4 text-2xl font-bold lg:h-20 lg:max-w-none lg:px-8 lg:text-4xl">
          News
        </h1>
      </div>

      <div className="pb-16 lg:mx-auto lg:max-w-[1152px] lg:px-8 lg:pb-24">
        {/* News show schedule */}
        <section className="px-4 pt-20 lg:px-0 lg:pt-[68px]">
          <table className="w-full table-fixed border-collapse font-mono lg:text-lg">
            <thead>
              <tr>
                <td className="w-[71px] lg:w-52" />
                {newsShows.map((show) => (
                  <th
                    key={show.day}
                    scope="col"
                    className="border border-white px-2.5 py-1 text-left font-normal text-ksdt-pink lg:h-14 lg:border-2 lg:px-8 lg:text-right"
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
                  className="border border-white px-2.5 py-2 text-left align-top font-normal lg:h-14 lg:border-2 lg:px-8 lg:text-right lg:align-middle"
                >
                  HOSTS
                </th>
                {newsShows.map((show) => (
                  <td
                    key={show.day}
                    className="border border-white px-2.5 py-2 align-top lg:border-2 lg:px-8 lg:text-right lg:align-middle lg:uppercase"
                  >
                    {show.hosts}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        {/* Past Broadcasts */}
        <section className="px-4 pt-20 lg:px-0 lg:pt-16">
          <h2 className="text-2xl font-bold lg:text-4xl/[normal]">Past Broadcasts</h2>
          <div className="mt-4 lg:mt-8">
            <BroadcastList
              broadcasts={recentBroadcasts}
              className="lg:grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-3.5 [&>li:nth-child(n+4)]:hidden lg:[&>li:nth-child(n+4)]:flex"
            />
          </div>
          <SeeMore href="/news/past-broadcasts" />
        </section>

        <hr className="mx-4 mt-8 border-white lg:mx-0 lg:border-t-2" />

        {/* Featured Work */}
        {featuredNewsPost && (
          <section className="px-4 pt-8 lg:px-0 lg:pt-12">
            <h2 className="text-2xl font-bold lg:text-4xl/[normal]">Featured Work</h2>
            <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-[370px_1fr] lg:gap-4">
              <MediaCard
                href={featuredNewsPost.href}
                imageSrc={featuredNewsPost.imageSrc}
                label="FEATURED"
                title={featuredNewsPost.title}
                byline={featuredNewsPost.author}
                date={featuredNewsPost.date}
              />
              {/* Desktop: the other two posts as wide cards beside the featured one. */}
              <div className="hidden lg:flex lg:flex-col lg:gap-4">
                {moreNewsPosts.map((post) => (
                  <MediaListCard
                    key={post._id}
                    href={post.href}
                    imageSrc={post.imageSrc}
                    label={post.label}
                    title={post.title}
                    byline={post.author}
                    date={post.date}
                  />
                ))}
              </div>
            </div>
            {/* Mobile: the other two posts in a two-column grid under the featured one. */}
            <div className="mt-3.5 grid grid-cols-2 gap-3.5 lg:hidden">
              {moreNewsPosts.map((post) => (
                <NewsCard key={post._id} post={post} />
              ))}
            </div>
            <SeeMore href="/news/featured-work" />
          </section>
        )}

        <NewsGrid title="UC San Diego News" posts={ucsdNewsPosts} />
        <NewsGrid title="Global News" posts={globalNewsPosts} />

        {/* Desktop only: UCSD and Global news together. */}
        {allNewsPosts.length > 0 && (
          <section className="hidden lg:block lg:pt-6">
            <h2 className="text-4xl/[normal] font-bold">All News</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5">
              {allNewsPosts.map((post) => (
                <NewsCard key={post._id} post={post} />
              ))}
            </div>
            {/* TODO: link to the full list once that page exists. */}
            <SeeMore href="#" />
          </section>
        )}
      </div>
    </>
  );
}