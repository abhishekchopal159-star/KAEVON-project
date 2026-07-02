import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

const categories = [
  {
    title: "Women",
    subtitle: "Elegant Fashion",
    tag: "Featured",
    image: "/images/categories/women.png",
    position: "50% 12%",
    href: "/shop?category=women",
    size: "large",
  },
  {
    title: "Men",
    subtitle: "Modern Collection",
    tag: "New In",
    image: "/images/categories/men.png",
    position: "50% 10%",
    href: "/shop?category=men",
    size: "small",
  },
  {
    title: "Footwear",
    subtitle: "Premium Sneakers",
    tag: "Trending",
    image: "/images/categories/footwear.png",
    position: "50% 50%",
    href: "/shop?category=footwear",
    size: "small",
  },
  {
    title: "Accessories",
    subtitle: "Luxury Essentials",
    tag: "Limited",
    image: "/images/categories/accessories.png",
    position: "50% 50%",
    href: "/shop?category=accessories",
    size: "small",
  },
];

export default function Categories() {
  const [featured, ...rest] = categories;

  return (
    <section className="relative overflow-hidden bg-[#FFF8F2] py-28 lg:py-36">

      {/* Ambient background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#5B3DF5]/[0.08] blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-[#5B3DF5]/[0.06] blur-[130px]" />
      </div>

      <div className="container relative z-10">

        {/* Heading */}
        <div className="mb-20 flex flex-col items-start justify-between gap-8 lg:mb-24 lg:flex-row lg:items-end">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5B3DF5]/15 bg-[#EFE6FF] px-5 py-2.5">
              <Sparkles size={15} strokeWidth={2.25} className="text-[#5B3DF5]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5B3DF5]">
                Shop By Category
              </span>
            </div>

            <h2 className="mt-7 max-w-xl font-serif text-[52px] font-black leading-[0.98] tracking-[-0.02em] text-[#111] sm:text-[64px] lg:text-[76px]">
              Find Your
              <br />
              <span className="text-[#5B3DF5]">Signature Style</span>
            </h2>
          </div>

          <p className="max-w-sm text-[17px] leading-[28px] text-[#666] lg:text-right">
            Four curated worlds, each edited for quality, craft, and quiet
            luxury — explore the collection built for you.
          </p>
        </div>

        {/* Editorial Grid: one large featured card + three stacked cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-7">

          {/* Featured Large Card */}
          <Link
            href={featured.href}
            className="group relative col-span-1 h-[420px] overflow-hidden rounded-[36px] shadow-[0_20px_60px_-20px_rgba(17,17,17,0.25)] ring-1 ring-black/[0.03] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_-20px_rgba(17,17,17,0.35)] sm:h-[520px] lg:col-span-7 lg:h-[700px]"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              style={{ objectPosition: featured.position }}
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 transition-opacity duration-500 group-hover:from-black/90" />

            {/* Border Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[36px] ring-1 ring-inset ring-white/0 transition-all duration-500 group-hover:ring-white/20" />

            {/* Shine Sweep */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-[1200ms] ease-out group-hover:translate-x-full" />

            {/* Floating Tag Badge */}
            <div className="absolute left-8 top-8 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              {featured.tag}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-9 lg:p-12">
              <p className="text-[16px] font-medium tracking-wide text-white/85 lg:text-[18px]">
                {featured.subtitle}
              </p>

              <h3 className="mt-2 font-serif text-[56px] font-black leading-[0.95] tracking-[-0.01em] text-white lg:text-[80px]">
                {featured.title}
              </h3>

              {/* Luxury CTA Button */}
              <div className="relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/30 bg-white/[0.08] px-8 py-4 text-white shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:border-white/50 group-hover:bg-white/[0.14] group-hover:shadow-[0_0_40px_-4px_rgba(255,255,255,0.5)]">
                {/* Inner glow sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />

                <span className="relative text-[13px] font-medium uppercase tracking-[0.22em] text-white/95">
                  Discover Collection
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.75}
                  className="relative transition-transform duration-500 ease-out group-hover:translate-x-2"
                />
              </div>
            </div>
          </Link>

          {/* Stacked Small Cards */}
          <div className="col-span-1 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:gap-7">
            {rest.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative h-[300px] overflow-hidden rounded-[30px] shadow-[0_16px_45px_-18px_rgba(17,17,17,0.25)] ring-1 ring-black/[0.03] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_-16px_rgba(17,17,17,0.32)] sm:h-[380px] lg:h-[212px]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  style={{ objectPosition: item.position }}
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/85" />

                {/* Border Glow */}
                <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/0 transition-all duration-500 group-hover:ring-white/20" />

                {/* Shine Sweep */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />

                {/* Floating Tag Badge */}
                <div className="absolute left-6 top-6 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  {item.tag}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between gap-4 p-6 lg:p-7">
                  <div>
                    <p className="text-[13px] font-medium tracking-wide text-white/85">
                      {item.subtitle}
                    </p>
                    <h3 className="mt-1 font-serif text-[30px] font-black leading-[0.95] tracking-[-0.01em] text-white lg:text-[32px]">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-[#111]">
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}