import Image from "next/image";
import Link from "next/link";
import type { PostCard } from "@/sanity/lib/posts";

// Cards and sections for the Media page, sized from the Figma "Media" (mobile) and
// "Media Home" (desktop) frames.

function SeeMore({ href, className = "" }: { href: string; className?: string }) {
  return (
    <div className={`text-right ${className}`}>
      <Link href={href} className="text-lg lg:text-2xl">
        See More {">>"}
      </Link>
    </div>
  );
}

// Big card: photo on top, text below. The newest post at the top of the page.
function FeaturedCard({ post }: { post: PostCard }) {
  return (
    <Link
      href={post.href}
      className="flex flex-col border border-white px-[9px] pt-[15px] pb-[15px] transition-opacity hover:opacity-90 lg:h-full lg:border-2 lg:px-2 lg:pt-[18px] lg:pb-3"
    >
      <div className="relative aspect-[350/192] w-full bg-zinc-300">
        {post.imageSrc && (
          <Image
            src={post.imageSrc}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 350px, (min-width: 448px) 350px, calc(100vw - 52px)"
          />
        )}
      </div>
      <p className="mt-2 font-mono text-ksdt-pink lg:mt-1 lg:text-lg/[normal]">{post.label}</p>
      <p className="mt-2 text-2xl/[normal] font-light lg:mt-1.5 lg:text-lg/[normal]">{post.title}</p>
      <div className="mt-2.5 flex items-center justify-between gap-2 font-mono lg:mt-auto lg:pt-4">
        <span>{post.author}</span>
        <span className="shrink-0">{post.date}</span>
      </div>
    </Link>
  );
}

// Small card: stacked in a two-column grid on mobile, wide with the photo on the left on desktop.
function PostRowCard({ post }: { post: PostCard }) {
  return (
    <Link
      href={post.href}
      className="flex flex-col border border-white px-[9px] pt-[15px] pb-[15px] transition-opacity hover:opacity-90 lg:flex-row lg:gap-2.5 lg:border-2 lg:px-[18px] lg:py-3.5"
    >
      <div className="relative aspect-[160/112] w-full shrink-0 bg-zinc-300 lg:aspect-auto lg:h-[148px] lg:w-[211px] lg:self-center">
        {post.imageSrc && (
          <Image
            src={post.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 211px, (min-width: 448px) 160px, 40vw"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="mt-2.5 font-mono text-ksdt-pink lg:mt-0 lg:text-lg/[normal]">{post.label}</p>
        <p className="mt-2.5 mb-4 leading-none font-light lg:mt-2 lg:mb-3 lg:line-clamp-3 lg:text-lg/none">
          {post.title}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 font-mono text-xs lg:items-center lg:border-t lg:border-white lg:pt-4 lg:text-lg/[normal]">
          <span className="min-w-0">{post.author}</span>
          <span className="shrink-0">{post.date}</span>
        </div>
      </div>
    </Link>
  );
}

/** The newest post as a big card, with the next two beside it on desktop (hidden on mobile). */
export function FeaturedSection({ posts }: { posts: PostCard[] }) {
  const [featured, ...rest] = posts;
  if (!featured) return null;

  return (
    <section className="px-4 pt-6 lg:mx-8 lg:px-0 lg:pt-[72px]">
      <div className="lg:grid lg:grid-cols-[370px_1fr] lg:gap-4">
        <FeaturedCard post={featured} />
        <div className="hidden lg:flex lg:flex-col lg:gap-4">
          {rest.map((post) => (
            <PostRowCard key={post._id} post={post} />
          ))}
        </div>
      </div>
      {/* TODO: link to a full list of posts once that page exists. */}
      <SeeMore href="#" className="hidden lg:mt-8 lg:block" />
    </section>
  );
}

/** One category's newest posts, e.g. Reviews. */
export function MediaSection({ posts, title, href }: { posts: PostCard[]; title: string; href: string }) {
  if (posts.length === 0) return null;

  return (
    <section className="px-4 pt-8 lg:mx-8 lg:px-0 lg:pt-1">
      <h2 className="text-2xl/[normal] font-bold lg:text-4xl/[normal]">{title}</h2>
      <div className="mt-7 grid grid-cols-2 gap-2.5 lg:mt-12 lg:gap-4">
        {posts.map((post) => (
          <PostRowCard key={post._id} post={post} />
        ))}
      </div>
      <SeeMore href={href} className="mt-4 mb-4 lg:mt-8 lg:mb-0" />
    </section>
  );
}
