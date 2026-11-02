// Stream content for the Sports page. Games come from the station calendar (see sports-calendar.ts).

export type SportsStream = {
  name: string;
  live: boolean;
  /** Direct audio stream URL (radio.co). Omit when the stream has no feed yet. */
  streamUrl?: string;
  /**
   * YouTube channel ID (the UC… ID, not the @handle) whose current live stream this plays as audio,
   * instead of `streamUrl`. The button is always enabled, since the site can't tell whether the
   * channel is live until it tries to play.
   */
  youtubeChannelId?: string;
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
  /** True while the game is on (between its calendar start and end). */
  live: boolean;
};

/** Stream details shown when a stream has no game: Second Stream always, Main Stream when the calendar has none. */
export const noGame: SportsGame = {
  sport: "KSDT SPORTS",
  matchup: "No game scheduled",
  broadcasters: [],
  date: "",
  live: false,
};

// The game fields (and `live`) are filled in on the Sports page: Main Stream shows the next game from the calendar.
export const sportsStreams: Omit<SportsStream, keyof SportsGame>[] = [
  {
    name: "Main Stream",
    streamUrl: "https://s4.radio.co/sdb5184873/listen",
  },
  {
    name: "Second Stream",
    // youtube.com/@ksdtsports
    youtubeChannelId: "UCT3bxGXjs4e6sIsq4vINHBQ",
  },
];
