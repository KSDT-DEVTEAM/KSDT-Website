import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/PostArticle";
import { getPost } from "@/sanity/lib/posts";

// A single News post from Sanity. The site header, footer and streaming bar come from the root layout.

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const post = await getPost("news", (await params).slug);
  return post ? { title: `${post.title} | KSDT Radio` } : {};
}

export default async function Page({ params }: PageProps<"/news/[slug]">) {
  const post = await getPost("news", (await params).slug);
  if (!post) notFound();

  return <PostArticle post={post} backHref="/news" />;
}
