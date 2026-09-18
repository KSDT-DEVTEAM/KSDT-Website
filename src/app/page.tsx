import { LiveShowBanner } from "@/components/LiveShowBanner";
import { NowPlayingCard } from "@/components/NowPlayingCard";
import { BlogSection } from "@/components/BlogSection";
import { NewsBroadcastingSection } from "@/components/NewsBroadcastingSection";

export default function Home() {
  return (
    <>
      <LiveShowBanner />
      <NowPlayingCard />
      <BlogSection />
      <NewsBroadcastingSection />
    </>
  );
}
