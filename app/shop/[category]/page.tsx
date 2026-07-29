import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductGrid from "@/components/Shop/ProductGrid";

import {
  products,
  type ProductCategory,
} from "@/data/products";

import {
  SHOP_CATEGORY_CONFIG,
  formatRouteLabel,
} from "@/data/navigation";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;

  const categorySlug =
    category.toLowerCase();

  const config =
    SHOP_CATEGORY_CONFIG[
      categorySlug as keyof typeof SHOP_CATEGORY_CONFIG
    ];

  if (!config) {
    notFound();
  }

  const categoryProducts =
    products.filter(
      (product) =>
        product.category ===
        (config.productCategory as ProductCategory)
    );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F2] pt-[104px]">
        {/* Category header */}

        <section className="border-b border-black/[0.06] bg-gradient-to-br from-white via-[#FFF8F2] to-[#F1E8DF]">
          <div className="mx-auto max-w-[1540px] px-5 py-14 sm:px-8 lg:py-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#A67C52]">
              {config.eyebrow}
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#171717] sm:text-5xl lg:text-6xl">
              {config.title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#666] sm:text-base">
              {config.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {config.subcategories.map(
                (subcategory) => (
                  <Link
                    key={subcategory}
                    href={`/shop/${categorySlug}/${subcategory}`}
                    className="rounded-full border border-[#DDD4C9] bg-white px-4 py-2 text-xs font-semibold text-[#444] transition hover:border-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white"
                  >
                    {formatRouteLabel(
                      subcategory
                    )}
                  </Link>
                )
              )}
            </div>
          </div>
        </section>

        {/* Products */}

        <section className="mx-auto max-w-[1540px] px-5 py-14 sm:px-8 lg:py-20">
          <ProductGrid
            items={categoryProducts}
            catalogScope={{
              category:
                config.productCategory as ProductCategory,
            }}
            eyebrow={config.eyebrow}
            heading={`${config.name} Products`}
            description={
              config.description
            }
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
