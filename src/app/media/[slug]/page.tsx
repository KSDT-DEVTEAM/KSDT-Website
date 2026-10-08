import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaListPage } from "@/components/MediaListPage";
import { PostArticle } from "@/components/PostArticle";
import { mediaListings } from "@/sanity/categories";
import { getPost } from "@/sanity/lib/posts";

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
  if (listing) return <MediaListPage listing={listing} />;

  const post = await getPost(slug);
  if (!post) notFound();

  return <PostArticle post={post} backHref="/media" />;
}
