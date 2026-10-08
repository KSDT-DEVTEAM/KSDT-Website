// One-time import of the placeholder Media posts that used to be hardcoded in
// src/lib/placeholder-data.ts, so the site isn't empty before editors add real posts.
//
// Run from the project root (uses your Sanity login, no API token needed):
//   npx sanity exec scripts/seed-posts.ts --with-user-token
//
// Safe to re-run: documents use fixed IDs and are replaced, and Sanity skips duplicate image uploads.
// It also deletes seed documents from earlier versions of this script (news posts and the old
// category documents). Delete these posts in the Studio once real content is in.

import { createReadStream } from "node:fs";
import { basename } from "node:path";
import { getCliClient } from "sanity/cli";
import type { PostCategory } from "../src/sanity/categories";

const client = getCliClient({ apiVersion: "2026-10-05" });

type SeedPost = {
  slug: string;
  title: string;
  category: PostCategory;
  authors: string[];
  /** YYYY-MM-DD, published at noon San Diego time. */
  date: string;
  image?: string;
};

const posts: SeedPost[] = [
  { slug: "underscores-observatory-north-park", title: "I feel the BPM: underscores Rocks The Observatory North Park", category: "review", authors: ["Sarah Yoo"], date: "2026-06-04", image: "blog-featured.png" },
  { slug: "pop-drop-december-2025", title: "The Pop Drop: December 2025, Issue #9", category: "review", authors: ["Lola Dogat"], date: "2025-12-10", image: "blog-pop-drop.jpg" },
  { slug: "sarah-kinsley-fleeting", title: "Sarah Kinsley on 'Fleeting,' an Affirmation of Yearning and Vulnerability", category: "interview", authors: ["Emma Cam"], date: "2025-12-10", image: "blog-sarah-kinsley.jpg" },
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

  const authorIds = new Set<string>();
  for (const name of new Set(posts.flatMap((post) => post.authors))) {
    const id = `seed-author-${toId(name)}`;
    authorIds.add(id);
    tx.createOrReplace({ _id: id, _type: "author", name, slug: { _type: "slug", current: toId(name) } });
  }

  const postIds = new Set<string>();
  for (const post of posts) {
    console.log(`Preparing ${post.category}: ${post.slug}`);
    const id = `seed-post-${post.slug}`;
    postIds.add(id);
    tx.createOrReplace({
      _id: id,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      category: post.category,
      authors: post.authors.map((name) => ref(`seed-author-${toId(name)}`)),
      // Noon Pacific (UTC-7 in summer), so the date shows the same everywhere.
      publishedAt: `${post.date}T19:00:00Z`,
      ...(post.image && { mainImage: await uploadImage(post.image) }),
    });
  }

  // Remove seed documents that aren't in the lists above any more.
  const stale = await client.fetch<string[]>(
    `*[_id match "seed-*" && !(_id in $keep)]._id`,
    { keep: [...postIds, ...authorIds] },
  );
  // Posts first, so nothing still references an author or category when it's deleted.
  for (const id of stale.sort((a, b) => Number(b.startsWith("seed-post-")) - Number(a.startsWith("seed-post-")))) {
    console.log(`Deleting ${id}`);
    tx.delete(id);
  }

  await tx.commit();
  console.log(`Seeded ${authorIds.size} authors and ${posts.length} posts, deleted ${stale.length} old seed documents.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
