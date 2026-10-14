"use client";

import { useMemo, useSyncExternalStore } from "react";
import { formatSlotTime, getShowAt } from "@/lib/schedule-data";

// Re-checks the clock every 30s; the snapshot only changes once a minute.
const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
};
const getMinute = () => Math.floor(Date.now() / 60_000);

/**
 * The show on air right now in the visitor's time zone, or the next one up. Null during the
 * server render, since the server doesn't know the visitor's clock.
 */
export function useCurrentShow() {
  const minute = useSyncExternalStore(subscribe, getMinute, () => null);
  return useMemo(() => (minute === null ? null : getShowAt(new Date(minute * 60_000))), [minute]);
}

/** Banner-style title for the current show, e.g. "LIVE: TAG" or "Up Next at 11AM: TAG". */
export function formatShowTitle(current: ReturnType<typeof getShowAt>) {
  if (!current) return "";
  const { slot, live } = current;
  // Slot times are already in the visitor's time zone.
  return live ? `LIVE: ${slot.show}` : `Up Next at ${formatSlotTime(slot.start)}: ${slot.show}`;
}
