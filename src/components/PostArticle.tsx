import Link from "next/link";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { SanityImage } from "@/components/SanityImage";
import { urlFor } from "@/sanity/lib/image";
import type { ContentImage, GalleryBlock, ImageBlock, PostDetail } from "@/sanity/lib/posts";

// A single Media post. Used by /media/[slug].
// Same 1152px-wide container as the other pages, with the article text kept to a readable width.

function ContentPhoto({
  image,
  alt,
  sizes,
  className = "",
}: {
  image: ContentImage;
  alt?: string;
  sizes: string;
  className?: string;
}) {
  const { width = 1600, height = 1067 } = image.asset?.metadata?.dimensions ?? {};
  return (
    <SanityImage
      src={urlFor(image).url()}
      alt={alt ?? image.alt ?? ""}
      width={width}
      height={height}
      sizes={sizes}
      className={`h-auto w-full ${className}`}
    />
  );
}

// Image sizes as set in the Studio. On mobile every image runs edge to edge, as in the Figma;
// on desktop "large" (the default) is the 532px-wide photo from the design.
const imageWidths = { small: "lg:w-1/4", medium: "lg:w-1/3", large: "lg:w-[532px]", full: "lg:w-full" };
const imageAlignments = { left: "lg:mr-auto", center: "lg:mx-auto", right: "lg:ml-auto" };

// Thin italic credit line, e.g. "© Katelyn Villon".
function Caption({ children }: { children: React.ReactNode }) {
  return <figcaption className="mt-1.5 px-4 text-right text-xs font-thin italic lg:px-0">{children}</figcaption>;
}

function ImageBlockView({ value }: { value: ImageBlock }) {
  if (!value.image?.asset) return null;
  return (
    <figure
      className={`-mx-4 my-7 lg:mx-0 lg:my-8 ${imageWidths[value.size ?? "large"]} ${imageAlignments[value.alignment ?? "center"]}`}
    >
      <ContentPhoto image={value.image} alt={value.alt} sizes="(min-width: 1024px) 1088px, 100vw" />
      {value.caption && <Caption>{value.caption}</Caption>}
    </figure>
  );
}

const galleryColumns = { 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" };

// Every gallery in the existing posts uses the grid layout; carousel and masonry fall back to it.
function GalleryBlockView({ value }: { value: GalleryBlock }) {
  const images = value.images?.filter((image) => image.asset) ?? [];
  if (images.length === 0) return null;
  return (
    <div className={`my-7 grid gap-2.5 lg:my-8 ${galleryColumns[value.columns ?? 3]}`}>
      {images.map((image) => (
        <figure key={image._key}>
          <ContentPhoto image={image} sizes="(min-width: 1024px) 544px, 50vw" />
          {image.caption && <Caption>{image.caption}</Caption>}
        </figure>
      ))}
    </div>
  );
}

const contentComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="my-[1lh]">{children}</p>,
    h1: ({ children }) => <h2 className="mt-10 mb-4 text-3xl/[normal] font-bold">{children}</h2>,
    h2: ({ children }) => <h2 className="mt-10 mb-4 text-2xl/[normal] font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl/[normal] font-bold">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-6 mb-2 text-lg/[normal] font-bold">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="my-[1lh] border-l-2 border-ksdt-pink pl-4 italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-[1lh] list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-[1lh] list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="text-ksdt-pink underline" target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    imageBlock: ImageBlockView,
    galleryBlock: GalleryBlockView,
  },
};

// Laid out from the Figma "Media underscores" frames: mobile stacks a full-width cover photo,
// title and byline; desktop puts the cover photo beside them.
export function PostArticle({ post, backHref }: { post: PostDetail; backHref: string }) {
  return (
    <article className="px-4 pt-6 pb-16 lg:mx-auto lg:max-w-[1152px] lg:px-8 lg:pt-12 lg:pb-24">
      <Link href={backHref} className="text-lg/[normal] font-light lg:text-2xl/[normal]">
        {"<<"} Back
      </Link>

      <header className="mt-[18px] lg:mt-12 lg:grid lg:grid-cols-[493px_1fr] lg:gap-8">
        <div className="relative -mx-4 aspect-[402/220] bg-zinc-300 lg:mx-0 lg:aspect-[493/270]">
          {post.imageSrc && (
            <SanityImage
              src={post.imageSrc}
              alt={post.imageAlt ?? ""}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 493px, 100vw"
            />
          )}
        </div>

        <div className="lg:-mt-2.5 lg:flex lg:flex-col lg:justify-end">
          <p className="hidden font-mono text-lg/[normal] text-ksdt-pink lg:block">{post.label}</p>
          <h1 className="mt-2.5 text-2xl/[normal] font-light lg:mt-4 lg:text-5xl/[normal]">{post.title}</h1>
          <hr className="mt-4 hidden w-[60px] border-white lg:block" />
          <div className="mt-6 flex items-center gap-2.5 font-mono lg:mt-4 lg:gap-4 lg:text-lg/[normal]">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-zinc-300 lg:size-[46px]">
              {post.authorImageSrc && (
                <SanityImage src={post.authorImageSrc} alt="" fill className="object-cover" sizes="46px" />
              )}
            </div>
            <div>
              <p>{post.author || "KSDT Radio"}</p>
              <p className="text-white/60">{post.longDate}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-7 lg:mt-[72px] [&>:first-child]:mt-0">
        <PortableText value={post.content} components={contentComponents} />
      </div>

      <Link href={backHref} className="mt-8 hidden text-2xl/[normal] font-light lg:inline-block">
        {"<<"} Back to Media
      </Link>
    </article>
  );
}
