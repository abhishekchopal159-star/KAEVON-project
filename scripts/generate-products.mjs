import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const projectRoot = path.resolve(currentDirectory, "..");

const productsDirectory = path.join(
  projectRoot,
  "public",
  "images",
  "shop",
  "products"
);

const dataDirectory = path.join(projectRoot, "data");
const outputFile = path.join(dataDirectory, "products.ts");

const supportedExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
]);

const categoryMap = {
  accessories: "ACCESSORIES",
  footwear: "FOOTWEAR",
  men: "MEN",
  streetwear: "STREETWEAR",
  winter: "WINTER",
  women: "WOMEN",
};

const categoryCodes = {
  accessories: "ACC",
  footwear: "FWT",
  men: "MEN",
  streetwear: "STR",
  winter: "WNT",
  women: "WMN",
};

const subcategoryCodes = {
  bags: "BAG",
  belts: "BLT",
  jewelry: "JWL",
  scarves: "SCF",
  sunglasses: "SUN",
  wallets: "WLT",

  boots: "BOT",
  heels: "HEL",
  loafers: "LOF",
  sandals: "SND",
  sneakers: "SNK",

  blazers: "BLZ",
  denim: "DNM",
  knitwear: "KNT",
  "kurta-pajama": "KRP",
  outerwear: "OTR",
  shirts: "SHT",
  trousers: "TRS",

  cargos: "CRG",
  "co-ords": "CRD",
  hoodies: "HOD",
  jackets: "JKT",
  tshirts: "TSH",

  coats: "COT",
  sweaters: "SWT",

  dresses: "DRS",
  sarees: "SAR",
  tops: "TOP",
};

const prices = {
  accessories: {
    bags: 2499,
    belts: 999,
    jewelry: 1499,
    scarves: 1199,
    sunglasses: 1399,
    wallets: 1299,
  },

  footwear: {
    boots: 3499,
    heels: 2799,
    loafers: 2999,
    sandals: 1999,
    sneakers: 3299,
  },

  men: {
    blazers: 4499,
    denim: 2499,
    knitwear: 2799,
    "kurta-pajama": 3499,
    outerwear: 4999,
    shirts: 1999,
    trousers: 2299,
  },

  streetwear: {
    cargos: 2299,
    "co-ords": 2999,
    hoodies: 2499,
    jackets: 3499,
    tshirts: 1499,
  },

  winter: {
    boots: 3999,
    coats: 5999,
    jackets: 4499,
    knitwear: 2999,
    scarves: 1499,
    sweaters: 2799,
  },

  women: {
    blazers: 4299,
    denim: 2499,
    dresses: 3999,
    knitwear: 2799,
    sarees: 4999,
    tops: 1799,
    trousers: 2299,
  },
};

const specialWords = {
  tshirt: "T-Shirt",
  tshirts: "T-Shirts",
  halfzip: "Half-Zip",
  coord: "Co-ord",
  bifold: "Bifold",
  crewneck: "Crewneck",
};

function getDirectories(directoryPath) {
  return fs
    .readdirSync(directoryPath, {
      withFileTypes: true,
    })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((first, second) =>
      first.localeCompare(second)
    );
}

function getImageFiles(directoryPath) {
  return fs
    .readdirSync(directoryPath, {
      withFileTypes: true,
    })
    .filter((entry) => {
      if (!entry.isFile()) {
        return false;
      }

      const extension = path
        .extname(entry.name)
        .toLowerCase();

      return supportedExtensions.has(extension);
    })
    .map((entry) => entry.name)
    .sort((first, second) =>
      first.localeCompare(second)
    );
}

function removeExtension(filename) {
  return path.parse(filename).name;
}

