"use client";

import React from "react";
import Image from "next/image";

const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="#C59A3D"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
  </svg>
);

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 80"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M0 80V52.8C0 33.6 6.4 19.2 19.2 9.6 25.6 4.8 33.6 1.6 43.2 0l4.8 12.8c-8 1.6-14.4 4.8-19.2 9.6-4.8 4.8-7.2 11.2-7.2 19.2h22.4V80H0zm52.8 0V52.8c0-19.2 6.4-33.6 19.2-43.2C78.4 4.8 86.4 1.6 96 0l4.8 12.8c-8 1.6-14.4 4.8-19.2 9.6-4.8 4.8-7.2 11.2-7.2 19.2h22.4V80H52.8z" />
  </svg>
);

const Testimonials = () => {
  return (
    <section className="relative w-full max-w-full overflow-hidden bg-[#FFF8F2] py-28 lg:py-36">
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

            @keyframes float-slow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-12px); }
            }
            @keyframes float-slower {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
            @keyframes shine-sweep {
              100% { left: 200%; }
            }

            .animate-float-1 { animation: float-slow 7s ease-in-out infinite; }
            .animate-float-2 { animation: float-slower 10s ease-in-out infinite; }
            .animate-float-3 { animation: float-slow 12s ease-in-out infinite; }

            .luxury-glass-card {
              background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 100%);
              backdrop-filter: blur(24px);
              -webkit-backdrop-filter: blur(24px);
              border: 1px solid rgba(255,255,255,0.8);
              box-shadow:
                0 30px 60px -15px rgba(91,61,245,0.06),
                0 0 0 1px rgba(197,154,61,0.03) inset;
            }

            .luxury-glass-card:hover {
              background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 100%);
              border: 1px solid rgba(197,154,61,0.25);
              box-shadow:
                0 40px 80px -20px rgba(91,61,245,0.15),
                0 0 0 1px rgba(197,154,61,0.1) inset,
                0 0 40px rgba(197,154,61,0.05);
            }

            .shine-element {
              position: absolute;
              top: 0;
              left: -100%;
              width: 50%;
              height: 100%;
              background: linear-gradient(to right, transparent, rgba(255,255,255,0.9), transparent);
              transform: skewX(-25deg);
              z-index: 20;
              pointer-events: none;
            }

            .luxury-glass-card:hover .shine-element {
              animation: shine-sweep 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
          `,
        }}
      />

      {/*
        =======================================================================
        AMBIENT BACKGROUND EFFECTS
        =======================================================================
      */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        {/* Soft Primary Glow */}
        <div className="absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-[#5B3DF5] opacity-[0.03] blur-[120px] mix-blend-multiply" />

        {/* Gold Accent Glow */}
        <div className="absolute -right-[15%] top-[40%] h-[60vw] w-[60vw] rounded-full bg-[#C59A3D] opacity-[0.04] blur-[140px] mix-blend-multiply" />

        {/* Minimal SVG Grid Decoration */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(#171717 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="container relative z-10">
        {/*
          =======================================================================
          SECTION HEADER
          =======================================================================
        */}
        <div className="mx-auto mb-20 flex max-w-4xl flex-col items-center justify-center text-center md:mb-32">
          {/* Luxury Badge */}
          <div className="group mb-8 flex items-center gap-3 rounded-full border border-[#C59A3D]/20 bg-white/50 px-6 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-500 hover:border-[#C59A3D]/40 hover:bg-white/80 md:mb-10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C59A3D] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C59A3D]"></span>
            </span>
            <span className="font-poppins text-xs font-medium uppercase tracking-[0.25em] text-[#C59A3D] md:text-sm">
              The Clientele
            </span>
          </div>

          {/* Large Editorial Heading */}
          <h2 className="mb-8 font-playfair text-5xl leading-[1.1] tracking-tight text-[#171717] md:mb-10 md:text-7xl lg:text-8xl">
            Voices of <br className="hidden md:block" />
            <span className="relative inline-block font-light italic text-[#5B3DF5]">
              Elegance
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full text-[#C59A3D]/30 md:-bottom-4 md:h-5"
                viewBox="0 0 200 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,10 Q100,20 200,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </h2>

          {/* Elegant Description */}
          <p className="max-w-2xl font-poppins text-lg font-light leading-relaxed text-[#666666] md:text-xl">
            Discover the profound impact of uncompromising craftsmanship. A
            curated collection of reflections from our most esteemed patrons
            worldwide.
          </p>
        </div>

        {/*
          =======================================================================
          ASYMMETRIC EDITORIAL LAYOUT (TESTIMONIAL CARDS)
          =======================================================================
        */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* --- CARD 1: Featured Left (Large) --- */}
          <div className="group relative animate-float-1 lg:col-span-7">
            <div className="luxury-glass-card relative w-full overflow-hidden rounded-[2.5rem] p-8 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-4 md:p-14 lg:p-16">
              <div className="shine-element" />

              <QuoteIcon className="absolute -top-6 left-6 h-32 w-32 -rotate-12 transform text-[#C59A3D] opacity-[0.04] transition-transform duration-700 group-hover:scale-110 group-hover:opacity-[0.08] md:left-8 md:top-8 md:h-48 md:w-48" />

              <div className="relative z-10 flex h-full flex-col justify-between gap-12 md:gap-20">
                <h3 className="font-playfair text-3xl font-medium leading-[1.3] tracking-tight text-[#171717] md:text-4xl lg:text-5xl">
                  &ldquo;The craftsmanship is truly unparalleled. It feels
                  less like clothing and more like curated art. Styloverse
                  has redefined my entire approach to modern
                  dressing.&rdquo;
                </h3>

                <div className="mt-auto flex items-center gap-6">
                  <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-[#C59A3D] to-[#5B3DF5] p-[2px] md:h-24 md:w-24">
                    <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-white bg-white">
                      <Image
                        src="https://images.unsplash.com/photo-1485875437342-9b39470b3d95?q=80&w=800&auto=format&fit=crop"
                        alt="Victoria C."
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 font-playfair text-xl font-semibold text-[#171717] md:text-2xl">
                      Victoria C.
                    </h4>
                    <p className="mb-2 font-poppins text-xs font-medium uppercase tracking-wide text-[#666666] md:text-base">
                      Creative Director
                    </p>
                    <div className="flex gap-1">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- CARD 2: Right Stacked (Tall) --- */}
          <div className="group relative animate-float-2 lg:col-span-5 lg:mt-32">
            <div className="luxury-glass-card relative w-full overflow-hidden rounded-[2.5rem] p-8 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-4 md:p-12">
              <div className="shine-element" />

              <QuoteIcon className="absolute bottom-10 right-10 h-40 w-40 rotate-12 transform text-[#5B3DF5] opacity-[0.03] transition-transform duration-700 group-hover:scale-110 group-hover:opacity-[0.06]" />

              <div className="relative z-10 flex flex-col gap-10">
                <div className="flex items-start justify-between">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full shadow-lg ring-4 ring-white md:h-20 md:w-20">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
                      alt="Julian M."
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex gap-1">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </div>
                </div>

                <h3 className="font-playfair text-2xl font-light italic leading-[1.4] text-[#171717] md:text-3xl md:leading-[1.5]">
                  &ldquo;An absolute masterclass in modern luxury. Every
                  meticulous detail, from the exactness of the cut to the
                  drape of the fabric, exudes quiet confidence and timeless
                  elegance.&rdquo;
                </h3>

                <div className="mt-4 border-t border-[#171717]/5 pt-8">
                  <h4 className="mb-1 font-playfair text-lg font-semibold text-[#171717] md:text-xl">
                    Julian M.
                  </h4>
                  <p className="font-poppins text-xs font-medium uppercase tracking-widest text-[#666666]">
                    Global Architect
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- CARD 3: Center Wide (Bottom) --- */}
          <div className="group relative animate-float-3 lg:col-span-10 lg:col-start-2 lg:mt-16">
            <div className="luxury-glass-card relative w-full overflow-hidden rounded-[2.5rem] p-10 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-4 md:p-16">
              <div className="shine-element" />

              <div className="relative z-10 flex flex-col items-center gap-12 md:flex-row md:gap-16">
                <div className="flex w-full flex-col items-center text-center md:w-1/3">
                  <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] md:h-36 md:w-36">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
                      alt="Eleanor V."
                      fill
                      sizes="144px"
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="mb-2 font-playfair text-xl font-semibold text-[#171717] md:text-2xl">
                    Eleanor V.
                  </h4>
                  <p className="mb-4 font-poppins text-xs font-medium uppercase tracking-widest text-[#666666]">
                    Fashion Editor
                  </p>
                  <div className="flex justify-center gap-1">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </div>
                </div>

                <div className="relative w-full md:w-2/3">
                  <QuoteIcon className="absolute -top-12 left-0 h-24 w-24 -rotate-6 transform text-[#C59A3D] opacity-10 md:-left-8" />
                  <h3 className="relative z-10 font-playfair text-2xl leading-[1.4] text-[#171717] md:text-3xl lg:text-4xl">
                    &ldquo;I have experienced true luxury across the globe,
                    yet the curation, fabric selection, and overall quality
                    here remain entirely unmatched. A revelation for the
                    modern wardrobe.&rdquo;
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
