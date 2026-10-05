import { audioInternApplicationHref, roomCalendarEmbedSrc } from "@/lib/book-data";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the Practice Rooms content in between.

export default function Page() {
  return (
    <>
      {/* Pink title bar, full width like the News page's. */}
      <div className="mx-[calc(50%-50vw)] w-screen bg-[rgba(255,141,202,0.4)]">
        <h1 className="mx-auto flex h-16 max-w-md items-center px-4 text-2xl font-bold">
          Practice Rooms
        </h1>
      </div>

      {/* Desktop layout isn't designed yet, so keep the mobile column centered. */}
      <div className="px-4 pt-6 pb-16 font-light lg:mx-auto lg:max-w-md">
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

        {roomCalendarEmbedSrc ? (
          <iframe
            src={roomCalendarEmbedSrc}
            title="Practice room availability calendar"
            className="mt-6 h-[815px] w-full border-0 bg-white"
            loading="lazy"
          />
        ) : (
          <div className="mt-6 grid h-[815px] w-full place-items-center bg-zinc-800 font-mono text-sm">
            Calendar coming soon
          </div>
        )}
      </div>
    </>
  );
}