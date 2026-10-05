import Image from "next/image";
import { departments, internApplicationHref, joinHeroImageSrc } from "@/lib/join-data";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the Join (Interns and DJs) content in between.

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
    // Desktop layout isn't designed yet, so keep the mobile column centered.
    <div className="pb-16 lg:mx-auto lg:max-w-md">
      {/* Hero photo with the headline sitting over its bottom edge. */}
      <div className="relative mt-2 aspect-[402/268] w-full bg-zinc-800">
        {joinHeroImageSrc && (
          <Image src={joinHeroImageSrc} alt="" fill priority className="object-cover" sizes="448px" />
        )}
        <h1 className="absolute inset-x-4 bottom-0 text-5xl/tight font-light">
          Come be part of <span className="text-ksdt-pink">our mix.</span>
        </h1>
      </div>

      <div className="px-4">
        <a href={internApplicationHref} className="mt-8 block font-bold underline">
          Apply here to be an intern this fall by Friday, October 2!
        </a>

        <p className="mt-6 font-light">
          DJs at KSDT are required to participate in our intern program for{" "}
          <span className="text-ksdt-pink">at least one quarter prior to applying to DJ.</span>{" "}
          Interns can participate in a wide variety of the station’s departments. Learn more below.
        </p>

        <h2 className="mt-12 text-2xl font-bold">Our Departments</h2>

        <div className="mt-8 flex flex-col gap-10">
          {departments.map((department) => (
            <section key={department.name}>
              <h3 className="font-mono text-xl">{department.name}</h3>
              <p className="mt-3 font-light">
                <Highlighted pieces={department.description} />
              </p>
            </section>
          ))}
        </div>

        <a href={internApplicationHref} className="mt-12 block text-sm font-light underline">
          Apply here to be an intern this fall by Friday, October 2!
        </a>
      </div>
    </div>
  );
}