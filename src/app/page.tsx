import { LiveShowBanner } from "@/components/LiveShowBanner";
import { NowPlayingCard } from "@/components/NowPlayingCard";
import { GetInvolvedSection } from "@/components/GetInvolvedSection";
import { BlogSection } from "@/components/BlogSection";
import { NewsBroadcastingSection } from "@/components/NewsBroadcastingSection";

export default function Home() {
  return (
    <>
      <LiveShowBanner />
      <div className="lg:mx-auto lg:max-w-[1152px]">
        <NowPlayingCard />
        <GetInvolvedSection />
        <BlogSection />
        <NewsBroadcastingSection />
      </div>
    </>
  );
}
