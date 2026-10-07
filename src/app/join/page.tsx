import Image from "next/image";
import { departments, joinHeroImageSrc } from "@/lib/join-data";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the Join (Interns and DJs) content in between.
//
// Mobile is one column. Desktop (lg:) has a full-width hero photo, then the content in the same
// 1152px-wide container as the homepage.

// Renders text pieces that alternate white / pink (see `Department` in join-data.ts).
function Highlighted({ pieces }: { pieces: string[] }) {
  return pieces.map((piece, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-ksdt-pink">
        {piece}
      </span>
    ) : (
      piece
    ),
  );
}

export default function Page() {
  return (
    <div className="pb-16 lg:pb-24">
      {/* Hero photo with the headline sitting over its bottom edge. Unlike the rest of the page,
          it breaks out of the site's content column to span the full screen width on every size
          (the same full-bleed trick as the pink title bars). Desktop's main column is already
          full width, so it only needs the trick below lg. */}
      <div className="relative mx-[calc(50%-50vw)] aspect-[402/268] w-screen bg-zinc-800 lg:mx-0 lg:aspect-auto lg:h-[526px] lg:w-full">        {joinHeroImageSrc && (
          <Image
            src={joinHeroImageSrc}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        {/* The headline stays lined up with the page's content column. */}
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md px-4 lg:max-w-[1152px] lg:px-8 lg:pb-7">
          <h1 className="text-5xl/tight font-light lg:text-7xl/tight">
            Come be part of <span className="text-ksdt-pink">our mix.</span>
          </h1>
        </div>
      </div>

      <div className="px-4 lg:mx-auto lg:max-w-[1152px] lg:px-8">
        <p className="mt-8 font-light lg:mt-12 lg:text-lg">
          DJs at KSDT are required to participate in our intern program for{" "}
          <span className="text-ksdt-pink">at least one quarter prior to applying to DJ.</span>{" "}
          Interns can participate in a wide variety of the station’s departments. Learn more below.
        </p>

        <h2 className="mt-12 text-2xl font-bold lg:mt-10 lg:text-4xl/[normal]">Our Departments</h2>

        <div className="mt-8 flex flex-col gap-10 lg:mt-12 lg:gap-12">
          {departments.map((department) => (
            <section key={department.name}>
              <h3 className="font-mono text-xl lg:text-2xl">{department.name}</h3>
              <p className="mt-3 font-light lg:mt-5 lg:text-lg">
                <Highlighted pieces={department.description} />
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}