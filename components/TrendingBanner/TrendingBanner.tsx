import Image from "next/image";
import Link from "next/link";

export default function TrendingBanner() {
  return (
    <section className="bg-[#FFF8F2] py-28">
      <div className="container">
        <div className="relative h-[650px] overflow-hidden rounded-[40px]">

          {/* Background Image */}
          <Image
  src="/images/banners/Banner.png"
  alt="Winter Collection"
  fill
  priority
  className="object-cover"
/>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 z-10 flex items-center">

            <div className="max-w-[620px] pl-16">

              <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white backdrop-blur">
                TRENDING COLLECTION
              </span>

              <h2 className="mt-8 font-serif text-5xl font-black leading-tight text-white lg:text-6xl">
                Winter Collection 2026
              </h2>

              <p className="mt-6 text-lg leading-8 text-white/85">
                Discover premium fashion designed for everyday comfort,
                confidence and timeless elegance.
              </p>

              <Link
                href="/"
                className="group mt-10 inline-flex items-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-[#111] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Shop Collection

                <span className="ml-3 transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </Link>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}