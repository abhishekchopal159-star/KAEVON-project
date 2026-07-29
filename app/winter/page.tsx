import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Snowflake,
} from "lucide-react";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductGrid from "@/components/Shop/ProductGrid";

import { products } from "@/data/products";

import {
  WINTER_SUBCATEGORIES,
} from "@/data/navigation";

export default function WinterPage() {
  const winterProducts =
    products.filter(
      (product) =>
        product.category === "WINTER"
    );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F3F5F7] pt-[104px]">
        {/* Special winter hero */}

        <section className="relative overflow-hidden bg-gradient-to-br from-[#09111F] via-[#172033] to-[#293246]">
          <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="mx-auto grid min-h-[650px] max-w-[1540px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-20">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-white backdrop-blur">
                <Snowflake size={16} />

                <span className="text-[10px] font-semibold uppercase tracking-[0.32em]">
                  Winter Collection 2026
                </span>
              </div>

              <h1 className="mt-7 text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Made for
                <br />
                colder days.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
                Premium coats, knitwear,
                boots and cold-weather
                essentials designed for warmth,
                comfort and refined styling.
              </p>

              <Link
                href="/winter/coats"
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#111827] transition hover:-translate-y-1 hover:bg-[#EDE9FE]"
              >
                Explore Winter Coats

                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="relative h-[460px] sm:h-[540px]">
              <Image
                src="/images/shop/products/winter/coats/winter-camel-wool-long-coat-01.png"
                alt="Styloverse camel wool winter coat"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-center drop-shadow-[0_35px_55px_rgba(0,0,0,0.35)]"
              />
            </div>
          </div>
        </section>

        {/* Winter subcategories */}

        <section className="mx-auto max-w-[1540px] px-5 py-16 sm:px-8 lg:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#64748B]">
            Shop by category
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
            Winter Essentials
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WINTER_SUBCATEGORIES.map(
              (category) => {
                const previewProduct =
                  winterProducts.find(
                    (product) =>
                      product.subcategory ===
                      category.slug
                  );

                return (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="group overflow-hidden rounded-[24px] border border-[#DDE2E8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F5F7]">
                      {previewProduct && (
                        <Image
                          src={
                            previewProduct.image
                          }
                          alt={category.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-contain p-5 transition duration-700 group-hover:scale-[1.04]"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between p-5">
                      <div>
                        <h3 className="text-xl font-semibold text-[#111827]">
                          {category.name}
                        </h3>

                        <p className="mt-1 text-xs text-[#64748B]">
                          Explore collection
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white transition group-hover:bg-[#5B3DF5]">
                        <ArrowRight
                          size={16}
                        />
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </section>

        {/* Winter product grid */}

        <section className="mx-auto max-w-[1540px] px-5 pb-24 sm:px-8">
          <ProductGrid
            items={winterProducts}
            catalogScope={{
              category: "WINTER",
            }}
            eyebrow="Seasonal Selection"
            heading="All Winter Products"
            description="Explore the complete Styloverse winter collection."
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
