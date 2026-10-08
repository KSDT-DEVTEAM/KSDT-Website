import Link from "next/link";
import { getFeaturedPosts } from "@/sanity/lib/posts";
import { MediaCard, MediaListCard } from "@/components/MediaCard";

export async function BlogSection() {
  const [featuredBlogPost, ...moreBlogPosts] = await getFeaturedPosts("media");
  if (!featuredBlogPost) return null;

  return (
    <section className="mt-10 border-t border-white px-4 pt-6 lg:mx-8 lg:mt-12 lg:border-t-2 lg:px-0 lg:pt-12">
      <h2 className="text-2xl font-bold lg:text-4xl/[normal]">Media</h2>

      <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-[370px_1fr] lg:gap-4">
        <MediaCard
          href={featuredBlogPost.href}
          imageSrc={featuredBlogPost.imageSrc}
          label="FEATURED"
          title={featuredBlogPost.title}
          byline={featuredBlogPost.author}
          date={featuredBlogPost.date}
        />
        <div className="hidden lg:flex lg:flex-col lg:gap-4">
          {moreBlogPosts.map((post) => (
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

      <div className="mt-4 text-right lg:mt-8">
        <Link href="/media" className="text-lg lg:text-2xl">
          See More {">>"}
        </Link>
      </div>
    </section>
  );
}
