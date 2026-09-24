import Image from "next/image";
import Link from "next/link";

type MediaCardProps = {
  href: string;
  imageSrc: string;
  label: string;
  title: string;
  byline: string;
  date: string;
};

export function MediaCard({ href, imageSrc, label, title, byline, date }: MediaCardProps) {
  return (
    <Link
      href={href}
      className="block border border-white transition-opacity hover:opacity-90 lg:flex lg:h-full lg:flex-col lg:border-2 lg:px-[10px] lg:py-4"
    >
      <div className="relative aspect-[350/192] w-full">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 350px, (min-width: 448px) 402px, 100vw"
        />
      </div>
      <div className="px-3 py-4 lg:flex lg:flex-1 lg:flex-col lg:px-0 lg:pb-0 lg:pt-2">
        <p className="font-mono text-sm text-ksdt-pink lg:text-lg/[normal]">{label}</p>
        <p className="mt-2 text-2xl font-light leading-snug lg:mt-1.5 lg:text-lg/[normal]">
          {title}
        </p>
        <div className="mt-6 flex items-center justify-between font-mono text-xs lg:mt-auto lg:pt-4 lg:text-base/[normal]">
          <span>{byline}</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}

// Horizontal card for the smaller posts beside the featured one (desktop only).
export function MediaListCard({ href, imageSrc, label, title, byline, date }: MediaCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-1 gap-5 border-2 border-white py-4 pl-[10px] pr-5 transition-opacity hover:opacity-90"
    >
      <div className="relative h-[148px] w-[211px] shrink-0 self-center">
        <Image src={imageSrc} alt="" fill className="object-cover" sizes="211px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-mono text-lg/[normal] text-ksdt-pink">{label}</p>
        <p className="mt-2 text-lg/none font-light">{title}</p>
        <div className="mt-auto flex items-center justify-between border-t border-white pt-3 font-mono text-lg/[normal]">
          <span>{byline}</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}
