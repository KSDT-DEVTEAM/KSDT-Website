import { MediaCard, MediaListCard } from "../../components/MediaCard"
import Link from "next/link";
import { moreBlogPosts, placeholderInterview, featuredBlogPost, placeholderFeatured } from "@/lib/placeholder-data";
import { MediaSection, MediaPost } from "@/components/MediaSection";

type FeaturedPost = {
  href: string;
  imageSrc: string;
  title: string;
  author: string;
  date: string;
}

type FeaturedSectionProps = {
  featuredPost: FeaturedPost;
  otherPosts: MediaPost[];
}

export default function MediaPage() {
  return (
    <>
      <div className="lg:mx-auto lg:max-w-[1152px]">
        <MediaHeader />

        <FeaturedSection featuredPost={featuredBlogPost} otherPosts={placeholderFeatured}/>
        
        <MediaSection posts = {moreBlogPosts} sectionTitle="Reviews" path="media/reviews"/>
        <MediaSection posts = {placeholderInterview} sectionTitle="Interviews" path="media/interviews"/>
      </div>

    </>
  )
}

function MediaHeader() {
  return(
      <section className="w-screen mx-[calc(50%-50vw)] bg-[rgba(255,141,202,0.4)]">
            <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-4 pt-[14px] pb-[13px] lg:max-w-none lg:py-4 lg:pl-[35px] lg:pr-8">
              <div className="flex flex-col gap-[5px]">
                <p className="text-4xl font-bold lg:leading-[normal]">Media</p>
              </div>
            </div>
      </section>
  )
}

function FeaturedSection( {featuredPost, otherPosts} : FeaturedSectionProps ) {
  return (
    <section className="px-4 pt-12 lg:mx-8 lg:mt-6 lg:px-0 lg:pt-6">
        <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-[370px_1fr] lg:gap-4">
            <MediaCard
                href={featuredPost.href}
                imageSrc={featuredPost.imageSrc}
                label="FEATURED"
                title={featuredPost.title}
                byline={featuredPost.author}
                date={featuredPost.date}
            />
            <div className="hidden lg:flex lg:flex-col lg:gap-4">
                {otherPosts.map((post, i) => (
                    <MediaListCard
                      key={`${post.href}-${i}`}
                      href={post.href}
                      imageSrc={post.imageSrc}
                      label={post.label}
                      title={post.title}
                      byline={post.author}
                      date={post.date}
                    />
                ))}
            </div>
          </div>
          <div className="mt-4 text-right lg:mt-8">
            
          <Link href="/media" className="text-lg lg:text-2xl">
            See More {">>"}
          </Link>
        </div>
      </section>
  )
}
