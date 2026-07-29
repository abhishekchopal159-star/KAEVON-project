import { Suspense } from "react";
import Image from "next/image";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ShopCatalog from "@/components/Shop/ShopCatalog";

function CatalogFallback() {
  return (
    <div className="animate-pulse">
      <div className="mb-9 h-[270px] rounded-[30px] border border-[#D9CEC2] bg-[linear-gradient(135deg,#19161A,#2D2434)] sm:h-[235px]" />
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden h-[680px] rounded-[28px] bg-[#EEE5DC] lg:block" />
        <div>
          <div className="mb-9 h-28 rounded-3xl bg-[#EEE5DC]" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[500px] rounded-[24px] bg-[#EEE5DC]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F2] pt-[104px]">
        {/* Shop hero */}

        <section className="relative aspect-[43/24] min-h-[220px] overflow-hidden bg-[#756A62] sm:aspect-auto sm:h-[390px]">
          <Image
            src="/images/shop/shop-banner.png"
            alt="Styloverse shop collection"
            fill
            preload
            sizes="100vw"
            className="object-contain object-center sm:object-cover sm:object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-black/5 sm:via-black/40 sm:to-black/15" />

          <div className="relative z-10 mx-auto flex h-full max-w-[1540px] items-center px-5 sm:px-8">
            <div className="max-w-[58%] sm:max-w-2xl">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[7px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur sm:px-4 sm:py-2 sm:text-[10px] sm:tracking-[0.35em]">
                Styloverse 2026
              </span>

              <h1 className="mt-2.5 text-[29px] font-semibold leading-[0.92] tracking-[-0.035em] text-white sm:mt-5 sm:text-6xl sm:leading-[0.95] sm:tracking-tight">
                Luxury Fashion
                <br />
                Collection
              </h1>

              <p className="mt-2.5 max-w-[210px] text-[9px] leading-[1.55] text-white/75 sm:mt-5 sm:max-w-xl sm:text-base sm:leading-7">
                Explore premium fashion,
                footwear and accessories
                designed for timeless style.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1540px] px-5 py-14 sm:px-8 lg:py-20">
          <Suspense fallback={<CatalogFallback />}>
            <ShopCatalog />
          </Suspense>
        </section>
      </main>

      <Footer />
    </>
  );
}
