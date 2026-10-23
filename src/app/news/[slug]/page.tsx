import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PostListPage } from "@/components/PostListPage";
import { PostArticle } from "@/components/PostArticle";
import { newsListings } from "@/sanity/categories";
import { getNewsByQuarter, getPost } from "@/sanity/lib/posts";

// A single News post from Sanity, or one of the "See More" lists (/news/ucsd, /news/global, /news/all).
// The lists share this route so that adding a News section in src/sanity/categories.ts is enough to
// give it a page. The site header, footer and streaming bar come from the root layout.

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const listing = newsListings.find((l) => l.path === slug);
  if (listing) return { title: `${listing.title} | KSDT Radio` };

  const post = await getPost(slug);
  return post ? { title: `${post.title} | KSDT Radio` } : {};
}

export default async function Page({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const listing = newsListings.find((l) => l.path === slug);
  if (listing) {
    const quarters = await getNewsByQuarter({ section: listing.section });
    return <PostListPage title={listing.title} backHref="/news" quarters={quarters} />;
  }

  const post = await getPost(slug);
  if (!post) notFound();
  // Posts that aren't News live under /media.
  if (post.href !== `/news/${slug}`) permanentRedirect(post.href);

  return <PostArticle post={post} backHref="/news" backLabel="Back to News" />;
}
