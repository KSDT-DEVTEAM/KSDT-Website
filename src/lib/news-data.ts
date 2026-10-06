// Placeholder content for the News page. Swap these for real API/CMS data later.
// The Featured Work posts live in placeholder-data.ts because the homepage uses them too.

import { featuredNewsPost, moreNewsPosts } from "@/lib/placeholder-data";

export type NewsShow = {
  day: string;
  time: string;
  hosts: string;
};

export type Broadcast = {
  title: string;
  duration: string;
  href: string;
};

export type BroadcastQuarter = {
  /** Heading shown above the list, e.g. "THIS QUARTER" or "SPRING 2026". */
  label: string;
  broadcasts: Broadcast[];
};


export type NewsPostQuarter = {
  /** Heading shown above the posts, e.g. "THIS QUARTER" or "SPRING 2026". */
  label: string;
  posts: NewsPost[];
};


export type NewsPost = {
  label: string;
  /** Leave out to show a grey placeholder until a photo is added to public/images. */
  imageSrc?: string;
  title: string;
  author: string;
  date: string;
  href: string;
};

export const newsShows: NewsShow[] = [
  { day: "MONDAY", time: "6-7PM", hosts: "Henni, Kenny, XYZ" },
  { day: "FRIDAY", time: "6-7PM", hosts: "Henni, Kenny, XYZ" },
];

export const pastBroadcasts: Broadcast[] = [
  { title: "Campus Elections and TapEx Worker Strike", duration: "12min", href: "#" },
  {
    title: "Women’s Volleyball Team to Finals, Warren College Disappears",
    duration: "17min",
    href: "#",
  },
  { title: "Tung Tung Tung Sahur Lookalike Contest", duration: "5min", href: "#" },
];

// Full archive for the Past Broadcasts page, newest quarter first.
// Placeholder: every quarter repeats the same three broadcasts, four times (an even 12, so the
// two-column desktop grid has no gap at the end).
const placeholderQuarter: Broadcast[] = Array.from({ length: 4 }, () => pastBroadcasts).flat();

export const broadcastArchive: BroadcastQuarter[] = [
  { label: "THIS QUARTER", broadcasts: placeholderQuarter },
  { label: "SPRING 2026", broadcasts: placeholderQuarter },
  { label: "WINTER 2026", broadcasts: placeholderQuarter },
];

export const ucsdNewsPosts: NewsPost[] = [
  {
    label: "UCSD",
    title: "Muslim Student Association’s Justice in Palestine Week",
    author: "Tanvi Gupta, Henni Kim",
    date: "05.11.26",
    href: "/news/msa-justice-in-palestine-week",
  },
  {
    label: "UCSD",
    title: "Canvas Handles Cyberattack",
    author: "Jo-Ann Andrade",
    date: "05.11.26",
    href: "/news/canvas-handles-cyberattack",
  },
];

export const globalNewsPosts: NewsPost[] = [
  {
    label: "GLOBAL",
    title: "U.S. Sends Mixed Messages Regarding Peace Deal with Iran",
    author: "Tanvi Gupta, Henni Kim",
    date: "05.11.26",
    href: "/news/us-mixed-messages-iran-peace-deal",
  },
  {
    label: "GLOBAL",
    title: "Supreme Court Pauses Lower Court Abortion Restrictions",
    author: "Tanvi Gupta",
    date: "05.11.26",
    href: "/news/supreme-court-pauses-abortion-restrictions",
  },
];


// Featured Intern Projects page, newest quarter first.
// This quarter reuses the Featured Work posts from the News page, plus one without a photo yet.
export const featuredProjectQuarters: NewsPostQuarter[] = [
  {
    label: "THIS QUARTER",
    posts: [
      { label: "FEATURED", ...featuredNewsPost },
      ...moreNewsPosts,
      {
        label: "FEATURED",
        title: "Interview with Campus Activist",
        author: "Kenny Trang",
        date: "08.29.26",
        href: "#",
      },
    ],
  },
  {
    label: "SPRING 2026",
    posts: ["UCSD", "GLOBAL", "POP CULTURE", "OPINION"].map((label) => ({
      label,
      title: "Headline here",
      author: "Author",
      date: "XX.XX.XX",
      href: "#",
    })),
  },
];