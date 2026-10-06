import Image from "next/image";
import Link from "next/link";
import { featuredProjectQuarters, type NewsPost } from "@/lib/news-data";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the Featured Intern Projects content in between.
//
// Mobile is one column of wide cards. Desktop (lg:) uses the same 1152px-wide container as the
// News page, with each quarter's projects in a two-column grid.

// Wide card: photo on the left (grey box until there's a photo), text on the right.
function ProjectCard({ post }: { post: NewsPost }) {
  return (
    <Link
      href={post.href}
      className="flex gap-2.5 border border-white py-4 pr-4 pl-2.5 transition-opacity hover:opacity-90 lg:gap-5 lg:border-2 lg:pr-5"
    >
      <div className="relative h-28 w-40 shrink-0 self-center bg-zinc-300 lg:h-[148px] lg:w-[211px]">
        {post.imageSrc && (
          <Image
            src={post.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 211px, 160px"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-mono text-ksdt-pink lg:text-lg/[normal]">{post.label}</p>
        <p className="mt-1 mb-2 line-clamp-3 leading-tight font-light lg:mt-2 lg:line-clamp-4 lg:text-lg/none">
          {post.title}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white pt-2 font-mono text-xs lg:pt-3 lg:text-lg/[normal]">
          <span className="truncate">{post.author}</span>
          <span className="shrink-0">{post.date}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Page() {
  return (
    <div className="px-4 pb-16 pt-4 lg:mx-auto lg:max-w-[1152px] lg:px-8 lg:pt-12 lg:pb-24">
      <Link href="/news" className="text-lg font-light lg:text-2xl">
        {"<<"} Back
      </Link>

      <h1 className="mt-6 text-2xl font-bold lg:mt-4 lg:text-4xl/[normal]">Featured Intern Projects</h1>
      <p className="mt-4 lg:mt-5 lg:text-lg">
        News intern projects highlight diverse bodies of work as part of a capstone project within
        the news department, imbued with journalistic rigor and local identity.
      </p>

      {featuredProjectQuarters.map((quarter, i) => (
        <section
          key={quarter.label}
          className={
            i === 0
              ? "mt-8 lg:mt-10"
              : "mt-8 border-t border-white pt-8 lg:mt-16 lg:border-t-2"
          }
        >
          <h2 className="font-mono text-lg lg:text-2xl">{quarter.label}</h2>
          <div className="mt-4 flex flex-col gap-4 lg:mt-8 lg:grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-5">
            {quarter.posts.map((post, j) => (
              <ProjectCard key={`${post.title}-${j}`} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}