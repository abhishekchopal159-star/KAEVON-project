import Image from "next/image";
import Link from "next/link";

export default function ShopHero() {
  return (
    <section className="bg-[#FFF8F2]">

      <div className="container py-10">

        <div className="relative h-[520px] overflow-hidden rounded-[40px]">

          {/* Background */}
          <Image
            src="/images/shop/shop-banner.png"
            alt="Shop Banner"
            fill
            priority
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 z-10 flex items-center">

            <div className="max-w-[620px] pl-16">

              <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-white backdrop-blur">
                PREMIUM FASHION
              </span>

              <h1 className="mt-7 font-serif text-5xl font-black leading-tight text-white md:text-6xl">
                Shop Our Collection
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/85">
                Discover premium clothing, footwear and accessories
                crafted for modern lifestyles with timeless elegance.
              </p>

              <div className="mt-10 flex items-center gap-5">

                <Link
                  href="#products"
                  className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-[#111] transition duration-300 hover:scale-105"
                >
                  Explore Products
                </Link>

                <Link
                  href="/"
                  className="rounded-full border border-white/30 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-[#111]"
                >
                  Back Home
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}