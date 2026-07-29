"use client";

import React, { FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MoveUp,
  ShieldCheck,
  Truck,
  CreditCard,
  Award,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";

/* -------------------------------------------------------------------------
   Custom social icons (lucide-react no longer ships brand/logo icons)
   ------------------------------------------------------------------------- */
const InstagramIcon = ({ size = 13 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const PinterestIcon = ({ size = 13 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 20l4-9" />
    <path d="M10.5 15.5c-.5 1-2 1.5-3 1-1.5-.75-2.5-2.5-2.5-4.5C5 8 8 5 12 5c3.5 0 6.5 2.5 6.5 6 0 3-1.8 5.5-4.5 5.5-1.2 0-2-.6-2.3-1.3" />
  </svg>
);

const XIcon = ({ size = 13 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ size = 13 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TRUST_BADGES = [
  {
    icon: Truck,
    title: "Complimentary Shipping",
    desc: "On all orders exceeding $500 worldwide.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Transactions",
    desc: "Encrypted privacy for every purchase.",
  },
  {
    icon: Award,
    title: "Premium Craftsmanship",
    desc: "Meticulously curated luxury pieces.",
  },
  {
    icon: CreditCard,
    title: "Effortless Returns",
    desc: "30-day complimentary return policy.",
  },
];

const FOOTER_LINKS = [
  {
    title: "Shop",
    links: ["Men", "Women", "Footwear", "Accessories", "Lookbook"],
  },
  {
    title: "Company",
    links: ["About", "Journal", "Our Story", "Careers", "Sustainability"],
  },
  {
    title: "Support",
    links: [
      "Shipping",
      "Returns",
      "FAQ",
      "Privacy Policy",
      "Terms of Service",
    ],
  },
];

const FOOTER_HREFS: Record<string, string> = {
  Men: "/shop/men",
  Women: "/shop/women",
  Footwear: "/shop/footwear",
  Accessories: "/shop/accessories",
  Lookbook: "/collections",
  Shipping: "/help/policies",
  Returns: "/account/returns",
  FAQ: "/help",
  "Privacy Policy": "/help/policies",
  "Terms of Service": "/help/policies",
};

const SOCIAL_LINKS = [
  { name: "Instagram", icon: InstagramIcon, href: "#" },
  { name: "Pinterest", icon: PinterestIcon, href: "#" },
  { name: "X", icon: XIcon, href: "#" },
  { name: "Facebook", icon: FacebookIcon, href: "#" },
];

export default function Footer() {
  const { isAdmin } = useAuth();
  const { home } = useStorefrontContent();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    // Newsletter submission logic here
  };

  return (
    <footer
      id="site-footer"
      className="relative w-full max-w-full scroll-mt-28 overflow-hidden bg-[#FFF8F2] pt-0 md:pt-28 lg:pt-36"
    >
      <div className="relative overflow-hidden bg-[linear-gradient(145deg,#171517,#28202D_58%,#3A2B50)] px-5 pb-28 pt-10 text-white md:hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#7659F8]/25 blur-[80px]" />
        <div className="relative">
          <p className="font-playfair text-[27px] tracking-[0.13em]">
            STYLO<span className="text-[#B6A5FF]">V</span>ERSE
          </p>
          <p className="mt-2 text-[7px] font-semibold uppercase tracking-[0.38em] text-white/38">
            Private fashion house
          </p>

          <h2 className="mt-9 max-w-[310px] font-playfair text-[38px] leading-[0.98] tracking-[-0.035em]">
            {home.footerStatement.split(",")[0] || "Your wardrobe"},
            <span className="block italic text-[#E3B777]">{home.footerStatement.split(",").slice(1).join(",").trim() || "exceptionally curated."}</span>
          </h2>
          <p className="mt-4 max-w-[300px] font-poppins text-[11px] leading-5 text-white/48">
            New edits, refined essentials and private collection access from
            Styloverse.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-2.5">
            <Link
              href="/shop"
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-white text-[10px] font-semibold !text-[#171517] shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
            >
              <span className="!text-[#171517]">Shop the edit</span>
              <ArrowRight size={13} className="!text-[#171517]" />
            </Link>
            <Link
              href="/collections"
              className="flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[10px] font-semibold text-white/82"
            >
              Collections
            </Link>
          </div>

          <div className="mt-9 grid grid-cols-3 border-y border-white/10 py-5 text-center">
            {["Shipping", "Returns", "Privacy"].map((label) => (
              <Link
                key={label}
                href={label === "Returns" ? "/account/returns" : "/help/policies"}
                className="text-[8px] font-semibold uppercase tracking-[0.12em] text-white/48"
              >
                {label}
              </Link>
            ))}
          </div>

          <p className="mt-6 text-center text-[8px] tracking-[0.08em] text-white/28">
            © {new Date().getFullYear()} Styloverse · Luxury made personal
          </p>
          {isAdmin ? (
            <Link
              href="/admin"
              className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#E3B777]"
            >
              Admin Office
            </Link>
          ) : null}
        </div>
      </div>

      <div className="hidden md:block">
      {/*
        =======================================================================
        INJECTED LUXURY STYLES & FONTS
        =======================================================================
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Poppins:wght@300;400;500;600&display=swap');

            .font-playfair { font-family: 'Playfair Display', serif; }
            .font-poppins { font-family: 'Poppins', sans-serif; }

            .hover-underline-animation {
              position: relative;
              display: inline-block;
            }

            .hover-underline-animation::after {
              content: '';
              position: absolute;
              width: 100%;
              transform: scaleX(0);
              height: 1px;
              bottom: 0;
              left: 0;
              background-color: currentColor;
              transform-origin: bottom right;
              transition: transform 0.5s cubic-bezier(0.86, 0, 0.07, 1);
            }

            .hover-underline-animation:hover::after {
              transform: scaleX(1);
              transform-origin: bottom left;
            }

            .glass-input-container {
              background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
            }
          `,
        }}
      />

      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[600px] w-[100vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#5B3DF5]/[0.03] via-[#FFF8F2]/0 to-transparent blur-3xl"></div>

      <div className="container relative z-10">
        {/*
          =======================================================================
          SECTION 1 & 2: LUXURY CTA & NEWSLETTER
          =======================================================================
        */}
        <div className="mx-auto mb-24 flex max-w-4xl flex-col items-center justify-center text-center md:mb-32">
          <h2 className="mb-6 font-playfair text-4xl leading-[1.1] tracking-tight text-[#111111] md:text-5xl lg:text-7xl">
            Stay Ahead of <br className="md:hidden" />
            <span className="font-light italic text-[#5B3DF5]">Fashion</span>
          </h2>

          <p className="mb-12 max-w-xl font-poppins text-base font-light leading-relaxed text-[#666666] md:text-lg">
            Join our private newsletter for exclusive drops, styling
            inspiration, and early access to upcoming collections.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="group relative w-full max-w-lg"
          >
            {/* Soft Ambient Shadow for Input */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#5B3DF5]/20 via-transparent to-[#111111]/10 opacity-0 blur-lg transition duration-700 ease-out group-hover:opacity-100"></div>

            <div className="glass-input-container relative flex items-center rounded-full border border-[#ECECEC] p-2 shadow-[0_8px_40px_rgba(0,0,0,0.03)] transition-all duration-500 focus-within:border-[#5B3DF5]/40 focus-within:shadow-[0_8px_40px_rgba(91,61,245,0.08)]">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent px-6 py-3 font-poppins text-[15px] text-[#111111] outline-none placeholder:text-[#666666]/50"
                required
              />
              <button
                type="submit"
                className="group/btn flex items-center justify-center gap-2 rounded-full bg-[#111111] px-8 py-3.5 font-poppins text-[13px] font-medium uppercase tracking-[0.1em] text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#5B3DF5] hover:shadow-[0_4px_20px_rgba(91,61,245,0.25)]"
                aria-label="Subscribe to newsletter"
              >
                <span>Subscribe</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-500 group-hover/btn:translate-x-1"
                />
              </button>
            </div>
          </form>
        </div>

        {/*
          =======================================================================
          SECTION 4: TRUST ROW (Placed above Grid for better flow)
          =======================================================================
        */}
        <div className="relative mb-20 grid grid-cols-1 gap-10 border-y border-[#ECECEC] py-16 md:mb-24 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 bg-[#5B3DF5]/30"></div>

          {TRUST_BADGES.map((badge, idx) => {
            const BadgeIcon = badge.icon;
            return (
              <div
                key={idx}
                className="group flex cursor-default flex-col items-center text-center"
              >
                <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#ECECEC] bg-white text-[#111111] transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-2 group-hover:border-[#5B3DF5] group-hover:bg-[#5B3DF5] group-hover:text-white group-hover:shadow-[0_12px_30px_rgba(91,61,245,0.2)]">
                  <BadgeIcon
                    size={24}
                    strokeWidth={1.2}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h4 className="mb-3 font-playfair text-[19px] font-medium tracking-wide text-[#111111]">
                  {badge.title}
                </h4>
                <p className="max-w-[220px] font-poppins text-[13px] font-light leading-relaxed text-[#666666]">
                  {badge.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/*
          =======================================================================
          SECTION 3: FOOTER GRID
          =======================================================================
        */}
        <div className="mb-24 grid grid-cols-2 gap-12 lg:grid-cols-5 lg:gap-8">
          {/* Brand Column (Spans 2 on Desktop) */}
          <div className="col-span-2 flex flex-col justify-between lg:col-span-2 lg:pr-12">
            <div>
              <Link
                aria-label="Styloverse Home"
                className="group mb-8 inline-block"
                href="/"
              >
                <h2 className="font-playfair text-3xl font-semibold tracking-tighter text-[#111111] transition-colors duration-500 group-hover:text-[#5B3DF5] md:text-4xl">
                  STYLOVERSE<span className="text-[#5B3DF5]">.</span>
                </h2>
              </Link>
              <p className="mb-10 max-w-sm font-poppins text-[15px] font-light leading-relaxed text-[#666666]">
                Redefining the modern wardrobe with uncompromising quality
                and timeless elegance. Experience luxury crafted for the
                discerning individual.
              </p>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {FOOTER_LINKS.map((col, idx) => (
            <div key={idx} className="col-span-1">
              <h3 className="mb-8 font-poppins text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111111]">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-4">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      className="hover-underline-animation font-poppins text-[14px] font-light text-[#666666] transition-colors duration-300 hover:text-[#5B3DF5]"
                      href={FOOTER_HREFS[link] ?? "/help"}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social / Follow Column */}
          <div className="col-span-1">
            <h3 className="mb-8 font-poppins text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111111]">
              Follow Us
            </h3>
            <ul className="flex flex-col gap-4">
              {SOCIAL_LINKS.map((social, i) => {
                const SocialIcon = social.icon;
                return (
                  <li key={i}>
                    <Link
                      href={social.href}
                      aria-label={`Follow us on ${social.name}`}
                      className="group flex items-center gap-3 font-poppins text-[14px] font-light text-[#666666] transition-colors duration-300 hover:text-[#5B3DF5]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ECECEC] bg-white transition-all duration-500 group-hover:border-[#5B3DF5] group-hover:bg-[#5B3DF5] group-hover:text-white group-hover:shadow-[0_4px_15px_rgba(91,61,245,0.2)]">
                        <SocialIcon size={13} />
                      </span>
                      <span className="hover-underline-animation">
                        {social.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/*
          =======================================================================
          SECTION 5: BOTTOM BAR
          =======================================================================
        */}
        <div className="flex flex-col-reverse items-center justify-between gap-8 border-t border-[#ECECEC] pb-10 pt-8 lg:flex-row">
          <div className="flex flex-col items-center gap-3 text-center font-poppins text-[13px] font-light text-[#666666] md:flex-row md:gap-4 md:text-left">
            <p>© {new Date().getFullYear()} Styloverse. All rights reserved.</p>
            <span className="hidden h-1 w-1 rounded-full bg-[#ECECEC] md:inline-block"></span>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#704820]">
                KAEVON
              </p>
              <p className="mt-1 text-[11px] text-[#615A54]">
                Where Ideas Become Legacy
              </p>
              <p className="mt-0.5 text-[10px] text-[#615A54]">
                Designed &amp; Engineered by Abhishek Chopal
              </p>
            </div>
            {isAdmin ? (
              <>
                <span className="hidden h-1 w-1 rounded-full bg-[#ECECEC] md:inline-block"></span>
                <Link
                  href="/admin"
                  className="font-medium text-[#8A633A] transition hover:text-[#5B3DF5]"
                >
                  Admin Office
                </Link>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-3 transition-opacity duration-500">
            <div className="flex h-7 w-11 items-center justify-center rounded border border-[#ECECEC] bg-white text-[9px] font-bold tracking-wider text-[#111111] shadow-sm">
              VISA
            </div>
            <div className="flex h-7 w-11 items-center justify-center rounded border border-[#ECECEC] bg-white text-[9px] font-bold tracking-wider text-[#111111] shadow-sm">
              MC
            </div>
            <div className="flex h-7 w-11 items-center justify-center rounded border border-[#ECECEC] bg-white text-[9px] font-bold tracking-wider text-[#111111] shadow-sm">
              AMEX
            </div>
            <div className="flex h-7 w-11 items-center justify-center rounded border border-[#ECECEC] bg-white text-[9px] font-bold tracking-wider text-[#111111] shadow-sm">
              PAY
            </div>
          </div>

          <button
            onClick={handleScrollToTop}
            className="group flex items-center gap-3 font-poppins text-[13px] font-medium uppercase tracking-[0.1em] text-[#111111] transition-colors hover:text-[#5B3DF5]"
            aria-label="Back to Top"
          >
            <span>Back To Top</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ECECEC] bg-white shadow-sm transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-1 group-hover:border-[#5B3DF5] group-hover:bg-[#5B3DF5] group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(91,61,245,0.25)]">
              <MoveUp size={15} strokeWidth={1.5} />
            </span>
          </button>
        </div>
      </div>
      </div>
    </footer>
  );
}
