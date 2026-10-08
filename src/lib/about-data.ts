// Content for the About page. Swap these for real API/CMS data later.

export const aboutHeroImageSrc = "/images/about-hero.png";

export type StaffMember = {
  role: string;
  name: string;
  email: string;
  /** Leave out to show the "photos coming soon..." box until a photo is added to public/images. */
  imageSrc?: string;
};

export type StaffGroup = {
  /** Small heading above the group. Leave out for the top group (General / Operations Manager). */
  heading?: string;
  members: StaffMember[];
};

export const staffGroups: StaffGroup[] = [
  {
    members: [
      { role: "GENERAL MANAGER", name: "Annasophia Abrille", email: "annasophia@ksdt.org" },
      { role: "OPERATIONS MANAGER", name: "Emery Folsom", email: "emery@ksdt.org" },
    ],
  },
  {
    heading: "Outreach",
    members: [{ role: "OUTREACH DIRECTOR", name: "Aiswarya Aluru", email: "aiswarya@ksdt.org" }],
  },
  {
    heading: "Music",
    members: [{ role: "MUSIC DIRECTOR", name: "Sabrina Arruda", email: "sabrina@ksdt.org" }],
  },
  {
    heading: "Programming",
    members: [{ role: "PROGRAMMING DIRECTOR", name: "Natalie Ambler", email: "natalie@ksdt.org" }],
  },
  {
    heading: "Computer Engineering",
    members: [{ role: "COMPUTER ENGINEER", name: "Emmanuel Leyva", email: "emmanuel@ksdt.org" }],
  },
  {
    heading: "Creative",
    members: [{ role: "CREATIVE DIRECTOR", name: "Brooke Kennedy", email: "brooke@ksdt.org" }],
  },
  {
    heading: "Media",
    members: [{ role: "MEDIA DIRECTOR", name: "Emma Cam", email: "emma@ksdt.org" }],
  },
  {
    heading: "Events",
    members: [{ role: "EVENTS DIRECTOR", name: "Marley Ponce De Leon", email: "marley@ksdt.org" }],
  },
  {
    heading: "News Broadcasting",
    members: [
      { role: "NEWS DIRECTOR", name: "Henni Kim", email: "henni@ksdt.org" },
      { role: "NEWS DIRECTOR", name: "Kenny Trang", email: "kenny@ksdt.org" },
    ],
  },
  {
    heading: "Sports",
    members: [
      { role: "SPORTS BROADCASTING DIRECTOR", name: "Sasha Duda", email: "sasha@ksdt.org" },
      { role: "SPORTS MARKETING DIRECTOR", name: "Caitlyn Lee", email: "caitlyn@ksdt.org" },
    ],
  },
  {
    heading: "Audio",
    members: [
      { role: "AUDIO DIRECTOR", name: "Freya Allen", email: "freya@ksdt.org" },
      { role: "AUDIO DIRECTOR", name: "Angie Kim", email: "angie@ksdt.org" },
      { role: "AUDIO DIRECTOR", name: "Angel Olguin", email: "angel@ksdt.org" },
    ],
  },
];