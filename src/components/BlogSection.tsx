import Image from "next/image";
import Link from "next/link";
import { featuredBlogPost } from "@/lib/placeholder-data";

export function BlogSection() {
  return (
    <section className="px-4 pt-10">
      <h2 className="text-2xl font-bold">Blog</h2>

      <Link
        href={featuredBlogPost.href}
        className="mt-4 block border border-white transition-opacity hover:opacity-90"
      >
        <div className="relative aspect-[350/192] w-full">
          <Image
            src={featuredBlogPost.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 448px) 402px, 100vw"
          />
        </div>
        <div className="px-3 py-4">
          <p className="font-mono text-sm text-ksdt-pink">FEATURED</p>
          <p className="mt-2 text-2xl font-light leading-snug">
            {featuredBlogPost.title}
          </p>
          <div className="mt-6 flex items-center justify-between font-mono text-xs">
            <span>{featuredBlogPost.author}</span>
            <span>{featuredBlogPost.date}</span>
          </div>
        </div>
      </Link>

      <div className="mt-4 text-right">
        <Link href="#" className="text-lg">
          See More {">>"}
        </Link>
      </div>
    </section>
  );
}
