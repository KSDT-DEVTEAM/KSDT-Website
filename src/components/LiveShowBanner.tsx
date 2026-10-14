"use client";

import { useState } from "react";
import { formatShowTitle, useCurrentShow } from "@/lib/use-current-show";
import { ScheduleModal } from "@/components/ScheduleModal";

export function LiveShowBanner() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const current = useCurrentShow();
  const title = formatShowTitle(current);
  const dj = current?.slot.dj ?? "";

  return (
    <section className="w-screen mx-[calc(50%-50vw)] bg-[rgba(255,141,202,0.4)]">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-4 pt-[14px] pb-[13px] lg:max-w-none lg:py-3 lg:pl-[35px] lg:pr-8">
        {/* An invisible two-line copy holds the banner at full height, so a show with no DJ
            line (or the moment before the visitor's clock is known) sits vertically centered. */}
        <div className="grid min-w-0">
          <div aria-hidden className="invisible col-start-1 row-start-1 flex flex-col gap-[5px]">
            <p className="text-lg font-bold lg:leading-[normal]">&nbsp;</p>
            <p className="text-sm font-light lg:text-lg/[normal]">&nbsp;</p>
          </div>
          <div className="col-start-1 row-start-1 flex flex-col justify-center gap-[5px]">
            {title && <p className="text-lg font-bold lg:leading-[normal]">{title}</p>}
            {dj && <p className="text-sm font-light lg:text-lg/[normal]">{dj}</p>}
          </div>
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
