import Image from "next/image";
import { aboutHeroImageSrc, staffGroups, type StaffMember } from "@/lib/about-data";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the About content in between.

function MailIcon() {
  return (
    <svg viewBox="0 0 14 12" aria-hidden="true" className="h-3 w-3.5 shrink-0 fill-none stroke-white">
      <rect x="0.5" y="0.5" width="13" height="11" rx="1" />
      <path d="M0.5 1.5 7 7l6.5-5.5" />
    </svg>
  );
}

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <li className="flex items-end gap-3 pl-4">
      <div className="relative grid h-36 w-28 shrink-0 place-items-center border border-white bg-neutral-700">
        {member.imageSrc ? (
          <Image src={member.imageSrc} alt={member.name} fill className="object-cover" sizes="112px" />
        ) : (
          <p className="w-16 text-center text-xs text-black">photos coming soon...</p>
        )}
      </div>
      <div className="min-w-0 pb-2">
        <p className="font-mono text-ksdt-pink">{member.role}</p>
        <p className="text-2xl/tight font-extralight">{member.name}</p>
        <a href={`mailto:${member.email}`} className="mt-1 flex items-center gap-1.5 font-light">
          <MailIcon />
          {member.email}
        </a>
      </div>
    </li>
  );
}

export default function Page() {
  return (
    // Desktop layout isn't designed yet, so keep the mobile column centered.
    <div className="pb-16 lg:mx-auto lg:max-w-md">
      {/* Hero photo with the headline sitting over its bottom edge. */}
      <div className="relative mt-2 aspect-[402/268] w-full bg-zinc-800">
        <Image src={aboutHeroImageSrc} alt="" fill priority className="object-cover" sizes="448px" />
        <h1 className="absolute inset-x-4 bottom-0 text-5xl/tight font-light">
          Fiercely Independent <span className="text-ksdt-pink">Since 1967.</span>
        </h1>
      </div>

      <div className="px-4">
        <section className="pt-8">
          <h2 className="text-2xl font-bold">History</h2>
          <div className="mt-6 space-y-6 font-light">
            <p>
              KSDT Radio is UC San Diego’s{" "}
              <span className="text-ksdt-pink">independent, fully student-run radio station.</span>{" "}
              Established in 1967, KSDT originated out of a Pacific Beach garage, where a group of
              students broadcasted tunes using a low power signal.
            </p>
            <p>
              With the help of then Assistant Dean of Student Affairs Robert Topolovac, KSDT founders
              Don Bright and Jon Collins were awarded funding to establish a college radio station on
              UCSD.
            </p>
            <p>
              Over 60 years later, KSDT has over <span className="text-ksdt-pink">300 active interns</span>{" "}
              and DJs, and continues to thrive at the center of art, creativity, and music at UCSD.
            </p>
          </div>
        </section>

        <hr className="mt-10 border-white" />

        <section className="pt-8">
          <h2 className="text-2xl font-bold">KSDT Staff</h2>
          <div className="mt-6 flex flex-col gap-6">
            {staffGroups.map((group, i) => (
              <div key={group.heading ?? i}>
                {group.heading && <h3 className="mb-3 text-lg font-light">{group.heading}</h3>}
                <ul className="flex flex-col gap-3">
                  {group.members.map((member) => (
                    <StaffCard key={member.email} member={member} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}