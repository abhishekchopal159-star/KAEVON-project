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

type SubcategoryPageProps = {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
};

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const {
    category,
    subcategory,
  } = await params;

  const categorySlug =
    category.toLowerCase();

  const subcategorySlug =
    subcategory.toLowerCase();

  const config =
    SHOP_CATEGORY_CONFIG[
      categorySlug as keyof typeof SHOP_CATEGORY_CONFIG
    ];

  if (!config) {
    notFound();
  }

  const allowedSubcategories =
    config.subcategories as readonly string[];

  if (
    !allowedSubcategories.includes(
      subcategorySlug
    )
  ) {
    notFound();
  }

  const filteredProducts =
    products.filter(
      (product) =>
        product.category ===
          (config.productCategory as ProductCategory) &&
        product.subcategory ===
          subcategorySlug
    );

  if (filteredProducts.length === 0) {
    notFound();
  }

  const subcategoryTitle =
    formatRouteLabel(
      subcategorySlug
    );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F2] pt-[104px]">
        <section className="mx-auto max-w-[1540px] px-5 py-12 sm:px-8 lg:py-16">
          <Link
            href={config.href}
            className="inline-flex text-sm font-semibold text-[#5B3DF5] transition hover:-translate-x-1"
          >
            ← Back to {config.name}
          </Link>

          <div className="mt-8">
            <ProductGrid
              items={filteredProducts}
              catalogScope={{
                category:
                  config.productCategory as ProductCategory,
                subcategory:
                  subcategorySlug,
              }}
              eyebrow={`${config.name} Collection`}
              heading={subcategoryTitle}
              description={`Explore premium ${subcategoryTitle.toLowerCase()} from the Styloverse ${config.name} collection.`}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
