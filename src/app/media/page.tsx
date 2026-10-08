import { FeaturedSection, MediaSection, MediaTitleBar } from "@/components/MediaSection";
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
      <MediaTitleBar title="Media" />
      <div className="pb-16 lg:mx-auto lg:max-w-[1152px] lg:pb-24">
        <FeaturedSection posts={featured} />
        {postCategories.map((category, i) => (
          <MediaSection
            key={category.value}
            posts={sections[i]}
            title={category.section}
            href={`/media/${category.path}`}
          />
        ))}
      </div>
    </>
  );
}
