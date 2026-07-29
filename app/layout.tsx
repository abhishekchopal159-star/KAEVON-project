import type { Metadata } from "next";

import {
  Playfair_Display,
  Poppins,
} from "next/font/google";

import { Suspense } from "react";

import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import LuxuryLoadingScreen from "@/components/system/LuxuryLoadingScreen";
import StorefrontCloudSync from "@/components/providers/StorefrontCloudSync";
import PublicOperationsState from "@/components/providers/PublicOperationsState";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: [
    "400",
    "500",
    "600",
    "700",
  ],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  weight: [
    "300",
    "400",
    "500",
    "600",
    "700",
  ],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Styloverse",
    template: "%s | Styloverse",
  },

  description:
    "Where Fashion Meets You",

  applicationName: "Styloverse",

  keywords: [
    "Styloverse",
    "premium fashion",
    "luxury fashion",
    "clothing",
    "footwear",
    "accessories",
  ],

  authors: [
    {
      name: "Styloverse",
    },
  ],

  creator: "Styloverse",

  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#FFF8F2] font-[var(--font-body)] text-[#171717] antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Organization",name:"Styloverse",url:process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000",logo:`${process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000"}/icon.png`,sameAs:[]}).replace(/</g,"\\u003c")}} />
        <AuthProvider>
          <StorefrontCloudSync />
          <PublicOperationsState />

          <Suspense fallback={<LuxuryLoadingScreen />}>
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
