import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Snowflake,
} from "lucide-react";

export default function TrendingBanner() {
  return (
    <section className="bg-[#FFF8F2] px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto min-h-[600px] max-w-7xl overflow-hidden rounded-[36px] bg-[#111827]">
        <Image
          src="/images/shop/products/winter/coats/winter-camel-wool-long-coat-01.png"
          alt="Styloverse Winter Collection"
          fill
          className="object-cover object-center opacity-70"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120]/95 via-[#0B1120]/70 to-[#0B1120]/10" />

        <div className="relative z-10 flex min-h-[600px] items-center px-7 py-20 sm:px-12 lg:px-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur-md">
              <Snowflake size={16} />

              <span className="text-xs font-semibold uppercase tracking-[0.25em]">
                Winter 2026
              </span>
            </div>

            <h2 className="mt-7 text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Warmth meets
              <br />
              refined style.
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
              Explore premium coats, jackets,
              knitwear, boots and seasonal
              accessories created for colder days.
            </p>

            <Link
              href="/winter"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-[#111827] transition hover:-translate-y-1 hover:shadow-xl"
            >
              Shop Winter Collection
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}