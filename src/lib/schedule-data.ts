// DJ schedule content. Station staff update this roughly every 3 months.
//
// To swap in a live CMS later (e.g. a published Google Sheet as CSV), replace
// the body of `getWeeklySchedule` with a fetch, keeping the return shape the
// same — nothing that reads `weeklySchedule` needs to change.

export type ScheduleSlot = {
  /** 24-hour "HH:mm" */
  start: string;
  /** Show/DJ name, or an event title if this hour is an event block. */
  show: string;
  /** DJ name, or event detail (e.g. venue/time) if this hour is an event block. */
  dj: string;
};

export type DaySchedule = {
  day: string;
  slots: ScheduleSlot[];
};

// Fall 2026 schedule, hardcoded from schedule-fall-26.csv (each cell is the show
// title, then the DJ name on the next line). A blank show/dj means nothing is
// scheduled for that hour. Station broadcasts hourly, 10am-8pm Pacific time.
export const weeklySchedule: DaySchedule[] = [
  {
    day: "Sunday",
    slots: [
      { start: "10:00", show: "", dj: "" },
      { start: "11:00", show: "Ryno", dj: "Ryno" },
      { start: "12:00", show: "J-ROCK Corner", dj: "massacresummer" },
      { start: "13:00", show: "Railroad Earth", dj: "DJ jacknasty" },
      { start: "14:00", show: "Animal Aux", dj: "Phytoplankton + Zooplankton" },
      { start: "15:00", show: "Huge News for the Unemployed", dj: "Soph" },
      { start: "16:00", show: "little birdy told me", dj: "DJ MJ" },
      { start: "17:00", show: "never die", dj: "halica" },
      { start: "18:00", show: "", dj: "" },
      { start: "19:00", show: "", dj: "" },
    ],
  },
  {
    day: "Monday",
    slots: [
      { start: "10:00", show: "who let her on aux?!", dj: "nata" },
      { start: "11:00", show: "TAG", dj: "briyenda" },
      { start: "12:00", show: "The true dirt", dj: "D33Jdrilll" },
      { start: "13:00", show: "ZERAMINAPOLIS", dj: "DJ NAMIN + DJ ZERA" },
      { start: "14:00", show: "Headphones On!", dj: "dj radio + dj rebel" },
      { start: "15:00", show: "physical digital", dj: "Fizzy + Digi" },
      { start: "16:00", show: "Songs to Learn and Sing", dj: "dj hernia" },
      { start: "17:00", show: "KSDT News", dj: "" },
      { start: "18:00", show: "Lost & Found", dj: "DJ EYE DECΔY" },
      { start: "19:00", show: "Alphabet Soup", dj: "Dj Feedback + Dj Slab" },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { start: "10:00", show: "THE DISHROOM", dj: "Huesito" },
      { start: "11:00", show: "Bird's Boombox", dj: "DJ BirdBrains" },
      { start: "12:00", show: "drink it backwards", dj: "kate" },
      { start: "13:00", show: "Airing Out the Laundry", dj: "DJ Dad Dirty" },
      { start: "14:00", show: "Mustour", dj: "Red glitter" },
      { start: "15:00", show: "C", dj: "CDVISION" },
      { start: "16:00", show: "Ethereal Cereal", dj: "Seshmaster Flex" },
      { start: "17:00", show: "Stoked!", dj: "heel bite" },
      { start: "18:00", show: "spinning silk", dj: "Indaye" },
      { start: "19:00", show: "liverounds", dj: "dev" },
    ],
  },
  {
    day: "Wednesday",
    slots: [
      { start: "10:00", show: "wpmo", dj: "zoop" },
      { start: "11:00", show: "Thrash Talk w/Thrash Dog", dj: "Thrash Dog" },
      { start: "12:00", show: "brainfood", dj: "mEmeryLane" },
      { start: "13:00", show: "Luxx Life", dj: "luxus" },
      { start: "14:00", show: "Lucky Stars", dj: "DJ BK" },
      { start: "15:00", show: "J3ST N0iSE", dj: "DJ JSTR" },
      { start: "16:00", show: "KSDT Events", dj: "" },
      { start: "17:00", show: "KSDT Events", dj: "" },
      { start: "18:00", show: "KSDT Events", dj: "" },
      { start: "19:00", show: "KSDT Events", dj: "" },
    ],
  },
  {
    day: "Thursday",
    slots: [
      { start: "10:00", show: "40 going on 20", dj: "Roylin Reed" },
      { start: "11:00", show: "soundtracked", dj: "kp" },
      { start: "12:00", show: "X-Actly", dj: "DJ Kohbian" },
      { start: "13:00", show: "Superspinned!", dj: "DJ Shay + DJ Jenna" },
      { start: "14:00", show: "New Frequencies", dj: "VersionOne" },
      { start: "15:00", show: "Pierre", dj: "ïlaï" },
      { start: "16:00", show: "The Lovely Mesopotamians", dj: "DJ Gilgamesh + DJ Zargon" },
      { start: "17:00", show: "KSDT News", dj: "" },
      { start: "18:00", show: "weird girl starter pack", dj: "DJ weird girl" },
      { start: "19:00", show: "KSDT Music", dj: "" },
    ],
  },
  {
    day: "Friday",
    slots: [
      { start: "10:00", show: "Open Booth", dj: "" },
      { start: "11:00", show: "Open Booth", dj: "" },
      { start: "12:00", show: "Open Booth", dj: "" },
      { start: "13:00", show: "Open Booth", dj: "" },
      { start: "14:00", show: "Open Booth", dj: "" },
      { start: "15:00", show: "Open Booth", dj: "" },
      { start: "16:00", show: "Open Booth", dj: "" },
      { start: "17:00", show: "Open Booth", dj: "" },
      { start: "18:00", show: "Open Booth", dj: "" },
      { start: "19:00", show: "Open Booth", dj: "" },
    ],
  },
  {
    day: "Saturday",
    slots: [
      { start: "10:00", show: "Open Booth", dj: "" },
      { start: "11:00", show: "Open Booth", dj: "" },
      { start: "12:00", show: "Open Booth", dj: "" },
      { start: "13:00", show: "Open Booth", dj: "" },
      { start: "14:00", show: "Open Booth", dj: "" },
      { start: "15:00", show: "Open Booth", dj: "" },
      { start: "16:00", show: "Open Booth", dj: "" },
      { start: "17:00", show: "Open Booth", dj: "" },
      { start: "18:00", show: "Open Booth", dj: "" },
      { start: "19:00", show: "Open Booth", dj: "" },
    ],
  },
];

