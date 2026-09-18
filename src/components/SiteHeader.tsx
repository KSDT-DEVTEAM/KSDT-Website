"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { primaryNavLinks, secondaryNavLinks } from "@/lib/placeholder-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white bg-black">
      <div className="mx-auto flex h-[72px] w-full max-w-md items-center justify-between px-4">
        <Link href="/" className="block h-[34px] w-[81px] shrink-0">
          <Image
            src="/images/ksdt-logo.png"
            alt="KSDT Radio"
            width={81}
            height={34}
            className="h-full w-full object-contain"
            priority
          />
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="p-2"
        >
          <Image src="/images/menu-icon.svg" alt="" width={27} height={21} priority />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-black">
          <div className="mx-auto flex h-[72px] w-full max-w-md items-center justify-between border-b border-white px-4">
            <Image
              src="/images/ksdt-logo.png"
              alt="KSDT Radio"
              width={81}
              height={34}
              className="h-[34px] w-[81px] object-contain"
            />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-2"
            >
              <Image src="/images/menu-icon.svg" alt="" width={27} height={21} />
            </button>
          </div>

          <nav className="mx-auto flex w-full max-w-md flex-1 flex-col">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white px-4 py-4 text-2xl"
              >
                {link.label}
              </Link>
            ))}
            {secondaryNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white px-8 py-4 text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
