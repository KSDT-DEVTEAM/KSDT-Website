import Link from "next/link";
import { PostRowCard } from "@/components/MediaSection";
import type { mediaListings } from "@/sanity/categories";
import { getPostsByQuarter } from "@/sanity/lib/posts";

// A "See More" page: every post in a category (or every post), grouped by school quarter, newest first.
// Laid out from the Figma "Media Reviews" frames.

export async function MediaListPage({ listing }: { listing: (typeof mediaListings)[number] }) {
  const quarters = await getPostsByQuarter(listing.category);

  return (
    <div className="px-4 pt-4 pb-16 lg:mx-auto lg:max-w-[1152px] lg:px-8 lg:pt-12 lg:pb-24">
      <Link href="/media" className="text-lg/[normal] font-light lg:text-2xl/[normal]">
        {"<<"} Back
      </Link>
      <h1 className="mt-3 text-2xl/[normal] font-bold lg:mt-4 lg:text-4xl/[normal]">{listing.title}</h1>

      {quarters.map((quarter, i) => (
        <section key={quarter.label}>
          {i > 0 && <hr className="mt-8 border-white lg:mt-[72px] lg:border-t-2" />}
          <h2 className={`font-mono text-lg/[normal] lg:mt-8 lg:text-2xl/[normal] ${i > 0 ? "mt-4" : "mt-8"}`}>
            {quarter.label}
          </h2>
          <div className="mt-4 grid gap-4 lg:mt-8 lg:grid-cols-2">
            {quarter.posts.map((post) => (
              <PostRowCard key={post._id} post={post} mobileRow />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
