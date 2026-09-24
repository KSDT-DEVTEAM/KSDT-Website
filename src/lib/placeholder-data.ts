// Placeholder content for the homepage. Swap these for real API/CMS data later.

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

export const featuredBlogPost = {
  imageSrc: "/images/blog-featured.png",
  title: "I feel the BPM: underscores Rocks The Observatory North Park",
  author: "Sarah Yoo",
  date: "06.04.26",
  href: "#",
};

// Extra posts shown beside the featured one on desktop.
export const moreBlogPosts = [
  {
    label: "BLOG",
    imageSrc: "/images/blog-pop-drop.jpg",
    title: "The Pop Drop: December 2025, Issue #9",
    author: "Lola Dogat",
    date: "12.10.26",
    href: "#",
  },
  {
    label: "BLOG",
    imageSrc: "/images/blog-sarah-kinsley.jpg",
    title: "Sarah Kinsley on 'Fleeting,' an Affirmation of Yearning and Vulnerability",
    author: "Emma Cam",
    date: "12.10.26",
    href: "#",
  },
];

export const featuredNewsPost = {
  imageSrc: "/images/news-football.jpg",
  title: "UC San Diego to Add Division I Football Team",
  author: "Henni Kim",
  date: "09.04.26",
  href: "#",
};

export const moreNewsPosts = [
  {
    label: "FEATURED",
    imageSrc: "/images/news-blue-water.jpg",
    title: "Blue Water Film Festival",
    author: "Henni Kim",
    date: "09.02.26",
    href: "#",
  },
  {
    label: "FEATURED",
    imageSrc: "/images/news-spring-concert.jpg",
    title:
      "KSDT Spring Concert: Title but it’s 3 Lines Long to See if this Amount of Space Can Accommodate Three Lines of Text",
    author: "Kenny Trang",
    date: "08.29.26",
    href: "#",
  },
];

export const navSections = [
  {
    label: "BLOG",
    href: "#",
    children: [
      { label: "MEDIA", href: "#" },
      { label: "NEWS", href: "#" },
    ],
  },
  { label: "SPORTS", href: "#" },
  { label: "LIBRARY", href: "#" },
  {
    label: "GET INVOLVED",
    href: "#",
    children: [
      { label: "INTERNS AND DJS", href: "#" },
      { label: "BOOK A PRACTICE ROOM", href: "#" },
    ],
  },
  { label: "ABOUT", href: "#" },
];
