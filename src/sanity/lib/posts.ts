// Post queries for the News and Media pages, the homepage and the post pages.
// Each query returns posts already shaped for the post cards, so components never touch raw Sanity data.

import { cache } from "react";
import { connection } from "next/server";
import { defineQuery, type PortableTextBlock } from "next-sanity";
import { client } from "./client";

export type PostSection = "news" | "media";

export type PostCard = {
  _id: string;
  /** Pink label above the title: the first category, or "FEATURED" in featured lists. */
  label: string;
  /** Leave out to show a grey placeholder. */
  imageSrc?: string;
  title: string;
  author: string;
  /** MM.DD.YY */
  date: string;
  href: string;
};

export type PostQuarter = {
  /** Heading shown above the posts, e.g. "THIS QUARTER" or "SPRING 2026". */
  label: string;
  posts: PostCard[];
};

export type PostDetail = PostCard & {
  imageAlt?: string;
  body?: PortableTextBlock[];
};

// Fields every card needs. `label` is overridden in the featured queries.
const cardFields = /* groq */ `
  _id,
  title,
  publishedAt,
  "label": coalesce(upper(categories[0]->title), upper(section)),
  "imageSrc": mainImage.asset->url,
  "author": array::join(authors[]->name, ", "),
  "href": "/" + section + "/" + slug.current
`;

const isListed = /* groq */ `_type == "post" && section == $section && defined(slug.current) && defined(publishedAt)`;

const FEATURED_POSTS_QUERY = defineQuery(`
  *[${isListed} && featured == true] | order(publishedAt desc) [0...$limit] { ${cardFields}, "label": "FEATURED" }
`);

const CATEGORY_POSTS_QUERY = defineQuery(`
  *[${isListed} && featured != true && $category in categories[]->slug.current]
    | order(publishedAt desc) [0...$limit] { ${cardFields} }
`);

const POST_QUERY = defineQuery(`
  *[_type == "post" && section == $section && slug.current == $slug][0] {
    ${cardFields},
    "imageAlt": mainImage.alt,
    body[] { ..., _type == "image" => { ..., "url": asset->url } }
  }
`);

type RawCard = Omit<PostCard, "date" | "imageSrc" | "author"> & {
  publishedAt: string;
  imageSrc: string | null;
  author: string | null;
};

// Always fetch at request time so published changes show up right away.
// The Sanity CDN (useCdn: true in client.ts) keeps these requests fast.
async function fetchPosts<T>(query: string, params: Record<string, unknown>) {
  await connection();
  return client.fetch<T>(query, params);
}

function toCard({ publishedAt, imageSrc, author, ...post }: RawCard): PostCard {
  return {
    ...post,
    imageSrc: imageSrc ?? undefined,
    author: author ?? "",
    date: formatDate(publishedAt),
  };
}

export async function getFeaturedPosts(section: PostSection, limit = 3) {
  const posts = await fetchPosts<RawCard[]>(FEATURED_POSTS_QUERY, { section, limit });
  return posts.map(toCard);
}

/** Newest non-featured posts in a category, by the category's slug (e.g. "ucsd", "reviews"). */
export async function getCategoryPosts(section: PostSection, category: string, limit = 4) {
  const posts = await fetchPosts<RawCard[]>(CATEGORY_POSTS_QUERY, { section, category, limit });
  return posts.map(toCard);
}

/** Featured posts grouped by school quarter, newest first. */
export async function getFeaturedPostsByQuarter(section: PostSection): Promise<PostQuarter[]> {
  const posts = await fetchPosts<RawCard[]>(FEATURED_POSTS_QUERY, { section, limit: 1000 });
  const current = quarterLabel(new Date().toISOString());
  const quarters: PostQuarter[] = [];
  for (const post of posts) {
    const q = quarterLabel(post.publishedAt);
    const label = q === current ? "THIS QUARTER" : q;
    const last = quarters.at(-1);
    if (last?.label === label) last.posts.push(toCard(post));
    else quarters.push({ label, posts: [toCard(post)] });
  }
  return quarters;
}

// Wrapped in cache() so generateMetadata and the page share one request.
export const getPost = cache(async (section: PostSection, slug: string): Promise<PostDetail | null> => {
  const post = await fetchPosts<(RawCard & Pick<PostDetail, "imageAlt" | "body">) | null>(
    POST_QUERY,
    { section, slug },
  );
  return post && { ...toCard(post), imageAlt: post.imageAlt ?? undefined, body: post.body };
});

// Dates are shown in San Diego time, so a post published late in the evening doesn't
// show the next day's date when the server runs in UTC.
const TIME_ZONE = "America/Los_Angeles";

function datePart(iso: string, part: "year" | "month" | "day") {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, [part]: "numeric" }).format(new Date(iso)),
  );
}

function formatDate(iso: string) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(datePart(iso, "month"))}.${pad(datePart(iso, "day"))}.${pad(datePart(iso, "year") % 100)}`;
}

// Approximate UCSD quarters: Winter Jan–Mar, Spring Apr–Jun, Summer Jul to mid-Sep, Fall mid-Sep–Dec.
function quarterLabel(iso: string) {
  const month = datePart(iso, "month");
  const isFall = month > 9 || (month === 9 && datePart(iso, "day") >= 15);
  const season = isFall ? "FALL" : month <= 3 ? "WINTER" : month <= 6 ? "SPRING" : "SUMMER";
  return `${season} ${datePart(iso, "year")}`;
}