// The schedule above is in the station's local time.
const STATION_TIME_ZONE = "America/Los_Angeles";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const pad = (value: number) => String(value).padStart(2, "0");

// Wall-clock date and time of `date` in the station's time zone.
function stationClock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STATION_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)!.value);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute") };
}

// The moment the station's clock reads the given date and time. `day` may overflow the month.
function fromStationClock(year: number, month: number, day: number, hour: number, minute: number) {
  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  const clock = stationClock(new Date(asUtc));
  const offset = Date.UTC(clock.year, clock.month - 1, clock.day, clock.hour, clock.minute) - asUtc;
  return new Date(asUtc - offset);
}

/**
 * The weekly schedule converted to the visitor's time zone: each slot's `start` is in their
 * local time and it's filed under their local day (Sunday first), so a show can move to a
 * different day for visitors far from San Diego. `now` picks the week, which matters for DST.
 */
export function getLocalWeeklySchedule(now: Date): DaySchedule[] {
  const today = stationClock(now);
  const todayIndex = new Date(Date.UTC(today.year, today.month - 1, today.day)).getUTCDay();
  const days: DaySchedule[] = DAY_NAMES.map((day) => ({ day, slots: [] }));

  weeklySchedule.forEach((stationDay, stationDayIndex) => {
    for (const slot of stationDay.slots) {
      const [hour, minute] = slot.start.split(":").map(Number);
      const startsAt = fromStationClock(
        today.year,
        today.month,
        today.day + stationDayIndex - todayIndex,
        hour,
        minute,
      );
      days[startsAt.getDay()].slots.push({
        ...slot,
        start: `${pad(startsAt.getHours())}:${pad(startsAt.getMinutes())}`,
      });
    }
  });

  for (const day of days) day.slots.sort((a, b) => a.start.localeCompare(b.start));
  return days;
}

/** Minutes after midnight for a 24-hour "HH:mm" time. */
export function slotMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function formatSlotTime(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return minuteStr === "00" ? `${displayHour}${period}` : `${displayHour}:${minuteStr}${period}`;
}

/**
 * 12-hour clock hour only, no AM/PM (e.g. "13:00" -> "1"), for the schedule pop-up's hour column.
 * Keeps the minutes for time zones offset by a half hour (e.g. "13:30" -> "1:30").
 */
export function formatSlotHour(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const displayHour = String(hour % 12 === 0 ? 12 : hour % 12);
  return minuteStr === "00" ? displayHour : `${displayHour}:${minuteStr}`;
}

/**
 * The show on air at `date` (`live: true`), or failing that the next scheduled one. Empty
 * slots are skipped, so an unscheduled hour reports the upcoming show instead.
 */
export function getShowAt(date: Date): { slot: ScheduleSlot; live: boolean } | null {
  const days = getLocalWeeklySchedule(date);
  const current = date.getHours() * 60 + date.getMinutes();

  for (let offset = 0; offset < 8; offset++) {
    const day = days[(date.getDay() + offset) % 7];
    for (const slot of day.slots) {
      if (!slot.show) continue;
      const start = slotMinutes(slot.start);
      if (offset === 0 && current >= start && current < start + 60) return { slot, live: true };
      // Later today, any time on a following day, or a week out on today's weekday.
      if ((offset === 0 && start > current) || (offset > 0 && offset < 7) || (offset === 7 && start <= current)) {
        return { slot, live: false };
      }
    }
  }
  return null;
}
