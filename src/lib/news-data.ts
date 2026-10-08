// Placeholder content for the News page. Swap these for real API/CMS data later.
// News posts (Featured Work, UCSD, Global) come from Sanity: see src/sanity/lib/posts.ts.

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
