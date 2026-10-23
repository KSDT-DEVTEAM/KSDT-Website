// Site navigation. Media and News posts come from Sanity: see src/sanity/lib/posts.ts.

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
      // { label: "BOOK A PRACTICE ROOM", href: "/book-a-room" },
    ],
  },
  { label: "ABOUT", href: "/about" },
];
