import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import CollectionHoverGrid, {
  type CollectionPreview,
} from "@/components/Collections/CollectionHoverGrid";

import {
  products,
  type ProductCategory,
} from "@/data/products";

type CollectionDefinition = {
  name: string;
  href: string;
  eyebrow: string;
  category: ProductCategory;
  productNames: readonly string[];
};

const COLLECTION_DEFINITIONS: readonly CollectionDefinition[] = [
  {
    name: "Men",
    href: "/shop/men",
    eyebrow: "Modern Heritage",
    category: "MEN",
    productNames: [
      "Black Embroidered Kurta Pajama",
      "Charcoal Turtleneck Sweater",
      "Navy Festive Kurta Pajama",
    ],
  },
  {
    name: "Women",
    href: "/shop/women",
    eyebrow: "The Signature Edit",
    category: "WOMEN",
    productNames: [
      "Champagne Gold Draped Dress",
      "Deep Teal Satin Saree",
      "Maroon Velvet Slit Dress",
    ],
  },
  {
    name: "Streetwear",
    href: "/shop/streetwear",
    eyebrow: "Modern Culture",
    category: "STREETWEAR",
    productNames: [
      "Washed Grey Graphic T-Shirt",
      "Cream Premium Hoodie",
      "Olive Utility Cargo Pants",
    ],
  },
  {
    name: "Footwear",
    href: "/shop/footwear",
    eyebrow: "Sculpted Steps",
    category: "FOOTWEAR",
    productNames: [
      "Black Leather Ankle Boots",
      "Black Pointed Toe Heels",
      "Tan Leather Sandals",
    ],
  },
  {
    name: "Accessories",
    href: "/shop/accessories",
    eyebrow: "Finishing Touches",
    category: "ACCESSORIES",
    productNames: [
      "Gold Minimal Necklace",
      "Ivory Mini Shoulder Bag",
      "Pearl Drop Earrings",
    ],
  },
  {
    name: "Winter",
    href: "/winter",
    eyebrow: "Cold Weather Atelier",
    category: "WINTER",
    productNames: [
      "Ivory Belted Winter Coat",
      "Charcoal Ribbed Knit Dress",
      "Forest Green Half-Zip Sweater",
    ],
  },
];

const collectionPreviews: CollectionPreview[] =
  COLLECTION_DEFINITIONS.map((collection) => ({
    name: collection.name,
    href: collection.href,
    eyebrow: collection.eyebrow,
    products: collection.productNames.flatMap((productName) => {
      const product = products.find(
        (candidate) =>
          candidate.name === productName &&
          candidate.category === collection.category
      );

      return product
        ? [
            {
              name: product.name,
              image: product.image,
            },
          ]
        : [];
    }),
  })).filter(
    (collection) => collection.products.length > 0
  );

export default function CollectionsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F4EFE9] pb-24 pt-[112px] md:bg-[#FFF8F2] md:pb-0 md:pt-36">
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A67C52] md:text-xs md:tracking-[0.35em]">
                Styloverse Collections
              </p>

              <h1 className="mt-3 text-[42px] font-semibold leading-[0.96] tracking-[-0.045em] text-[#171717] md:mt-4 md:text-5xl sm:text-6xl">
                Choose your world.
              </h1>

              <p className="mt-4 text-[13px] leading-6 text-[#666] md:mt-6 md:text-lg md:leading-8">
                Every collection has its own dedicated page and selected
                products.
              </p>
            </div>

            <div className="hidden items-center gap-3 rounded-full border border-[#DDD3C9] bg-white/70 px-5 py-3 text-xs font-medium text-[#6D655E] shadow-sm backdrop-blur sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#5B3DF5] shadow-[0_0_0_5px_rgba(91,61,245,0.10)]" />
              Hover a collection to preview the edit
            </div>
          </div>

          <CollectionHoverGrid
            collections={collectionPreviews}
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
