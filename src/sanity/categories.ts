// The kinds of Media posts. Editors pick one per post in Sanity Studio, and the Media page
// shows a section for each, in this order.
//
// To add a new kind: add an entry here. The Studio dropdown, the card label, the Media page
// section and its "See More" page (/media/<path>) all come from this list, so nothing else needs to change.

export const postCategories = [
  { value: "review", title: "Review", label: "REVIEW", section: "Reviews", path: "reviews" },
  { value: "interview", title: "Interview", label: "INTERVIEW", section: "Interviews", path: "interviews" },
] as const;

export type PostCategory = (typeof postCategories)[number]["value"];

/** The "See More" pages under /media: one per category, plus every post (linked from Featured). */
export const mediaListings: { path: string; title: string; category?: PostCategory }[] = [
  { path: "all", title: "All Media" },
  ...postCategories.map(({ path, section, value }) => ({ path, title: section, category: value })),
];
