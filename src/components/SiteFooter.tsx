import Image from "next/image";
import Link from "next/link";

const linkGroups = [
  {
    heading: "Explore",
    links: [
      { label: "Listen", href: "#" },
      { label: "Media", href: "#" },
      { label: "News", href: "#" },
      { label: "Sports", href: "#" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "Join KSDT", href: "#" },
      { label: "Book a room", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/ksdtradio",
    iconSrc: "/images/social-instagram.svg",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCIkt4hRb6WJ7wlgUMVlaXrQ",
    iconSrc: "/images/social-youtube.svg",
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/ksdtucsd?si=e6b7ad240e484488",
    iconSrc: "/images/social-spotify.svg",
  },
];

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-white bg-black">
      <div className="mx-auto w-full max-w-md px-4 pt-[47px] leading-[normal] lg:max-w-[1152px] lg:px-8 lg:pt-[95px]">
        {/* On mobile, everything from the logo down fills the viewport (minus the header logo's
            19px top offset), so at full scroll the footer logo sits directly under the header logo.
            On desktop it's a four-column grid with the copyright pinned to the bottom. */}
        <div className="flex min-h-[calc(100dvh-19px)] flex-col pb-4 lg:grid lg:min-h-[356px] lg:grid-cols-4 lg:grid-rows-[auto_1fr] lg:pb-[31px]">
          <div>
            <Link href="/" className="block h-[34px] w-[81px] lg:h-[57px] lg:w-[135px]">
              <Image
                src="/images/ksdt-logo.png"
                alt="KSDT Radio"
                width={135}
                height={57}
                className="h-full w-full object-contain"
              />
            </Link>

            <p className="mt-6 max-w-[276px] text-base/[normal] lg:mt-8 lg:max-w-[240px] lg:text-lg/[normal] lg:font-light">
              Fiercely independent college radio at UC San Diego
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-7 px-4 lg:contents">
            {linkGroups.map((group) => (
              <div key={group.heading}>
                <h2 className="text-lg/[normal] font-bold">{group.heading}</h2>
                <ul className="mt-1 flex flex-col gap-[7px] lg:mt-2 lg:gap-[9px]">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-base/[normal] font-light lg:text-lg/[normal]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h2 className="text-lg/[normal] font-bold">Follow us</h2>
              <ul className="mt-1 flex flex-col gap-[7px] lg:mt-2 lg:gap-[9px]">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-base/[normal] font-light lg:gap-1.5 lg:text-lg/[normal]"
                    >
                      <Image
                        src={link.iconSrc}
                        alt=""
                        width={13}
                        height={13}
                        className="shrink-0 lg:size-[18px]"
                      />
                      <span className="underline">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-[52px] text-center text-[10px] lg:col-span-4 lg:mt-0 lg:self-end lg:text-lg/[normal]">
            © 2026 KSDT Radio · UC San Diego
          </p>
        </div>
      </div>
    </footer>
  );
}