function createSlug(category, subcategory, filename) {
  const filenameSlug = removeExtension(filename)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${category}-${subcategory}-${filenameSlug}`;
}

function createTitle(category, filename) {
  let value = removeExtension(filename)
    .replace(/\s*\(\d+\)$/u, "")
    .replace(/-\d+$/u, "");

  const prefixes = [
    `${category}-`,
    "dress-",
    "saree-",
  ];

  let prefixFound = true;

  while (prefixFound) {
    prefixFound = false;

    for (const prefix of prefixes) {
      if (value.startsWith(prefix)) {
        value = value.slice(prefix.length);
        prefixFound = true;
        break;
      }
    }
  }

  return value
    .split("-")
    .filter(Boolean)
    .map((word) => {
      const normalizedWord = word.toLowerCase();

      if (specialWords[normalizedWord]) {
        return specialWords[normalizedWord];
      }

      return (
        normalizedWord.charAt(0).toUpperCase() +
        normalizedWord.slice(1)
      );
    })
    .join(" ");
}

function formatSubcategory(subcategory) {
  return subcategory
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function getProductPrice(category, subcategory) {
  return prices[category]?.[subcategory] ?? 1999;
}

function getSizes(category, subcategory) {
  if (
    category === "footwear" ||
    (category === "winter" &&
      subcategory === "boots")
  ) {
    return ["6", "7", "8", "9", "10", "11"];
  }

  if (subcategory === "sarees") {
    return ["One Size"];
  }

  if (
    category === "accessories" &&
    subcategory !== "belts"
  ) {
    return ["One Size"];
  }

  if (subcategory === "belts") {
    return ["S", "M", "L", "XL"];
  }

  if (
    subcategory === "denim" ||
    subcategory === "trousers" ||
    subcategory === "cargos"
  ) {
    return ["28", "30", "32", "34", "36", "38"];
  }

  return ["XS", "S", "M", "L", "XL", "XXL"];
}

function getMaterial(filename, subcategory) {
  const value = filename.toLowerCase();

  if (value.includes("leather")) {
    return "Premium leather";
  }

  if (value.includes("suede")) {
    return "Premium suede";
  }

  if (value.includes("silk")) {
    return "Premium silk blend";
  }

  if (value.includes("satin")) {
    return "Premium satin blend";
  }

  if (value.includes("velvet")) {
    return "Premium velvet";
  }

  if (value.includes("cashmere")) {
    return "Soft cashmere blend";
  }

  if (value.includes("wool")) {
    return "Premium wool blend";
  }

  if (value.includes("linen")) {
    return "Breathable linen blend";
  }

  if (
    value.includes("jeans") ||
    subcategory === "denim"
  ) {
    return "Premium cotton denim";
  }

  if (subcategory === "jewelry") {
    return "Premium fashion jewelry material";
  }

  return "Premium-quality fabric and materials";
}

function getCareInstructions(category) {
  if (
    category === "footwear" ||
    category === "winter"
  ) {
    return [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight",
    ];
  }

  if (category === "accessories") {
    return [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use",
    ];
  }

  return [
    "Gentle wash or dry clean as required",
    "Do not bleach",
    "Dry in shade",
    "Use low-temperature ironing",
  ];
}

function getBadge(id) {
  if (id <= 6) {
    return "BESTSELLER";
  }

  if (id <= 12) {
    return "NEW";
  }

  if (id % 17 === 0) {
    return "EXCLUSIVE";
  }

  if (id % 11 === 0) {
    return "TRENDING";
  }

  if (id % 13 === 0) {
    return "LIMITED";
  }

  return undefined;
}

function createProduct({
  id,
  category,
  subcategory,
  filename,
}) {
  const title = createTitle(category, filename);
  const price = getProductPrice(
    category,
    subcategory
  );

  const image =
    `/images/shop/products/${category}/` +
    `${subcategory}/${filename}`;

  const product = {
    id,

    slug: createSlug(
      category,
      subcategory,
      filename
    ),

    sku:
      `STY-${categoryCodes[category]}-` +
      `${subcategoryCodes[subcategory] ?? "PRD"}-` +
      String(id).padStart(3, "0"),

    name: title,
    title,

    category: categoryMap[category],
    subcategory,

    brand: "Styloverse",

    image,
    images: [image],

    price,
    oldPrice:
      Math.ceil((price * 1.25) / 100) * 100,

    rating: 4.6,
    reviewCount: 0,

    stock: 10 + ((id * 7) % 31),

    featured: id <= 12,
    isNew: id <= 18,

    shortDescription:
      `A premium ${title.toLowerCase()} ` +
      "designed for modern styling and comfort.",

    description:
      `The ${title} combines refined design, ` +
      "reliable comfort and premium finishing. " +
      "It is selected for the Styloverse collection.",

    sizes: getSizes(category, subcategory),

    colors: [
      {
        name: "As Shown",
        value: "#A3A3A3",
      },
    ],

    features: [
      `Premium ${formatSubcategory(
        subcategory
      ).toLowerCase()} construction`,
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling",
    ],

    specifications: [
      {
        label: "Category",
        value: categoryMap[category],
      },
      {
        label: "Subcategory",
        value: formatSubcategory(subcategory),
      },
      {
        label: "Brand",
        value: "Styloverse",
      },
      {
        label: "Country of Origin",
        value: "India",
      },
    ],

    material: getMaterial(
      filename,
      subcategory
    ),

    careInstructions:
      getCareInstructions(category),

    deliveryInformation:
      "Free standard delivery within 2-4 business days on eligible orders.",

    returnPolicy:
      "Easy return or exchange available within 7 days of delivery.",

    reviews: [],
  };

  const badge = getBadge(id);

  if (badge) {
    product.badge = badge;
  }

  return product;
}

function collectProducts() {
  const products = [];
  let id = 1;

  const categories =
    getDirectories(productsDirectory);

  for (const category of categories) {
    if (!categoryMap[category]) {
      continue;
    }

    const categoryDirectory = path.join(
      productsDirectory,
      category
    );

    const subcategories =
      getDirectories(categoryDirectory);

    for (const subcategory of subcategories) {
      const subcategoryDirectory = path.join(
        categoryDirectory,
        subcategory
      );

      const filenames =
        getImageFiles(subcategoryDirectory);

      for (const filename of filenames) {
        products.push(
          createProduct({
            id,
            category,
            subcategory,
            filename,
          })
        );

        id += 1;
      }
    }
  }

  return products;
}

function generateProductsFile() {
  if (!fs.existsSync(productsDirectory)) {
    console.error(
      "Products directory nahi mila:"
    );

    console.error(productsDirectory);
    process.exit(1);
  }

  const products = collectProducts();

  const typesCode = `export type ProductCategory =
  | "MEN"
  | "WOMEN"
  | "STREETWEAR"
  | "FOOTWEAR"
  | "ACCESSORIES"
  | "WINTER";

export type ProductBadge =
  | "NEW"
  | "BESTSELLER"
  | "LIMITED"
  | "TRENDING"
  | "EXCLUSIVE";

export type ProductColor = {
  name: string;
  value: string;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type ProductReview = {
  id: number;
  name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
};

export type Product = {
  id: number;
  slug: string;
  sku: string;

  name: string;
  title: string;

  category: ProductCategory;
  subcategory: string;

  brand: string;
  badge?: ProductBadge;

  image: string;
  images: string[];

  price: number;
  oldPrice?: number;

  rating: number;
  reviewCount: number;

  stock: number;
  featured: boolean;
  isNew: boolean;

  shortDescription: string;
  description: string;

  sizes: string[];
  colors: ProductColor[];

  features: string[];
  specifications: ProductSpecification[];

  material: string;
  careInstructions: string[];

  deliveryInformation: string;
  returnPolicy: string;

  reviews: ProductReview[];
};`;

  const helpersCode = `
export function getProductById(
  id: string | number
): Product | undefined {
  return products.find(
    (product) =>
      String(product.id) === String(id)
  );
}

export function getProductBySlug(
  slug: string
): Product | undefined {
  return products.find(
    (product) => product.slug === slug
  );
}

export function getFeaturedProducts(
  limit?: number
): Product[] {
  const result = products.filter(
    (product) => product.featured
  );

  return typeof limit === "number"
    ? result.slice(0, limit)
    : result;
}

export function getNewProducts(
  limit?: number
): Product[] {
  const result = products.filter(
    (product) => product.isNew
  );

  return typeof limit === "number"
    ? result.slice(0, limit)
    : result;
}

export function getProductsByCategory(
  category: ProductCategory
): Product[] {
  return products.filter(
    (product) => product.category === category
  );
}

export function getProductsBySubcategory(
  category: ProductCategory,
  subcategory: string
): Product[] {
  return products.filter(
    (product) =>
      product.category === category &&
      product.subcategory === subcategory
  );
}

export function getRelatedProducts(
  productId: string | number,
  limit = 4
): Product[] {
  const currentProduct =
    getProductById(productId);

  if (!currentProduct) {
    return products.slice(0, limit);
  }

  const sameSubcategory = products.filter(
    (product) =>
      product.id !== currentProduct.id &&
      product.category ===
        currentProduct.category &&
      product.subcategory ===
        currentProduct.subcategory
  );

  const sameCategory = products.filter(
    (product) =>
      product.id !== currentProduct.id &&
      product.category ===
        currentProduct.category &&
      product.subcategory !==
        currentProduct.subcategory
  );

  return [
    ...sameSubcategory,
    ...sameCategory,
  ].slice(0, limit);
}

export function searchProducts(
  searchTerm: string
): Product[] {
  const query =
    searchTerm.trim().toLowerCase();

  if (!query) {
    return products;
  }

  return products.filter((product) => {
    const searchableText = [
      product.name,
      product.title,
      product.category,
      product.subcategory,
      product.brand,
      product.description,
      product.sku,
      ...product.features,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });
}

export function formatProductPrice(
  price: number
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscountPercentage(
  price: number,
  oldPrice?: number
): number {
  if (!oldPrice || oldPrice <= price) {
    return 0;
  }

  return Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );
}
`;

  const outputCode = [
    typesCode,
    "",
    `export const products: Product[] = ${JSON.stringify(
      products,
      null,
      2
    )};`,
    helpersCode,
  ].join("\n");

  fs.mkdirSync(dataDirectory, {
    recursive: true,
  });

  fs.writeFileSync(
    outputFile,
    outputCode,
    "utf8"
  );

  console.log("");
  console.log(
    `✅ ${products.length} products generated`
  );
  console.log(`✅ File created: ${outputFile}`);
  console.log("");
}

generateProductsFile();