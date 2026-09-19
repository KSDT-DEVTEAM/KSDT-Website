"use client";

import { useState } from "react";
import { liveShow } from "@/lib/placeholder-data";
import { ScheduleModal } from "@/components/ScheduleModal";

export function LiveShowBanner() {
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <section className="w-screen mx-[calc(50%-50vw)] bg-[rgba(255,141,202,0.4)]">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-4 pt-[14px] pb-[13px]">
        <div className="flex flex-col gap-[5px]">
          <p className="text-lg font-bold">{liveShow.title}</p>
          <p className="text-sm font-light">{liveShow.hosts}</p>
        </div>
        <button
          type="button"
          onClick={() => setScheduleOpen(true)}
          className="shrink-0 whitespace-nowrap text-lg font-light underline underline-offset-2"
        >
          See Schedule
        </button>
      </div>

      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </section>
  );
}
