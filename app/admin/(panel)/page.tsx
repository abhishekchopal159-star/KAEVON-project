import type { Metadata } from "next";

import AdminOverview from "@/components/admin/AdminOverview";
import { products } from "@/data/products";
import type { AdminCatalogSummary } from "@/types/admin";

export const metadata: Metadata = {
  title: "Overview",
};

function getCatalogSummary(): AdminCatalogSummary {
  const lowStockProducts = products
    .filter(
      (product) =>
        product.stock <= 12
    )
    .sort(
      (firstProduct, secondProduct) =>
        firstProduct.stock -
        secondProduct.stock
    );

  return {
    productCount: products.length,
    inventoryUnits: products.reduce(
      (total, product) =>
        total + product.stock,
      0
    ),
    lowStockCount:
      lowStockProducts.length,
    categoryCount: new Set(
      products.map(
        (product) =>
          product.category
      )
    ).size,
    lowStockProducts:
      lowStockProducts.map(
        (product) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          stock: product.stock,
          category:
            product.category,
        })
      ),
  };
}

export default function AdminOverviewPage() {
  return (
    <AdminOverview
      catalog={getCatalogSummary()}
    />
  );
}

