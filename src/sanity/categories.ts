// The kinds of Media posts. Editors pick one per post in Sanity Studio, and the Media page
// shows a section for each, in this order.
//
// To add a new kind: add an entry here. The Studio dropdown, the card label and the Media page
// section all come from this list, so nothing else needs to change.

export const postCategories = [
  { value: "review", title: "Review", label: "REVIEW", section: "Reviews" },
  { value: "interview", title: "Interview", label: "INTERVIEW", section: "Interviews" },
] as const;

export type PostCategory = (typeof postCategories)[number]["value"];
