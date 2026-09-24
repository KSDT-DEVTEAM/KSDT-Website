import Link from "next/link";
import { featuredNewsPost, moreNewsPosts } from "@/lib/placeholder-data";
import { MediaCard, MediaListCard } from "@/components/MediaCard";

export function NewsBroadcastingSection() {
  return (
    <section className="mt-10 border-t border-white px-4 pb-16 pt-6 lg:mx-8 lg:mt-9 lg:border-t-0 lg:px-0 lg:pb-24 lg:pt-0">
      <h2 className="text-2xl font-bold lg:text-4xl/[normal]">News</h2>

      <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[370px_1fr] lg:gap-4">
        <MediaCard
          href={featuredNewsPost.href}
          imageSrc={featuredNewsPost.imageSrc}
          label="FEATURED"
          title={featuredNewsPost.title}
          byline={featuredNewsPost.author}
          date={featuredNewsPost.date}
        />
        <div className="hidden lg:flex lg:flex-col lg:gap-4">
          {moreNewsPosts.map((post) => (
            <MediaListCard
              key={post.title}
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

      <div className="mt-6 text-right lg:mt-8">
        <Link href="#" className="text-lg lg:text-2xl">
          See More {">>"}
        </Link>
      </div>
    </section>
  );
}
