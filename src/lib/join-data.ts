// Content for the Join (Interns and DJs) page. Swap these for real API/CMS data later.

// TODO: swap in the intern application link once it's available.
export const internApplicationHref = "#";

/** Leave as undefined to show a grey placeholder until a photo is added to public/images. */
   export const joinHeroImageSrc: string | undefined = "/images/join-hero.jpg";

export type Department = {
  name: string;
  /**
   * The description, split into pieces that alternate white / pink:
   * even-numbered pieces (1st, 3rd, 5th…) are white, odd-numbered ones are pink.
   */
  description: string[];
};

export const departments: Department[] = [
  {
    name: "AUDIO",
    description: [
      "The Audio Department keeps KSDT’s studio, practice room, and recording spaces running while giving interns ",
      "hands-on experience",
      " with audio equipment and production. Interns learn the basics of ",
      "live sound, recording, DAWs, mixing,",
      " and safe equipment use through weekly meetings and real station projects. They also help support events like Humpday, Open Mics, and Battle of the Bands, gaining experience with live sound setup along the way. The department welcomes ",
      "all experience levels,",
      " from complete beginners to more advanced producers looking to use the studio and get feedback on their work.",
    ],
  },
  {
    name: "COMPUTER ENGINEERING",
    description: [
      "The Computer Engineering Department keeps KSDT’s digital side running, from maintaining this website to building broadcast integrations and supporting other departments’ technical needs. Interns work on real features, solve problems across both software and hardware, and collaborate with teams throughout the station. Along the way, they can gain hands-on experience with ",
      "web development, automation, deployment, hosting, and content management systems.",
      " It’s a great fit for anyone curious about the technical behind-the-scenes of KSDT and interested in using tech to support the rest of the station.",
    ],
  },
  {
    name: "CREATIVE",
    description: [
      "The Creative Department shapes how KSDT looks, sounds, and shows up across social media, print, video, and everything in between. Interns work on real projects like graphics, event promos, social content, copywriting, and larger brand campaigns that actually go live. Along the way, they build skills in ",
      "graphic design, content strategy, social media, and branding",
      " while learning how to take a creative idea from brief to finished product. It’s a good fit for people who are ",
      "curious, self-motivated, and excited to make work people will actually see.",
    ],
  },
  {
    name: "EVENTS",
    description: [
      "The Events Department brings KSDT to life through Open Mics, Battle of the Bands, Jazz Nights, and our annual Spring Concert. Interns help ",
      "plan, curate, budget, and execute",
      " events from start to finish while working with a team of students who care about building community on campus. They also get a hand in choosing artists, shaping event concepts, and helping produce larger-scale live music experiences. It’s a great fit for anyone who loves ",
      "bringing people together",
      " and wants hands-on experience making events happen.",
    ],
  },
  {
    name: "MEDIA",
    description: [
      "The Media Department captures what’s happening at KSDT through ",
      "photography, writing, and storytelling.",
      " Interns shoot concerts and station events, document performances, and write about artists, shows, and the people behind the station. It’s a chance to build a portfolio while getting hands-on experience covering real events and turning them into stories people want to see and read. It’s a great fit for anyone interested in ",
      "music photography, journalism, or documenting creative culture.",
    ],
  },
  {
    name: "MUSIC",
    description: [
      "The Music Department keeps KSDT’s physical media collection organized while constantly digging for ",
      "new, local, and under-the-radar artists",
      " to share with the station. Interns help curate music, manage the library, reach out to artists, and work with physical media like CDs. They also get involved in projects like KSDT’s custom in-house CD mixes, featuring artists across genres and the local scene. It’s a great fit for ",
      "music nerds with broad taste",
      " who love discovering something before everyone else does. Don’t worry, they’re not as pretentious as you think.",
    ],
  },
  {
    name: "NEWS BROADCASTING",
    description: [
      "The News Department researches, writes, and broadcasts stories happening on campus, in San Diego, and beyond. Interns help produce two live news shows each week and create coverage that ",
      "brings a student perspective to stories that may be overlooked elsewhere.",
      " Along the way, they build skills in interviewing, investigative journalism, live broadcasting, time management, and creative problem-solving. It’s a great fit for anyone who cares about current events and ",
      "wants to tell stories that matter.",
    ],
  },
  {
    name: "PROGRAMMING",
    description: [
      "The Programming Department keeps KSDT’s on-air schedule running, from ",
      "DJ applications and scheduling to workshops and day-to-day booth operations.",
      " Interns help support DJs, organize programming logistics, and make sure everything behind the booth runs smoothly. They also get hands-on experience with the systems and processes that keep a student radio station on the air. It’s a great fit for anyone interested in ",
      "what happens behind the mic",
      " and how a station comes together.",
    ],
  },
  {
    name: "SPORTS BROADCASTING",
    description: [
      "The Sports Broadcasting team covers home (and select away) games across 10+ Division I sports. Interns ",
      "call games live, interview players and coaches, and contribute to KSDT’s weekly sports talk show.",
      " It’s a hands-on way to build confidence on the mic and get real experience covering UC San Diego athletics. Great for anyone who loves sports, storytelling, and being part of the action.",
    ],
  },
  {
    name: "SPORTS MARKETING",
    description: [
      "The Sports Marketing team ",
      "runs the department’s social media",
      " and creates content that gets students excited about Triton athletics. Interns design graphics, make short-form videos, promote broadcasts, and create player-focused content that ",
      "helps build campus energy around games.",
      " The team also supports larger projects like Operation Invade Irvine and other fan-engagement campaigns. Great for anyone into sports, social media, and making campus louder.",
    ],
  },
];