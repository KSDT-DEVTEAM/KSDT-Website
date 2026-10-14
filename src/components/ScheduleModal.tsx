"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  formatSlotHour,
  getLocalWeeklySchedule,
  slotMinutes,
  type DaySchedule,
} from "@/lib/schedule-data";

const minutesIntoDay = (date: Date) => date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;

// True once the day's last show has ended.
function isPastLastSlot(day: DaySchedule, date: Date) {
  const last = day.slots.at(-1);
  return !last || minutesIntoDay(date) >= slotMinutes(last.start) + 60;
}

type ScheduleModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ScheduleModal({ open, onClose }: ScheduleModalProps) {
  const [dayIndex, setDayIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Keep the "now" indicator live while the pop-up is open, without
  // clobbering a day the person navigated to with the <</>> arrows.
  useEffect(() => {
    if (!open) return;

    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, [open]);

  // On open, jump to today's schedule — or, once today's last show has ended,
  // to tomorrow's, so the indicator has a day to land on.
  useEffect(() => {
    if (!open) return;
    const current = new Date();
    const today = getLocalWeeklySchedule(current)[current.getDay()];
    setDayIndex(isPastLastSlot(today, current) ? (current.getDay() + 1) % 7 : current.getDay());
  }, [open]);

  // Shown in the visitor's own time zone; `now` is set as soon as the pop-up opens.
  if (!open || !now) return null;
  const schedule = getLocalWeeklySchedule(now);

  const dayCount = schedule.length;
  const activeDay = schedule[dayIndex];
  const showPrevDay = () => setDayIndex((i) => (i - 1 + dayCount) % dayCount);
  const showNextDay = () => setDayIndex((i) => (i + 1) % dayCount);

  // Where the current-time indicator belongs, if anywhere on this day, and how far
  // through that hour's block it sits (0 = top of the hour, 1 = bottom).
  let indicatorIndex = -1;
  let indicatorFraction = 0;
  const pastToday = isPastLastSlot(schedule[now.getDay()], now);
  const indicatorDay = pastToday ? (now.getDay() + 1) % 7 : now.getDay();
  if (indicatorDay === dayIndex) {
    const current = minutesIntoDay(now);
    const onAir = pastToday
      ? -1
      : activeDay.slots.findIndex(
          (slot) => current >= slotMinutes(slot.start) && current < slotMinutes(slot.start) + 60,
        );
    if (onAir !== -1) {
      indicatorIndex = onAir;
      indicatorFraction = (current - slotMinutes(activeDay.slots[onAir].start)) / 60;
    } else {
      // Between shows (or before tomorrow's first): sit at the top of the next show.
      indicatorIndex = pastToday ? 0 : activeDay.slots.findIndex((slot) => slotMinutes(slot.start) > current);
      indicatorFraction = 0;
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close schedule"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Weekly DJ schedule"
        className="relative z-10 flex h-4/5 min-h-0 w-full max-w-md flex-col overflow-hidden border border-white bg-black text-white"
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-end">
            <button type="button" aria-label="Close schedule" onClick={onClose}>
              <Image src="/images/pop-up-x.svg" alt="" width={16} height={16} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous day"
              onClick={showPrevDay}
              className="font-['Helvetica_Neue'] text-2xl leading-none"
            >
              &lt;&lt;
            </button>
            <h2 className="text-2xl font-bold">{activeDay.day}</h2>
            <button
              type="button"
              aria-label="Next day"
              onClick={showNextDay}
              className="font-['Helvetica_Neue'] text-2xl leading-none"
            >
              &gt;&gt;
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-2">
            {activeDay.slots.map((slot, index) => (
              <div key={`${slot.start}-${index}`} className="relative flex items-stretch border border-white">
                {indicatorIndex === index && <NowIndicator fraction={indicatorFraction} />}
                <div className="flex min-w-[30px] shrink-0 items-center justify-center border-r border-white px-1 text-ksdt-pink">
                  {formatSlotHour(slot.start)}
                </div>
                {/* Fixed height keeps one-line and empty slots the same size as show + DJ slots. */}
                <div className="flex min-h-14 flex-1 flex-col justify-center px-4 py-2">
                  <span className="text-sm font-bold">{slot.show}</span>
                  {slot.dj && <span className="text-sm font-light">{slot.dj}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Current-time marker, matching the Figma pop-up's pink line + dot (node 825:218 / 825:219).
 * Absolutely positioned within its hour's row — hovering on top of the box rather than taking
 * up its own space in the layout — at `fraction` (0 = top of the hour, 1 = bottom), so it
 * tracks the actual minute of the hour as time passes.
 */
function NowIndicator({ fraction }: { fraction: number }) {
  return (
    <div
      className="pointer-events-none absolute -left-2 -right-2 z-10 h-[7px] -translate-y-1/2 opacity-75"
      style={{ top: `${fraction * 100}%` }}
      aria-hidden="true"
    >
      <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 bg-ksdt-pink" />
      <div className="absolute left-0 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-ksdt-pink" />
    </div>
  );
}
