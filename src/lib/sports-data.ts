// Placeholder content for the Sports page. Swap these for real API/CMS data later.

export type SportsStream = {
  name: string;
  live: boolean;
  /** Direct audio stream URL (radio.co). Omit when the stream has no feed yet. */
  streamUrl?: string;
  sport: string;
  matchup: string;
  broadcasters: string[];
  date: string;
};

export type SportsGame = {
  sport: string;
  matchup: string;
  broadcasters: string[];
  date: string;
};

export const sportsStreams: SportsStream[] = [
  {
    name: "Main Stream",
    live: true,
    streamUrl: "https://s4.radio.co/sdb5184873/listen",
    sport: "MEN’S BASKETBALL",
    matchup: "UC San Diego vs. UC Irvine",
    broadcasters: ["Sasha Duda", "Dean Bakker"],
    date: "Mon, May 4",
  },
  {
    name: "Second Stream",
    live: false,
    sport: "WOMEN’S WATER POLO",
    matchup: "UC San Diego @ CSUN",
    broadcasters: ["Sasha Duda", "Dean Bakker"],
    date: "Tues, May 5",
  },
];

export const upcomingGames: SportsGame[] = Array.from({ length: 5 }, () => ({
  sport: "SOFTBALL",
  matchup: "UC San Diego vs. UC Santa Barbara",
  broadcasters: ["Sasha Duda", "Dean Bakker"],
  date: "Mon, May 4",
}));
