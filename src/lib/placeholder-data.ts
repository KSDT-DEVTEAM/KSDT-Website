// Placeholder content for the homepage. Swap these for real API/CMS data later.
// Media and News posts come from Sanity: see src/sanity/lib/posts.ts.

export const liveShow = {
  title: "LIVE: Show Name",
  hosts: "DJ Name",
  scheduleHref: "#",
};

export const nowPlaying = {
  artworkSrc: "/images/live-show-thumbnail.png",
  trackTitle: "Shopping",
  trackArtist: "feeble little horse",
  duration: "00:34",
  progress: 0.28,
};

export const navSections = [
  {
    label: "BLOG",
    href: "#",
    children: [
      { label: "MEDIA", href: "/media" },
      { label: "NEWS", href: "/news" },
    ],
  },
  { label: "SPORTS", href: "/sports" },
  { label: "LIBRARY", href: "https://ksdtorg.github.io/ksdt-digital-library/" },
  {
    label: "GET INVOLVED",
    href: "#",
    children: [
      { label: "INTERNS AND DJS", href: "/join" },
      { label: "BOOK A PRACTICE ROOM", href: "/book-a-room" },
    ],
  },
  { label: "ABOUT", href: "/about" },
];
