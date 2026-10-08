import { FeaturedSection, MediaSection } from "@/components/MediaSection";
import { postCategories } from "@/sanity/categories";
import { getCategoryPosts, getFeaturedPosts } from "@/sanity/lib/posts";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the Media content in between.
//
// Featured is the 3 newest posts (just the newest on mobile). Below it, one section per post
// category (Reviews, Interviews, …) from src/sanity/categories.ts.

export default async function MediaPage() {
  const [featured, ...sections] = await Promise.all([
    getFeaturedPosts(),
    ...postCategories.map((category) => getCategoryPosts(category.value)),
  ]);

  return (
    <>
      <MediaHeader />
      <div className="pb-16 lg:mx-auto lg:max-w-[1152px] lg:pb-24">
        <FeaturedSection posts={featured} />
        {postCategories.map((category, i) => (
          <MediaSection
            key={category.value}
            posts={sections[i]}
            title={category.section}
            href={`/media/${category.section.toLowerCase()}`}
          />
        ))}
      </div>
    </>
  );
}

// Pink title bar, full width like the News page's.
function MediaHeader() {
  return (
    <div className="mx-[calc(50%-50vw)] w-screen bg-[rgba(255,141,202,0.4)]">
      <h1 className="mx-auto max-w-md px-4 py-4 text-2xl/[normal] font-bold lg:max-w-none lg:px-8 lg:text-4xl/[normal]">
        Media
      </h1>
    </div>
  );
}
