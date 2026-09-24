"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navSections } from "@/lib/placeholder-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!desktopOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!desktopNavRef.current?.contains(event.target as Node)) setDesktopOpen(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDesktopOpen(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [desktopOpen]);

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black">
      <div className="mx-auto flex h-[72px] w-full max-w-md items-center justify-between px-4 lg:h-16 lg:max-w-none lg:px-8">
        <Link href="/" className="block h-[34px] w-[81px] shrink-0 lg:h-8 lg:w-[76px]">
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
          className="-mr-2 p-2 lg:hidden"
        >
          <Image src="/images/menu-icon.svg" alt="" width={27} height={21} priority />
        </button>

        <nav ref={desktopNavRef} className="hidden items-center gap-8 text-2xl/[normal] lg:flex">
          {navSections.map((section) => {
            if (!section.children) {
              return (
                <Link key={section.label} href={section.href}>
                  {section.label}
                </Link>
              );
            }

            const isOpen = desktopOpen === section.label;

            return (
              <div key={section.label} className="relative">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setDesktopOpen(isOpen ? null : section.label)}
                  className="flex items-center gap-2.5"
                >
                  <span>{section.label}</span>
                  <Image src="/images/nav-plus.svg" alt="" width={17} height={17} />
                </button>
                {isOpen && (
                  <div className="absolute right-0 top-full mt-4 flex min-w-full flex-col border border-white bg-black">
                    {section.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setDesktopOpen(null)}
                        className="whitespace-nowrap border-b border-white px-4 py-3 text-lg/[normal] last:border-b-0"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div
        aria-hidden={!open}
        className={`absolute left-0 right-0 top-full z-40 grid w-full bg-black lg:hidden transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr] pointer-events-auto" : "grid-rows-[0fr] pointer-events-none"
        }`}
      >
        <nav className="flex max-h-[calc(100dvh-73px)] w-full flex-col overflow-y-auto">
          {navSections.map((section) => {
            if (!section.children) {
              return (
                <Link
                  key={section.label}
                  href={section.href}
                  onClick={() => setOpen(false)}
                  className="block w-full border-b border-white"
                >
                  <span className="mx-auto block max-w-md px-4 py-4 text-2xl">
                    {section.label}
                  </span>
                </Link>
              );
            }

            const isExpanded = Boolean(openSections[section.label]);

            return (
              <div key={section.label} className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => toggleSection(section.label)}
                  className="w-full border-b border-white"
                >
                  <div className="mx-auto flex max-w-md items-center justify-between gap-[10px] px-4 py-4 text-2xl">
                    <span>{section.label}</span>
                    <Image
                      src={isExpanded ? "/images/accordion-minus.svg" : "/images/accordion-plus.svg"}
                      alt=""
                      width={23}
                      height={23}
                    />
                  </div>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="flex flex-col overflow-hidden">
                    {section.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block w-full border-b border-white"
                      >
                        <span className="mx-auto block max-w-md px-8 py-4 text-base">
                          {child.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="absolute inset-x-0 top-[72px] z-50 h-px bg-white lg:top-[63px]" />
    </header>
  );
}
