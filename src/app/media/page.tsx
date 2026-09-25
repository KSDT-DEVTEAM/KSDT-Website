import { MediaCard } from "../../components/MediaCard"
import Link from "next/link";
import { moreBlogPosts, placeholderInterview } from "@/lib/placeholder-data";
import { MediaSection } from "@/components/MediaSection";

export default function MediaPage() {
  return (
    <>
      <section className="w-screen mx-[calc(50%-50vw)] bg-[rgba(255,141,202,0.4)]">
            <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-4 pt-[14px] pb-[13px] lg:max-w-none lg:py-3 lg:pl-[35px] lg:pr-8">
              <div className="flex flex-col gap-[5px]">
                <p className="text-xl font-bold lg:leading-[normal]">Media</p>
              </div>
            </div>
      </section>

      <section className="px-4 pt-6 lg:mx-8 lg:mt-12 lg:border-t-2 lg:px-0 lg:pt-12">
        <div className="lg:mx-auto lg:max-w-[1152px]">
          <MediaCard href="/media/underscores" imageSrc="/images/blog-featured.png" label="FEATURED"
          title="I feel the BPM: underscores Rocks The Observatory North Park" byline="Sarah Yoo" date="06.04.26"/>
        </div>
      </section>
      
      <MediaSection posts = {moreBlogPosts} sectionTitle="Reviews" path="media/reviews"/>
      <MediaSection posts = {placeholderInterview} sectionTitle="Interviews" path="media/interviews"/>

ç    </>
  );
}
