import type { Metadata } from "next";
import { Fragment_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "KSDT Radio",
  description: "KSDT Radio — UC San Diego's student-run radio station",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fragmentMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white">
        <SiteHeader />
        <main className="mx-auto w-full max-w-md flex-1 lg:max-w-none">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
