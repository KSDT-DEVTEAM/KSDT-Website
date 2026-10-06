import { audioInternApplicationHref, roomCalendarEmbedSrc } from "@/lib/book-a-room-data";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the Practice Rooms content in between.
//
// Mobile is one column. Desktop (lg:) uses the same 1152px-wide container as the homepage, with
// the booking calendar inside a translucent rounded "Schedule" card.

export default function Page() {
  return (
    <>
      {/* Pink title bar, full width like the News page's. */}
      <div className="mx-[calc(50%-50vw)] w-screen bg-[rgba(255,141,202,0.4)]">
        <h1 className="mx-auto flex h-16 max-w-md items-center px-4 text-2xl font-bold lg:h-20 lg:max-w-none lg:px-8 lg:text-4xl">
          Practice Rooms
        </h1>
      </div>

      <div className="px-4 pt-6 pb-16 font-light lg:mx-auto lg:max-w-[1152px] lg:px-8 lg:pt-[68px] lg:pb-24 lg:text-lg">
        <p>KSDT offers the following services to UC San Diego students, free of charge:</p>

        <ul className="mt-6">
          <li>
            <span className="text-ksdt-pink">Practice room,</span> with amps and drum kits
          </li>
          <li>
            <span className="text-ksdt-pink">Control room,</span> for mixing and recording
          </li>
          <li>
            <span className="text-ksdt-pink">Studio equipment and mics</span> (audio interns only)
          </li>
        </ul>
        <a href={audioInternApplicationHref} className="underline">
          Apply to be an audio intern here!
        </a>

        <p className="mt-6">See our calendar below to find available times.</p>

        {/* On desktop the calendar sits in a translucent card with a "Schedule" heading. */}
        <div className="mt-6 lg:mt-8 lg:max-w-[896px] lg:rounded-3xl lg:bg-white/20 lg:px-8 lg:pt-[22px] lg:pb-8">
          <h2 className="hidden text-2xl font-bold lg:block">Schedule</h2>
          {roomCalendarEmbedSrc ? (
            <iframe
              src={roomCalendarEmbedSrc}
              title="Practice room availability calendar"
              className="h-[815px] w-full border-0 bg-white lg:mt-5 lg:h-[468px] lg:rounded-md"
              loading="lazy"
            />
          ) : (
            <div className="grid h-[815px] w-full place-items-center bg-zinc-800 font-mono text-sm lg:mt-5 lg:h-[468px] lg:rounded-md">
              Calendar coming soon
            </div>
          )}
        </div>
      </div>
    </>
  );
}