// Upcoming games for the Sports page, read from the station's Google Calendar.
//
// The calendar is the shared staff calendar, so only events whose title starts with "[Game]" are
// used, and only the fields the page shows (sport, matchup, date, broadcasters) leave this file.
// Everything else in the calendar stays on the server.
//
// SPORTS_CALENDAR_ICS_URL is the calendar's "Secret address in iCal format" (Google Calendar →
// Settings → the calendar → Integrate calendar). Anyone with that link can read the whole calendar,
// so it lives in an env var (.env.local locally, a Cloudflare secret in production) and never in code.
//
// Event format:
//   Title:       [Game] Women's Volleyball vs. UC Irvine (Home)
//   Description: lines "Broadcaster #1: Sasha Duda" and "Broadcaster #2: Dean Bakker" ("-" for nobody yet)

import { connection } from "next/server";
import type { SportsGame } from "./sports-data";

const TIME_ZONE = "America/Los_Angeles";
const GAME_TAG = /^\s*\[game\]\s*/i;

type CalendarEvent = {
  summary: string;
  description: string;
  /** Pacific wall-clock start as "YYYYMMDDTHHMMSS" (or "YYYYMMDD" for all-day events), so it sorts as a string. */
  start: string;
  /** Same format as `start`. Exclusive; for all-day events it's the day after. */
  end: string;
};

// iCal escapes commas, semicolons, backslashes and newlines in text values.
function unescapeText(value: string) {
  return value.replace(/\\([\\;,nN])/g, (_, c: string) => (c === "n" || c === "N" ? "\n" : c));
}

// Pacific "YYYYMMDDTHHMMSS" for an instant.
function pacificStamp(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}${parts.month}${parts.day}T${parts.hour}${parts.minute}${parts.second}`;
}

// DTSTART/DTEND come as UTC ("…Z"), as local time with a TZID (the calendar's own zone, Pacific),
// or as a bare date for all-day events.
function parseTime(value: string) {
  const utc = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (utc) {
    const [, y, mo, d, h, mi, s] = utc.map(Number);
    return pacificStamp(new Date(Date.UTC(y, mo - 1, d, h, mi, s)));
  }
  return value;
}

function parseEvents(ics: string): CalendarEvent[] {
  // Long lines are folded onto continuation lines that start with a space or tab.
  const lines = ics.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const events: CalendarEvent[] = [];
  let current: (CalendarEvent & { cancelled: boolean }) | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = { summary: "", description: "", start: "", end: "", cancelled: false };
      continue;
    }
    if (!current) continue;
    if (line === "END:VEVENT") {
      if (!current.cancelled && current.start) {
        const { summary, description, start, end } = current;
        // Events without an end (rare from Google) are never live.
        events.push({ summary, description, start, end: end || start });
      }
      current = null;
      continue;
    }

    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const name = line.slice(0, colon).split(";")[0].toUpperCase();
    const value = line.slice(colon + 1);

    if (name === "SUMMARY") current.summary = unescapeText(value);
    else if (name === "DESCRIPTION") current.description = unescapeText(value);
    else if (name === "DTSTART") current.start = parseTime(value);
    else if (name === "DTEND") current.end = parseTime(value);
    else if (name === "STATUS") current.cancelled = value.toUpperCase() === "CANCELLED";
  }

  return events;
}

// "Women's Volleyball vs. UC Irvine (Home)" → sport "WOMEN’S VOLLEYBALL", matchup "UC San Diego vs. UC Irvine".
// Away games ("(Away)", or "@"/"at" in place of "vs.") become "UC San Diego @ Opponent".
// Titles that don't fit the pattern are shown as-is.
function parseTitle(title: string) {
  const match = title.match(/^(.+?)\s+(vs\.?|@|at)\s+(.+?)(?:\s*\((home|away)\))?$/i);
  if (!match) return { sport: "", matchup: title };

  const [, sport, separator, opponent, venue] = match;
  const away = venue ? venue.toLowerCase() === "away" : !separator.toLowerCase().startsWith("vs");
  return {
    sport: sport.replace(/'/g, "’").toUpperCase(),
    matchup: `UC San Diego ${away ? "@" : "vs."} ${opponent}`,
  };
}

// "Broadcaster #1: Sasha Duda" / "Broadcaster #2: -" → ["Sasha Duda"], in number order.
// Descriptions edited in Google's rich-text editor arrive as HTML, so line breaks may be <br> tags.
function parseBroadcasters(description: string) {
  const text = description.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
  return [...text.matchAll(/^\s*broadcaster\s*#?\s*(\d+)\s*:\s*(.*)$/gim)]
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map((match) => match[2].trim())
    .filter((name) => name && !/^-+$/.test(name));
}

// "20261024…" → "Sat, Oct 24"
function formatDate(start: string) {
  const date = new Date(Date.UTC(Number(start.slice(0, 4)), Number(start.slice(4, 6)) - 1, Number(start.slice(6, 8))));
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric" }).format(date);
}

/** The next `limit` games that haven't ended yet, soonest first. Empty if the calendar can't be read. */
export async function getUpcomingGames(limit = 5): Promise<SportsGame[]> {
  // Fetch at request time so calendar edits show up without a redeploy.
  await connection();

  const url = process.env.SPORTS_CALENDAR_ICS_URL;
  if (!url) {
    console.warn("SPORTS_CALENDAR_ICS_URL is not set; the Sports page has no upcoming games.");
    return [];
  }

  let ics: string;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    ics = await res.text();
  } catch (error) {
    // Don't log the URL: it's the calendar's secret address.
    console.error("Couldn't load the sports calendar:", error);
    return [];
  }

  // Stamps share one format, so plain string comparison orders them. An all-day event's bare
  // date sorts before any time that day, so it counts as live for the whole day.
  const now = pacificStamp(new Date());

  return parseEvents(ics)
    .filter((event) => GAME_TAG.test(event.summary) && event.end > now)
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, limit)
    .map((event) => ({
      ...parseTitle(event.summary.replace(GAME_TAG, "").trim()),
      broadcasters: parseBroadcasters(event.description),
      date: formatDate(event.start),
      live: event.start <= now,
    }));
}
