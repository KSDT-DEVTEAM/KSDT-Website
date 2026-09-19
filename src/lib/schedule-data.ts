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

// Station broadcasts hourly, 9am-10pm.
const HOURLY_START_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

const placeholderDay = (day: string): DaySchedule => ({
  day,
  slots: HOURLY_START_TIMES.map((start) => ({ start, show: "DJ SHOW", dj: "DJ NAME" })),
});

export const weeklySchedule: DaySchedule[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
].map(placeholderDay);

export function formatSlotTime(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return minuteStr === "00" ? `${displayHour}${period}` : `${displayHour}:${minuteStr}${period}`;
}

/** 12-hour clock hour only, no AM/PM (e.g. "13:00" -> "1"), for the schedule pop-up's hour column. */
export function formatSlotHour(time: string): string {
  const hour = Number(time.split(":")[0]);
  return String(hour % 12 === 0 ? 12 : hour % 12);
}
