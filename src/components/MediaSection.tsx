import Link from "next/link";
import { MediaCard } from "@/components/MediaCard";

type MediaPost = {
  href: string;
  imageSrc: string;
  title: string;
  author: string;
  date: string;
  label: string;
};

type MediaSectionProps = {
  posts: MediaPost[];
  sectionTitle: string;
  path: string;
};

const MAX_LIST_POSTS = 2;

export function MediaSection({ posts, sectionTitle, path }: MediaSectionProps) {
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;
  const visibleRest = rest.slice(0, MAX_LIST_POSTS);

  return (
    <section className="px-4 pt-6 lg:mx-8 lg:mt-12 lg:border-t-2 lg:px-0 lg:pt-12">
      <h2 className="text-2xl font-bold lg:text-4xl/[normal]">{sectionTitle}</h2>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:mt-8">
        <MediaCard
          href={featured.href}
          imageSrc={featured.imageSrc}
          label={featured.label}
          title={featured.title}
          byline={featured.author}
          date={featured.date}
        />

        {visibleRest.map((post) => (
          <MediaCard
            key={post.href}
            href={post.href}
            imageSrc={post.imageSrc}
            label={post.label}
            title={post.title}
            byline={post.author}
            date={post.date}
          />
        ))}
      </div>

      <div className="mt-4 text-right lg:mt-8">
        <Link href={`/${path}`} className="text-lg lg:text-2xl">
          See More {">>"}
        </Link>
      </div>
    </section>
  );
}