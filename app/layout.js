import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Art-Folio – Modern Portfolio & Agency Template",
  description:
    "Art-Folio is a sleek and creative portfolio template for designers, developers, and agencies. Built with Next.js and GSAP, it delivers smooth animations, responsive design, and a stunning first impression.",
  keywords: [
    "portfolio template",
    "designer portfolio",
    "creative agency",
    "Next.js template",
    "GSAP landing page",
    "tailwind css portfolio",
    "artistic portfolio site",
    "personal branding template",
    "frontend portfolio",
    "artfolio",
  ],
  authors: [{ name: "Teachfosys", url: "https://teachfosys.com/" }],
  creator: "Teachfosys",
  themeColor: "#ffffff",
  openGraph: {
    title: "Art-Folio – Modern Portfolio & Agency Template",
    description:
      "Create stunning designer portfolios and agency landing pages with Art-Folio. Built using Next.js, Tailwind CSS, and GSAP.",
    url: "https://art-folio.teachfosys.com/",
    siteName: "Art-Folio",
    images: [
      {
        url: "https://art-folio.teachfosys.com/logo.svg",
        width: 1200,
        height: 630,
        alt: "Art-Folio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Art-Folio – Modern Portfolio & Agency Template",
    description:
      "Create stunning designer portfolios and agency landing pages with Art-Folio. Built using Next.js, Tailwind CSS, and GSAP.",
    images: ["https://art-folio.teachfosys.com/logo.svg"],
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
