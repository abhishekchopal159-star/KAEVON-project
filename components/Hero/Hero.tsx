import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  BadgeCheck,
  Star,
  ArrowRight,
  Sparkles,
  Users,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FFF8F2]">

      {/* Background Image */}
      <Image
        src="/images/banners/new1.png"
        alt="Hero Banner"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-contain object-[right_center] scale-[1.02] select-none"
        draggable={false}
      />

      {/* Left Gradient */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#FFF8F2] via-[#FFF8F2]/75 to-transparent" />

      {/* Decorative ambient glows (behind content, does not touch image) */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#5B3DF5]/[0.09] blur-[110px]" />
        <div className="absolute bottom-0 left-[6%] h-[300px] w-[300px] rounded-full bg-[#5B3DF5]/[0.06] blur-[90px]" />
      </div>

      {/* Content */}
      <div className="container relative z-10 flex min-h-screen items-center pt-20 lg:pt-28">

        <div className="max-w-[700px]">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5B3DF5]/15 bg-[#EFE6FF] px-6 py-3 shadow-[0_2px_10px_-2px_rgba(91,61,245,0.15)]">
            <Sparkles size={17} strokeWidth={2.25} className="text-[#5B3DF5]" />
            <span className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#5B3DF5]">
              New Collection 2026
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-9 text-[64px] font-black leading-[0.95] tracking-[-0.02em] text-[#111] sm:text-[76px] lg:text-[88px] xl:text-[96px]">
            Where Fashion
            <br />
            <span className="relative inline-block text-[#5B3DF5]">
              Meets You
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="14"
                viewBox="0 0 300 14"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 11C60 3 140 2 298 9"
                  stroke="#5B3DF5"
                  strokeOpacity="0.35"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-[560px] text-[20px] leading-[34px] text-[#555] lg:text-[22px] lg:leading-[38px]">
            Discover premium fashion, footwear and accessories crafted to
            elevate your everyday style.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">

            <Link
              href="/shop"
              className="group relative flex h-[64px] min-w-[220px] items-center justify-center overflow-hidden rounded-2xl px-8 text-[18px] font-semibold tracking-[0.01em] text-white shadow-[0_14px_32px_-10px_rgba(91,61,245,0.55)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_22px_44px_-12px_rgba(91,61,245,0.6)] active:translate-y-0"
              style={{
                background:
                  "linear-gradient(90deg,#6A4DFF 0%,#4E2EDB 100%)",
              }}
            >
              <span className="relative z-10 flex items-center">
                Shop Now
                <ArrowRight
                  size={20}
                  strokeWidth={2.5}
                  className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </span>
              <span className="absolute inset-0 -z-0 translate-y-full bg-white/10 transition-transform duration-500 group-hover:translate-y-0" />
            </Link>

            <Link
              href="/shop"
              className="group flex h-[64px] min-w-[250px] items-center justify-center rounded-2xl border-[1.5px] border-[#222] bg-white px-8 text-[18px] font-semibold text-[#111] transition-all duration-300 hover:-translate-y-[3px] hover:border-[#5B3DF5] hover:text-[#5B3DF5] hover:shadow-[0_18px_36px_-12px_rgba(17,17,17,0.15)] active:translate-y-0"
            >
              Explore Collection
            </Link>

          </div>

          {/* Customer Trust Row */}
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-[#FFF8F2] bg-gradient-to-br from-[#5B3DF5]/70 to-[#111]/60"
                  />
                ))}
              </div>
              <span className="ml-1 flex items-center gap-1 text-[14px] font-medium text-[#555]">
                <Users size={15} className="text-[#5B3DF5]" />
                15K+ Happy Customers
              </span>
            </div>

            <div className="hidden h-4 w-px bg-[#DDD] sm:block" />

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-[#5B3DF5] text-[#5B3DF5]"
                  />
                ))}
              </div>
              <span className="text-[14px] font-medium text-[#555]">
                4.9 Rating
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-3 gap-4 border-t border-[#111]/[0.07] pt-10 sm:gap-6">

            {/* FREE DELIVERY */}
            <div className="group cursor-default rounded-2xl p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_18px_36px_-16px_rgba(17,17,17,0.18)] hover:backdrop-blur-sm sm:p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5B3DF5]/10 transition-colors duration-300 group-hover:bg-[#5B3DF5]/15">
                <Truck size={24} strokeWidth={2} className="text-[#5B3DF5]" />
              </div>
              <h4 className="mt-4 text-[14px] font-bold uppercase tracking-wide text-[#111] sm:text-[15px]">
                Free Delivery
              </h4>
              <p className="mt-1 text-[13px] text-[#666] sm:text-[14px]">
                On all orders
              </p>
            </div>

            {/* RETURNS */}
            <div className="group cursor-default rounded-2xl p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_18px_36px_-16px_rgba(17,17,17,0.18)] hover:backdrop-blur-sm sm:p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5B3DF5]/10 transition-colors duration-300 group-hover:bg-[#5B3DF5]/15">
                <ShieldCheck size={24} strokeWidth={2} className="text-[#5B3DF5]" />
              </div>
              <h4 className="mt-4 text-[14px] font-bold uppercase tracking-wide text-[#111] sm:text-[15px]">
                Easy Returns
              </h4>
              <p className="mt-1 text-[13px] text-[#666] sm:text-[14px]">
                Within 7 days
              </p>
            </div>

            {/* QUALITY */}
            <div className="group cursor-default rounded-2xl p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_18px_36px_-16px_rgba(17,17,17,0.18)] hover:backdrop-blur-sm sm:p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5B3DF5]/10 transition-colors duration-300 group-hover:bg-[#5B3DF5]/15">
                <BadgeCheck size={24} strokeWidth={2} className="text-[#5B3DF5]" />
              </div>
              <h4 className="mt-4 text-[14px] font-bold uppercase tracking-wide text-[#111] sm:text-[15px]">
                Premium Quality
              </h4>
              <p className="mt-1 text-[13px] text-[#666] sm:text-[14px]">
                Best quality products
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}