"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";

// next/image for photos stored in Sanity. Sanity's image CDN does the resizing and format conversion
// (the originals can be 6000px wide), so they skip the site's own image optimizer.
// A client component because next/image's `loader` prop has to be a client-side function.

const sanityLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
};

export function SanityImage({ alt, ...props }: Omit<ImageProps, "loader">) {
  return <Image alt={alt} {...props} loader={sanityLoader} />;
}
