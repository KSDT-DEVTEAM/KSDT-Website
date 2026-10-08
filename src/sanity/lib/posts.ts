// Media post queries for the Media page, the homepage and the post pages.
// Each query returns posts already shaped for the post cards, so components never touch raw Sanity data.

import { cache } from "react";
import { connection } from "next/server";
import { defineQuery, type PortableTextBlock } from "next-sanity";
import { postCategories, type PostCategory } from "../categories";
import { client } from "./client";

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

export type PostDetail = PostCard & {
  imageAlt?: string;
  body?: PortableTextBlock[];
};

// Fields every card needs.
const cardFields = /* groq */ `
  _id,
  title,
  publishedAt,
  category,
  "imageSrc": mainImage.asset->url,
  "author": array::join(authors[]->name, ", "),
  "href": "/media/" + slug.current
`;

const isListed = /* groq */ `_type == "post" && defined(slug.current) && defined(publishedAt)`;

const LATEST_POSTS_QUERY = defineQuery(`
  *[${isListed}] | order(publishedAt desc) [0...$limit] { ${cardFields} }
`);

const CATEGORY_POSTS_QUERY = defineQuery(`
  *[${isListed} && category == $category] | order(publishedAt desc) [0...$limit] { ${cardFields} }
`);

const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${cardFields},
    "imageAlt": mainImage.alt,
    body[] { ..., _type == "image" => { ..., "url": asset->url } }
  }
`);

type RawCard = Omit<PostCard, "date" | "imageSrc" | "author" | "label"> & {
  publishedAt: string;
  category: string | null;
  imageSrc: string | null;
  author: string | null;
};

// Always fetch at request time so published changes show up right away.
// The Sanity CDN (useCdn: true in client.ts) keeps these requests fast.
async function fetchPosts<T>(query: string, params: Record<string, unknown>) {
  await connection();
  return client.fetch<T>(query, params);
}

function toCard({ publishedAt, category, imageSrc, author, ...post }: RawCard): PostCard {
  return {
    ...post,
    label: postCategories.find((c) => c.value === category)?.label ?? "",
    imageSrc: imageSrc ?? undefined,
    author: author ?? "",
    date: formatDate(publishedAt),
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

// Wrapped in cache() so generateMetadata and the page share one request.
export const getPost = cache(async (slug: string): Promise<PostDetail | null> => {
  const post = await fetchPosts<(RawCard & Pick<PostDetail, "imageAlt" | "body">) | null>(
    POST_QUERY,
    { slug },
  );
  return post && { ...toCard(post), imageAlt: post.imageAlt ?? undefined, body: post.body };
});

// Dates are shown in San Diego time, so a post published late in the evening doesn't
// show the next day's date when the server runs in UTC.
function formatDate(iso: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).formatToParts(new Date(iso));
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${part("month")}.${part("day")}.${part("year")}`;
}
