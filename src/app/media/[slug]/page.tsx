import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PostListPage } from "@/components/PostListPage";
import { PostArticle } from "@/components/PostArticle";
import { mediaListings } from "@/sanity/categories";
import { getPost, getPostsByQuarter } from "@/sanity/lib/posts";

// A single Media post from Sanity, or one of the "See More" lists (/media/reviews, /media/interviews,
// /media/all). The lists share this route so that adding a category in src/sanity/categories.ts is
// enough to give it a page. The site header, footer and streaming bar come from the root layout.

export async function generateMetadata({ params }: PageProps<"/media/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const listing = mediaListings.find((l) => l.path === slug);
  if (listing) return { title: `${listing.title} | KSDT Radio` };

  const post = await getPost(slug);
  return post ? { title: `${post.title} | KSDT Radio` } : {};
}

export default async function Page({ params }: PageProps<"/media/[slug]">) {
  const { slug } = await params;
  const listing = mediaListings.find((l) => l.path === slug);
  if (listing) {
    const quarters = await getPostsByQuarter(listing.category);
    return <PostListPage title={listing.title} backHref="/media" quarters={quarters} />;
  }

  const post = await getPost(slug);
  if (!post) notFound();
  // News posts live under /news.
  if (post.href !== `/media/${slug}`) permanentRedirect(post.href);

  return <PostArticle post={post} backHref="/media" backLabel="Back to Media" />;
}
