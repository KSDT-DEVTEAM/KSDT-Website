// Media post queries for the Media page, the homepage and the post pages.
// Each query returns posts already shaped for the post cards, so components never touch raw Sanity data.
//
// Field names follow the existing "KSDT Blog" schema in the production dataset:
// `content` (body), `coverImage`, `date`, and `author` (a reference to a `person`).

import { cache } from "react";
import { connection } from "next/server";
import { defineQuery, type PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { postCategories, type PostCategory } from "../categories";
import { client } from "./client";
import { urlFor } from "./image";

export type PostCard = {
  _id: string;
  /** Pink label above the title: the category (e.g. "REVIEW"), or "FEATURED" in the featured list. */
  label: string;
  /** Leave out to show a grey placeholder. */
  imageSrc?: string;
  title: string;
  author: string;
  /** MM.DD.YY */
  date: string;
  href: string;
};

/** A Sanity image with its asset expanded, ready for urlFor(). */
export type ContentImage = SanityImageSource & {
  alt?: string;
  caption?: string;
  asset: { _id: string; metadata?: { dimensions?: { width: number; height: number } } };
};

export type ImageBlock = {
  _type: "imageBlock";
  _key: string;
  image: ContentImage;
  alt?: string;
  caption?: string;
  size?: "small" | "medium" | "large" | "full";
  alignment?: "left" | "center" | "right";
};

export type GalleryBlock = {
  _type: "galleryBlock";
  _key: string;
  images: (ContentImage & { _key: string })[];
  layout?: "grid" | "carousel" | "masonry";
  columns?: 2 | 3 | 4;
};

export type PostContent = (PortableTextBlock | ImageBlock | GalleryBlock)[];

export type PostDetail = PostCard & {
  /** e.g. "June 24, 2026" */
  longDate: string;
  authorImageSrc?: string;
  excerpt?: string;
  imageAlt?: string;
  content: PostContent;
};

// Fields every card needs.
const cardFields = /* groq */ `
  _id,
  title,
  date,
  category,
  coverImage,
  "author": author->{firstName, lastName},
  "href": "/media/" + slug.current
`;

const isListed = /* groq */ `_type == "post" && defined(slug.current) && defined(date)`;

const LATEST_POSTS_QUERY = defineQuery(`
  *[${isListed}] | order(date desc) [0...$limit] { ${cardFields} }
`);

const CATEGORY_POSTS_QUERY = defineQuery(`
  *[${isListed} && category == $category] | order(date desc) [0...$limit] { ${cardFields} }
`);

// Images inside the content need their asset's size for layout, so expand the asset references.
// $category == "" lists every post.
const ALL_POSTS_QUERY = defineQuery(`
  *[${isListed} && ($category == "" || category == $category)] | order(date desc) { ${cardFields} }
`);

const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${cardFields},
    "authorPicture": author->picture,
    excerpt,
    content[] {
      ...,
      _type == "imageBlock" => { image { ..., asset->{ _id, metadata { dimensions } } } },
      _type == "galleryBlock" => { images[] { ..., asset->{ _id, metadata { dimensions } } } }
    }
  }
`);

type RawCard = {
  _id: string;
  title: string;
  href: string;
  date: string;
  category: string | null;
  coverImage: (SanityImageSource & { alt?: string }) | null;
  author: { firstName?: string; lastName?: string } | null;
};

// Always fetch at request time so published changes show up right away.
// The Sanity CDN (useCdn: true in client.ts) keeps these requests fast.
async function fetchPosts<T>(query: string, params: Record<string, unknown>) {
  await connection();
  return client.fetch<T>(query, params);
}

export function categoryLabel(category: string | null | undefined) {
  return postCategories.find((c) => c.value === category)?.label;
}

function toCard({ _id, title, href, date, category, coverImage, author }: RawCard): PostCard {
  return {
    _id,
    title: title.trim(),
    href,
    label: categoryLabel(category) ?? "MEDIA",
    // urlFor applies the editor's crop; the next/image loader adds the size.
    imageSrc: coverImage ? urlFor(coverImage).url() : undefined,
    author: [author?.firstName, author?.lastName].filter(Boolean).join(" "),
    date: formatDate(date),
  };
}

/** The most recently published posts, labeled "FEATURED". */
export async function getFeaturedPosts(limit = 3) {
  const posts = await fetchPosts<RawCard[]>(LATEST_POSTS_QUERY, { limit });
  return posts.map((post) => ({ ...toCard(post), label: "FEATURED" }));
}

/** Newest posts in one category, e.g. "review". */
export async function getCategoryPosts(category: PostCategory, limit = 2) {
  const posts = await fetchPosts<RawCard[]>(CATEGORY_POSTS_QUERY, { category, limit });
  return posts.map(toCard);
}

export type PostQuarter = {
  /** Heading above the posts, e.g. "THIS QUARTER" or "SPRING 2026". */
  label: string;
  posts: PostCard[];
};

/** Every post in a category (or every post), grouped by school quarter, newest first. */
export async function getPostsByQuarter(category?: PostCategory): Promise<PostQuarter[]> {
  const posts = await fetchPosts<RawCard[]>(ALL_POSTS_QUERY, { category: category ?? "" });
  const current = quarterLabel(new Date().toISOString());
  const quarters: PostQuarter[] = [];
  for (const post of posts) {
    const quarter = quarterLabel(post.date);
    const label = quarter === current ? "THIS QUARTER" : quarter;
    const last = quarters.at(-1);
    if (last?.label === label) last.posts.push(toCard(post));
    else quarters.push({ label, posts: [toCard(post)] });
  }
  return quarters;
}

// Wrapped in cache() so generateMetadata and the page share one request.
export const getPost = cache(async (slug: string): Promise<PostDetail | null> => {
  const post = await fetchPosts<
    | (RawCard & {
        authorPicture: SanityImageSource | null;
        excerpt?: string | null;
        content: PostContent | null;
      })
    | null
  >(POST_QUERY, { slug });
  return (
    post && {
      ...toCard(post),
      longDate: formatDate(post.date, "long"),
      authorImageSrc: post.authorPicture ? urlFor(post.authorPicture).url() : undefined,
      excerpt: post.excerpt ?? undefined,
      imageAlt: post.coverImage?.alt,
      content: post.content ?? [],
    }
  );
});

// Dates are shown in San Diego time, so a post published late in the evening doesn't
// show the next day's date when the server runs in UTC.
const TIME_ZONE = "America/Los_Angeles";

function formatDate(iso: string, style: "short" | "long" = "short") {
  if (style === "long") {
    return new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, dateStyle: "long" }).format(new Date(iso));
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).formatToParts(new Date(iso));
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${part("month")}.${part("day")}.${part("year")}`;
}

// Approximate UCSD quarters, in San Diego time:
// Winter Jan–Mar, Spring Apr–Jun, Summer Jul to mid-Sep, Fall mid-Sep–Dec.
function quarterLabel(iso: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(iso));
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const month = part("month");
  const isFall = month > 9 || (month === 9 && part("day") >= 15);
  const season = isFall ? "FALL" : month <= 3 ? "WINTER" : month <= 6 ? "SPRING" : "SUMMER";
  return `${season} ${part("year")}`;
}
