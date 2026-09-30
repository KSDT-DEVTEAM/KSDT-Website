import Image from "next/image";
import { sportsStreams, upcomingGames } from "@/lib/sports-data";
import { Broadcasters, SportsStreamCard } from "@/components/SportsStreamCard";

// The site header, footer and streaming bar come from the root layout,
// so this page only renders the Sports content in between.

export default function Page() {
  return (
    // Sports uses SF Pro Black in the design; fall back to the system UI font elsewhere.
    //
    // On mobile the column uses the same 16px side padding as the other pages, and everything
    // inside scales with its width: `--u` is one pixel of the 275px-wide mobile design
    // (`cqw` resolves against this container, so `--u` only works on its children — the page's
    // top/bottom spacing lives on the logo and About heading for that reason).
    // Desktop (lg:) uses the design's fixed pixel sizes.
    <div className="@container mx-auto flex w-full flex-col items-center px-4 font-['SF_Pro',-apple-system,BlinkMacSystemFont,system-ui,sans-serif] leading-[normal] font-black tracking-[-0.03em] [--u:calc(100cqw/275)] lg:max-w-[1170px] lg:px-8">
      <div className="relative mt-[calc(56*var(--u))] h-[calc(53*var(--u))] w-[calc(75*var(--u))] lg:mt-[82px] lg:h-[171px] lg:w-[242px]">
        {/* Same space above and below the logo (this top margin matches the gap to the first card). The PNG has the glow baked in around the logo, so it overflows this box; the logo itself fills the box. */}
        <Image
          src="/images/KSDT-Sports-Logo-2.png"
          alt="KSDT Sports"
          width={646}
          height={575}
          className="pointer-events-none absolute top-1/2 left-1/2 mt-[calc(1.24*var(--u))] w-[calc(200*var(--u))] max-w-none -translate-x-1/2 -translate-y-1/2 lg:mt-1 lg:w-[646px]"
          priority
        />
      </div>

      <div className="mt-[calc(56*var(--u))] flex w-full flex-col gap-[calc(30*var(--u))] lg:mt-[82px] lg:grid lg:grid-cols-2 lg:gap-x-[84px] lg:gap-y-[74px]">
        {sportsStreams.map((stream) => (
          <SportsStreamCard key={stream.name} stream={stream} />
        ))}

        <section className="h-[calc(375*var(--u))] rounded-[calc(25*var(--u))] border-[0.625px] border-[rgba(204,204,204,0.5)] bg-[rgba(0,17,43,0.2)] pt-[calc(11*var(--u))] pr-[calc(17*var(--u))] pl-[calc(16*var(--u))] lg:col-span-2 lg:h-[628px] lg:rounded-[40px] lg:border lg:pt-[19px] lg:pr-[52px] lg:pl-[51px]">
          <h2 className="pl-[calc(4*var(--u))] text-[length:calc(15*var(--u))] lg:-ml-4 lg:pl-0 lg:text-[40px]/[normal]">
            Upcoming
          </h2>
          <ol className="mt-[calc(10*var(--u))] flex flex-col gap-[calc(27*var(--u))] lg:mt-[26px] lg:gap-[54px]">
            {upcomingGames.map((game, i) => (
              <li key={i} className="flex h-[calc(41*var(--u))] items-start gap-[calc(8*var(--u))] lg:h-[56px] lg:gap-2">
                <span className="mt-[calc(9*var(--u))] w-[calc(13*var(--u))] text-[length:calc(20*var(--u))] lg:mt-[3px] lg:w-10 lg:text-[36px]/[normal]">
                  {i + 1}
                </span>
                <div className="w-[calc(142*var(--u))] lg:w-auto lg:min-w-0 lg:flex-1">
                  <p className="text-[length:calc(8*var(--u))] lg:text-[15px]/[normal]">{game.sport}</p>
                  <div className="lg:flex lg:items-baseline lg:justify-between lg:gap-4">
                    <p className="text-[length:calc(13*var(--u))] lg:truncate lg:text-[36px]/[normal]">{game.matchup}</p>
                    <p className="hidden shrink-0 text-[24px]/[normal] text-[#c3c3c3] lg:block">{game.date}</p>
                  </div>
                </div>
                <div className="ml-auto flex shrink-0 flex-col items-end pt-[calc(3*var(--u))] lg:-mt-1 lg:ml-6 lg:pt-0">
                  <Broadcasters names={game.broadcasters} />
                  <p className="text-[length:calc(10*var(--u))] text-[#c3c3c3] lg:hidden">{game.date}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <h2 className="mt-[calc(28*var(--u))] mb-[calc(96*var(--u))] text-center text-[length:calc(25*var(--u))] lg:mt-[94px] lg:mb-24 lg:self-start lg:text-left lg:text-[64px]/[normal]">
        About KSDT Sports
      </h2>
      {/* TODO: About copy isn't in the design yet. */}
    </div>
  );
}
