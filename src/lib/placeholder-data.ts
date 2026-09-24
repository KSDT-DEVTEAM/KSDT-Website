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
  href: "/media/underscores-observatory-north-park",
};

// Extra posts shown beside the featured one on desktop.
export const moreBlogPosts = [
  {
    label: "BLOG",
    imageSrc: "/images/blog-pop-drop.jpg",
    title: "The Pop Drop: December 2025, Issue #9",
    author: "Lola Dogat",
    date: "12.10.26",
    href: "/media/pop-drop-december-2025",
  },
  {
    label: "BLOG",
    imageSrc: "/images/blog-sarah-kinsley.jpg",
    title: "Sarah Kinsley on 'Fleeting,' an Affirmation of Yearning and Vulnerability",
    author: "Emma Cam",
    date: "12.10.26",
    href: "/media/sarah-kinsley-fleeting",
  },
];

export const featuredNewsPost = {
  imageSrc: "/images/news-football.jpg",
  title: "UC San Diego to Add Division I Football Team",
  author: "Henni Kim",
  date: "09.04.26",
  href: "/news/uc-san-diego-division-i-football",
};

export const moreNewsPosts = [
  {
    label: "FEATURED",
    imageSrc: "/images/news-blue-water.jpg",
    title: "Blue Water Film Festival",
    author: "Henni Kim",
    date: "09.02.26",
    href: "/news/blue-water-film-festival",
  },
  {
    label: "FEATURED",
    imageSrc: "/images/news-spring-concert.jpg",
    title:
      "KSDT Spring Concert: Title but it’s 3 Lines Long to See if this Amount of Space Can Accommodate Three Lines of Text",
    author: "Kenny Trang",
    date: "08.29.26",
    href: "/news/ksdt-spring-concert",
  },
];

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
  { label: "LIBRARY", href: "/library" },
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
