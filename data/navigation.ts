export const SHOP_CATEGORY_CONFIG = {
  men: {
    name: "Men",
    title: "Men's Collection",
    eyebrow: "Modern Menswear",
    description:
      "Explore refined tailoring, contemporary essentials and premium everyday menswear.",
    productCategory: "MEN",
    href: "/shop/men",
    subcategories: [
      "blazers",
      "denim",
      "knitwear",
      "kurta-pajama",
      "outerwear",
      "shirts",
      "trousers",
    ],
  },

  women: {
    name: "Women",
    title: "Women's Collection",
    eyebrow: "The Signature Edit",
    description:
      "Discover dresses, sarees, tailoring and elevated wardrobe essentials.",
    productCategory: "WOMEN",
    href: "/shop/women",
    subcategories: [
      "blazers",
      "denim",
      "dresses",
      "knitwear",
      "sarees",
      "tops",
      "trousers",
    ],
  },

  streetwear: {
    name: "Streetwear",
    title: "Streetwear Collection",
    eyebrow: "Modern Culture",
    description:
      "Explore hoodies, cargos, jackets and contemporary street essentials.",
    productCategory: "STREETWEAR",
    href: "/shop/streetwear",
    subcategories: [
      "cargos",
      "co-ords",
      "hoodies",
      "jackets",
      "tshirts",
    ],
  },

  footwear: {
    name: "Footwear",
    title: "Footwear Collection",
    eyebrow: "Elevated Steps",
    description:
      "Discover premium sneakers, boots, heels, loafers and sandals.",
    productCategory: "FOOTWEAR",
    href: "/shop/footwear",
    subcategories: [
      "boots",
      "heels",
      "loafers",
      "sandals",
      "sneakers",
    ],
  },

  accessories: {
    name: "Accessories",
    title: "Accessories Collection",
    eyebrow: "Finishing Touches",
    description:
      "Complete your look with premium bags, jewelry, belts, scarves and eyewear.",
    productCategory: "ACCESSORIES",
    href: "/shop/accessories",
    subcategories: [
      "bags",
      "belts",
      "jewelry",
      "scarves",
      "sunglasses",
      "wallets",
    ],
  },
} as const;

export const SHOP_CATEGORY_LINKS = Object.entries(
  SHOP_CATEGORY_CONFIG
).map(([slug, config]) => ({
  slug,
  name: config.name,
  href: config.href,
}));

export const WINTER_SUBCATEGORIES = [
  {
    name: "Boots",
    slug: "boots",
    href: "/winter/boots",
  },
  {
    name: "Coats",
    slug: "coats",
    href: "/winter/coats",
  },
  {
    name: "Jackets",
    slug: "jackets",
    href: "/winter/jackets",
  },
  {
    name: "Knitwear",
    slug: "knitwear",
    href: "/winter/knitwear",
  },
  {
    name: "Scarves",
    slug: "scarves",
    href: "/winter/scarves",
  },
  {
    name: "Sweaters",
    slug: "sweaters",
    href: "/winter/sweaters",
  },
] as const;

export function formatRouteLabel(value: string) {
  const specialLabels: Record<string, string> = {
    tshirts: "T-Shirts",
    "co-ords": "Co-ords",
    "kurta-pajama": "Kurta Pajama",
  };

  if (specialLabels[value]) {
    return specialLabels[value];
  }

  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}