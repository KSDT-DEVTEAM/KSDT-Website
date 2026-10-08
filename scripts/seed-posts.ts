// One-time import of the placeholder News and Media posts that used to be hardcoded in
// src/lib/news-data.ts and src/lib/placeholder-data.ts, so the site isn't empty before
// editors add real posts.
//
// Run from the project root (uses your Sanity login, no API token needed):
//   npx sanity exec scripts/seed-posts.ts --with-user-token
//
// Safe to re-run: documents use fixed IDs and are replaced, and Sanity skips duplicate image uploads.
// Delete these posts in the Studio once real content is in.

import { createReadStream } from "node:fs";
import { basename } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-10-05" });

const categories = {
  ucsd: "UCSD",
  global: "Global",
  "pop-culture": "Pop Culture",
  opinion: "Opinion",
  reviews: "Reviews",
  interviews: "Interviews",
};

type SeedPost = {
  slug: string;
  title: string;
  section: "news" | "media";
  featured?: boolean;
  category?: keyof typeof categories;
  authors: string[];
  /** YYYY-MM-DD, published at noon San Diego time. */
  date: string;
  image?: string;
};

const posts: SeedPost[] = [
  // News: Featured Work / Featured Intern Projects
  { slug: "uc-san-diego-division-i-football", title: "UC San Diego to Add Division I Football Team", section: "news", featured: true, authors: ["Henni Kim"], date: "2026-09-04", image: "news-football.jpg" },
  { slug: "blue-water-film-festival", title: "Blue Water Film Festival", section: "news", featured: true, authors: ["Henni Kim"], date: "2026-09-02", image: "news-blue-water.jpg" },
  { slug: "ksdt-spring-concert", title: "KSDT Spring Concert: Title but it’s 3 Lines Long to See if this Amount of Space Can Accommodate Three Lines of Text", section: "news", featured: true, authors: ["Kenny Trang"], date: "2026-08-29", image: "news-spring-concert.jpg" },
  { slug: "interview-with-campus-activist", title: "Interview with Campus Activist", section: "news", featured: true, authors: ["Kenny Trang"], date: "2026-08-29" },
  // News: UC San Diego
  { slug: "msa-justice-in-palestine-week", title: "Muslim Student Association’s Justice in Palestine Week", section: "news", category: "ucsd", authors: ["Tanvi Gupta", "Henni Kim"], date: "2026-05-11" },
  { slug: "canvas-handles-cyberattack", title: "Canvas Handles Cyberattack", section: "news", category: "ucsd", authors: ["Jo-Ann Andrade"], date: "2026-05-11" },
  // News: Global
  { slug: "us-mixed-messages-iran-peace-deal", title: "U.S. Sends Mixed Messages Regarding Peace Deal with Iran", section: "news", category: "global", authors: ["Tanvi Gupta", "Henni Kim"], date: "2026-05-11" },
  { slug: "supreme-court-pauses-abortion-restrictions", title: "Supreme Court Pauses Lower Court Abortion Restrictions", section: "news", category: "global", authors: ["Tanvi Gupta"], date: "2026-05-11" },
  // Media
  { slug: "underscores-observatory-north-park", title: "I feel the BPM: underscores Rocks The Observatory North Park", section: "media", featured: true, authors: ["Sarah Yoo"], date: "2026-06-04", image: "blog-featured.png" },
  { slug: "pop-drop-december-2025", title: "The Pop Drop: December 2025, Issue #9", section: "media", category: "reviews", authors: ["Lola Dogat"], date: "2025-12-10", image: "blog-pop-drop.jpg" },
  { slug: "sarah-kinsley-fleeting", title: "Sarah Kinsley on 'Fleeting,' an Affirmation of Yearning and Vulnerability", section: "media", category: "reviews", authors: ["Emma Cam"], date: "2025-12-10", image: "blog-sarah-kinsley.jpg" },
];

const toId = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ref = (id: string) => ({ _type: "reference", _ref: id, _key: id });

async function uploadImage(file: string) {
  const asset = await client.assets.upload("image", createReadStream(`public/images/${file}`), {
    filename: basename(file),
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function main() {
  const tx = client.transaction();

  for (const [slug, title] of Object.entries(categories)) {
    tx.createOrReplace({ _id: `seed-category-${slug}`, _type: "category", title, slug: { _type: "slug", current: slug } });
  }

  const authorNames = [...new Set(posts.flatMap((post) => post.authors))];
  for (const name of authorNames) {
    tx.createOrReplace({ _id: `seed-author-${toId(name)}`, _type: "author", name, slug: { _type: "slug", current: toId(name) } });
  }

  for (const post of posts) {
    console.log(`Preparing ${post.section}/${post.slug}`);
    tx.createOrReplace({
      _id: `seed-post-${post.slug}`,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      section: post.section,
      featured: post.featured ?? false,
      authors: post.authors.map((name) => ref(`seed-author-${toId(name)}`)),
      categories: post.category ? [ref(`seed-category-${post.category}`)] : [],
      // Noon Pacific (UTC-7 in summer), so the date shows the same everywhere.
      publishedAt: `${post.date}T19:00:00Z`,
      ...(post.image && { mainImage: await uploadImage(post.image) }),
    });
  }

  await tx.commit();
  console.log(`Seeded ${Object.keys(categories).length} categories, ${authorNames.length} authors and ${posts.length} posts.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
