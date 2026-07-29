import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductGrid from "@/components/Shop/ProductGrid";

import { products } from "@/data/products";

import {
  WINTER_SUBCATEGORIES,
  formatRouteLabel,
} from "@/data/navigation";

type WinterSubcategoryPageProps = {
  params: Promise<{
    subcategory: string;
  }>;
};

export default async function WinterSubcategoryPage({
  params,
}: WinterSubcategoryPageProps) {
  const { subcategory } =
    await params;

  const subcategorySlug =
    subcategory.toLowerCase();

  const validSubcategory =
    WINTER_SUBCATEGORIES.some(
      (item) =>
        item.slug ===
        subcategorySlug
    );

  if (!validSubcategory) {
    notFound();
  }

  const winterProducts =
    products.filter(
      (product) =>
        product.category ===
          "WINTER" &&
        product.subcategory ===
          subcategorySlug
    );

  if (
    winterProducts.length === 0
  ) {
    notFound();
  }

  const title =
    formatRouteLabel(
      subcategorySlug
    );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F3F5F7] pt-[104px]">
        <section className="mx-auto max-w-[1540px] px-5 py-12 sm:px-8 lg:py-16">
          <Link
            href="/winter"
            className="inline-flex text-sm font-semibold text-[#475569] transition hover:-translate-x-1 hover:text-[#5B3DF5]"
          >
            ← Back to Winter Collection
          </Link>

          <div className="mt-8">
            <ProductGrid
              items={winterProducts}
              catalogScope={{
                category: "WINTER",
                subcategory:
                  subcategorySlug,
              }}
              eyebrow="Winter Collection"
              heading={title}
              description={`Explore premium winter ${title.toLowerCase()} designed for warmth, comfort and refined seasonal styling.`}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
