import { products as catalogProducts } from "@/data/products";

export type RecommendedProductData = {
  id: number;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  image: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  stock: number;
  size: string;
  color: string;
};

const RECOMMENDED_PRODUCT_NAMES = [
  "Black Embroidered Kurta Pajama",
  "Burnt Orange Organza Saree",
  "Gold Minimal Necklace",
  "Black Leather Ankle Boots",
] as const;

export const accountRecommendedProducts: RecommendedProductData[] =
  RECOMMENDED_PRODUCT_NAMES.map((name) =>
    catalogProducts.find((product) => product.name === name)
  )
    .filter((product) => product !== undefined)
    .map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      image: product.image,
      price: product.price,
      oldPrice: product.oldPrice,
      badge: product.badge,
      stock: product.stock,
      size: product.sizes[0] ?? "",
      color: product.colors[0]?.name ?? "",
    }));
