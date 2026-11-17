import { NextResponse } from "next/server";

type Spin = {
  song: string;
  artist: string;
  release: string | null;
  image: string | null;
  end: string;
};

// DJs often log a song a little after it starts, so keep showing it briefly past its end time.
const GRACE_MS = 2 * 60 * 1000;

// How far Pacific time is from UTC at a given moment (handles daylight saving).
function pacificOffsetMs(utcMs: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(utcMs);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asIfUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asIfUtc - utcMs;
}

// KSDT's Spinitron account is set to New York time, so its timestamps carry the wrong offset
// (e.g. "13:10:43-0500" for a song logged at 1:10pm Pacific). Ignore the offset and read the
// clock time as Pacific, which stays correct even if the Spinitron setting is fixed later.
function parseSpinitronTime(time: string) {
  const clockTimeAsUtc = new Date(time.slice(0, 19) + "Z").getTime();
  return clockTimeAsUtc - pacificOffsetMs(clockTimeAsUtc);
}

// Spinitron's cover art comes in small sizes like 150x150; Apple's image server can return a
// bigger version of the same image if you ask for it in the URL.
function largerArtwork(url: string | null) {
  return url ? url.replace(/\/\d+x\d+bb\.jpg$/, "/600x600bb.jpg") : null;
}

// Runs on the server, so the Spinitron API key never reaches the browser.
export async function GET() {
  const apiKey = process.env.SPINITRON_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SPINITRON_API_KEY is not set" }, { status: 500 });
  }

  const res = await fetch("https://spinitron.com/api/spins?count=1", {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Spinitron request failed" }, { status: 502 });
  }

  const data: { items: Spin[] } = await res.json();

  const spin = data.items[0];

  // Spinitron always returns the last song anyone logged, even if that was days ago.
  // Only show it while it's playing; otherwise the card falls back to the scheduled show and DJ.
  if (!spin || parseSpinitronTime(spin.end) + GRACE_MS < Date.now()) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    trackTitle: spin.song,
    trackArtist: spin.artist,
    album: spin.release ?? "",
    artworkSrc: largerArtwork(spin.image),
  });
}