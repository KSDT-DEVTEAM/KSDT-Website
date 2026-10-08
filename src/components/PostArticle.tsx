import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PostDetail } from "@/sanity/lib/posts";

// A single News or Media post. Used by /news/[slug] and /media/[slug].
// Same 1152px-wide container as the News page, with the article text kept to a readable width.

const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 leading-relaxed lg:text-lg">{children}</p>,
    h1: ({ children }) => <h2 className="mt-10 text-3xl font-bold lg:text-4xl/[normal]">{children}</h2>,
    h2: ({ children }) => <h2 className="mt-10 text-2xl font-bold lg:text-3xl">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-xl font-bold lg:text-2xl">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-6 text-lg font-bold">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-ksdt-pink pl-4 italic lg:text-lg">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 lg:text-lg">{children}</ul>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="text-ksdt-pink underline" target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: { url?: string; alt?: string } }) =>
      value.url ? (
        <figure className="mt-8">
          <Image
            src={value.url}
            alt={value.alt ?? ""}
            width={1200}
            height={800}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 768px, 100vw"
          />
        </figure>
      ) : null,
  },
};

export function PostArticle({ post, backHref }: { post: PostDetail; backHref: string }) {
  return (
    <article className="px-4 pb-16 pt-4 lg:mx-auto lg:max-w-[1152px] lg:px-8 lg:pt-12 lg:pb-24">
      <Link href={backHref} className="text-lg font-light lg:text-2xl">
        {"<<"} Back
      </Link>

      <div className="mx-auto mt-6 max-w-3xl lg:mt-8">
        <p className="font-mono text-ksdt-pink lg:text-lg">{post.label}</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight lg:text-5xl/tight">{post.title}</h1>
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white pt-3 font-mono text-sm lg:border-t-2 lg:text-lg">
          <span>{post.author}</span>
          <span className="shrink-0">{post.date}</span>
        </div>

        {post.imageSrc && (
          <div className="relative mt-8 aspect-[3/2] w-full">
            <Image
              src={post.imageSrc}
              alt={post.imageAlt ?? ""}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 768px, 100vw"
            />
          </div>
        )}

        {post.body && (
          <div className="mt-4">
            <PortableText value={post.body} components={bodyComponents} />
          </div>
        )}
      </div>
    </article>
  );
}
