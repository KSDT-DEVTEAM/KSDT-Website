// The kinds of posts. Editors pick one per post in Sanity Studio.
//
// News posts have their own page (/news, with articles at /news/<slug>). Every other kind shows on
// the Media page as a section, in this order.
//
// To add a new kind: add an entry here. The Studio dropdown, the card label, the Media page
// section and its "See More" page (/media/<path>) all come from this list, so nothing else needs to change.

export const postCategories = [
  { value: "review", title: "Review", label: "REVIEW", section: "Reviews", path: "reviews" },
  { value: "interview", title: "Interview", label: "INTERVIEW", section: "Interviews", path: "interviews" },
  { value: "news", title: "News", label: "NEWS", section: "News", path: "news" },
  { value: "other", title: "Other", label: "OTHER", section: "Other", path: "other" },
] as const;

export type PostCategory = (typeof postCategories)[number]["value"];

/** Posts with no category (e.g. ones made in the old "KSDT Blog" Studio, which has no category field) count as this one. */
export const fallbackCategory: PostCategory = "other";

/** Posts in this category show on the News page instead of the Media page. */
export const newsCategory: PostCategory = "news";

/** The Media page sections: every category except News. */
export const mediaCategories = postCategories.filter((c) => c.value !== newsCategory);

/** The "See More" pages under /media: one per category, plus every post (linked from Featured). */
export const mediaListings: { path: string; title: string; category?: PostCategory }[] = [
  { path: "all", title: "All Media" },
  ...mediaCategories.map(({ path, section, value }) => ({ path, title: section, category: value })),
];

// Where a News post goes on the News page. Editors pick one per News post in Sanity Studio.
// The "See More" page for each is /news/<path>.
export const newsSections = [
  { value: "ucsd", title: "UCSD", label: "UCSD", section: "UC San Diego News", path: "ucsd" },
  { value: "global", title: "Global", label: "GLOBAL", section: "Global News", path: "global" },
] as const;

export type NewsSection = (typeof newsSections)[number]["value"];

/** The "See More" pages under /news: one per section, plus every News post (linked from All News on desktop). */
export const newsListings: { path: string; title: string; section?: NewsSection }[] = [
  { path: "all", title: "All News" },
  ...newsSections.map(({ path, section, value }) => ({ path, title: section, section: value })),
];
