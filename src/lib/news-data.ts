// Placeholder content for the News page. Swap these for real API/CMS data later.
// The Featured Work posts live in placeholder-data.ts because the homepage uses them too.

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