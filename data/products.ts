import type {
  ProductInventorySummary,
  ProductVariant,
} from "@/types/inventory";

export type ProductCategory =
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
  videoUrl?: string;
  modelInformation?: {
    name?: string;
    height: string;
    wornSize: string;
    measurements?: string;
  };

  price: number;
  oldPrice?: number;

  rating: number;
  reviewCount: number;

  stock: number;
  variants?: ProductVariant[];
  inventory?: ProductInventorySummary;
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
};

export const products: Product[] = [
  {
    "id": 1,
    "slug": "accessories-bags-accessories-black-leather-tote-bag-01",
    "sku": "STY-ACC-BAG-001",
    "name": "Black Leather Tote Bag",
    "title": "Black Leather Tote Bag",
    "category": "ACCESSORIES",
    "subcategory": "bags",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/bags/accessories-black-leather-tote-bag-01.png",
    "images": [
      "/images/shop/products/accessories/bags/accessories-black-leather-tote-bag-01.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 17,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium black leather tote bag designed for modern styling and comfort.",
    "description": "The Black Leather Tote Bag combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium bags construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Bags"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium leather",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "BESTSELLER"
  },
  {
    "id": 2,
    "slug": "accessories-bags-accessories-burgundy-crossbody-bag-04",
    "sku": "STY-ACC-BAG-002",
    "name": "Burgundy Crossbody Bag",
    "title": "Burgundy Crossbody Bag",
    "category": "ACCESSORIES",
    "subcategory": "bags",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/bags/accessories-burgundy-crossbody-bag-04.png",
    "images": [
      "/images/shop/products/accessories/bags/accessories-burgundy-crossbody-bag-04.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 24,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium burgundy crossbody bag designed for modern styling and comfort.",
    "description": "The Burgundy Crossbody Bag combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium bags construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Bags"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "BESTSELLER"
  },
  {
    "id": 3,
    "slug": "accessories-bags-accessories-ivory-mini-shoulder-bag-03",
    "sku": "STY-ACC-BAG-003",
    "name": "Ivory Mini Shoulder Bag",
    "title": "Ivory Mini Shoulder Bag",
    "category": "ACCESSORIES",
    "subcategory": "bags",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/bags/accessories-ivory-mini-shoulder-bag-03.png",
    "images": [
      "/images/shop/products/accessories/bags/accessories-ivory-mini-shoulder-bag-03.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 31,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium ivory mini shoulder bag designed for modern styling and comfort.",
    "description": "The Ivory Mini Shoulder Bag combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium bags construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Bags"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "BESTSELLER"
  },
  {
    "id": 4,
    "slug": "accessories-bags-accessories-tan-structured-handbag-02",
    "sku": "STY-ACC-BAG-004",
    "name": "Tan Structured Handbag",
    "title": "Tan Structured Handbag",
    "category": "ACCESSORIES",
    "subcategory": "bags",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/bags/accessories-tan-structured-handbag-02.png",
    "images": [
      "/images/shop/products/accessories/bags/accessories-tan-structured-handbag-02.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 38,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium tan structured handbag designed for modern styling and comfort.",
    "description": "The Tan Structured Handbag combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium bags construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Bags"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "BESTSELLER"
  },
  {
    "id": 5,
    "slug": "accessories-belts-accessories-black-leather-belt-01",
    "sku": "STY-ACC-BLT-005",
    "name": "Black Leather Belt",
    "title": "Black Leather Belt",
    "category": "ACCESSORIES",
    "subcategory": "belts",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/belts/accessories-black-leather-belt-01.png",
    "images": [
      "/images/shop/products/accessories/belts/accessories-black-leather-belt-01.png"
    ],
    "price": 999,
    "oldPrice": 1300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 14,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium black leather belt designed for modern styling and comfort.",
    "description": "The Black Leather Belt combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium belts construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Belts"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium leather",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "BESTSELLER"
  },
  {
    "id": 6,
    "slug": "accessories-belts-accessories-tan-leather-belt-02",
    "sku": "STY-ACC-BLT-006",
    "name": "Tan Leather Belt",
    "title": "Tan Leather Belt",
    "category": "ACCESSORIES",
    "subcategory": "belts",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/belts/accessories-tan-leather-belt-02.png",
    "images": [
      "/images/shop/products/accessories/belts/accessories-tan-leather-belt-02.png"
    ],
    "price": 999,
    "oldPrice": 1300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 21,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium tan leather belt designed for modern styling and comfort.",
    "description": "The Tan Leather Belt combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium belts construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Belts"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium leather",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "BESTSELLER"
  },
  {
    "id": 7,
    "slug": "accessories-jewelry-accessories-gold-hoop-earrings-01",
    "sku": "STY-ACC-JWL-007",
    "name": "Gold Hoop Earrings",
    "title": "Gold Hoop Earrings",
    "category": "ACCESSORIES",
    "subcategory": "jewelry",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/jewelry/accessories-gold-hoop-earrings-01.png",
    "images": [
      "/images/shop/products/accessories/jewelry/accessories-gold-hoop-earrings-01.png"
    ],
    "price": 1499,
    "oldPrice": 1900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 28,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium gold hoop earrings designed for modern styling and comfort.",
    "description": "The Gold Hoop Earrings combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium jewelry construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Jewelry"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium fashion jewelry material",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "NEW"
  },
  {
    "id": 8,
    "slug": "accessories-jewelry-accessories-gold-minimal-necklace-02",
    "sku": "STY-ACC-JWL-008",
    "name": "Gold Minimal Necklace",
    "title": "Gold Minimal Necklace",
    "category": "ACCESSORIES",
    "subcategory": "jewelry",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/jewelry/accessories-gold-minimal-necklace-02.png",
    "images": [
      "/images/shop/products/accessories/jewelry/accessories-gold-minimal-necklace-02.png"
    ],
    "price": 1499,
    "oldPrice": 1900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 35,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium gold minimal necklace designed for modern styling and comfort.",
    "description": "The Gold Minimal Necklace combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium jewelry construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Jewelry"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium fashion jewelry material",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "NEW"
  },
  {
    "id": 9,
    "slug": "accessories-jewelry-accessories-pearl-drop-earrings-03",
    "sku": "STY-ACC-JWL-009",
    "name": "Pearl Drop Earrings",
    "title": "Pearl Drop Earrings",
    "category": "ACCESSORIES",
    "subcategory": "jewelry",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/jewelry/accessories-pearl-drop-earrings-03.png",
    "images": [
      "/images/shop/products/accessories/jewelry/accessories-pearl-drop-earrings-03.png"
    ],
    "price": 1499,
    "oldPrice": 1900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 11,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium pearl drop earrings designed for modern styling and comfort.",
    "description": "The Pearl Drop Earrings combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium jewelry construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Jewelry"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium fashion jewelry material",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "NEW"
  },
  {
    "id": 10,
    "slug": "accessories-scarves-accessories-burgundy-printed-scarf-02",
    "sku": "STY-ACC-SCF-010",
    "name": "Burgundy Printed Scarf",
    "title": "Burgundy Printed Scarf",
    "category": "ACCESSORIES",
    "subcategory": "scarves",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/scarves/accessories-burgundy-printed-scarf-02.png",
    "images": [
      "/images/shop/products/accessories/scarves/accessories-burgundy-printed-scarf-02.png"
    ],
    "price": 1199,
    "oldPrice": 1500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 18,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium burgundy printed scarf designed for modern styling and comfort.",
    "description": "The Burgundy Printed Scarf combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium scarves construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Scarves"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "NEW"
  },
  {
    "id": 11,
    "slug": "accessories-scarves-accessories-ivory-silk-scarf-01",
    "sku": "STY-ACC-SCF-011",
    "name": "Ivory Silk Scarf",
    "title": "Ivory Silk Scarf",
    "category": "ACCESSORIES",
    "subcategory": "scarves",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/scarves/accessories-ivory-silk-scarf-01.png",
    "images": [
      "/images/shop/products/accessories/scarves/accessories-ivory-silk-scarf-01.png"
    ],
    "price": 1199,
    "oldPrice": 1500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 25,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium ivory silk scarf designed for modern styling and comfort.",
    "description": "The Ivory Silk Scarf combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium scarves construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Scarves"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium silk blend",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "NEW"
  },
  {
    "id": 12,
    "slug": "accessories-sunglasses-accessories-black-square-sunglasses-01",
    "sku": "STY-ACC-SUN-012",
    "name": "Black Square Sunglasses",
    "title": "Black Square Sunglasses",
    "category": "ACCESSORIES",
    "subcategory": "sunglasses",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/sunglasses/accessories-black-square-sunglasses-01.png",
    "images": [
      "/images/shop/products/accessories/sunglasses/accessories-black-square-sunglasses-01.png"
    ],
    "price": 1399,
    "oldPrice": 1800,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 32,
    "featured": true,
    "isNew": true,
    "shortDescription": "A premium black square sunglasses designed for modern styling and comfort.",
    "description": "The Black Square Sunglasses combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sunglasses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Sunglasses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "NEW"
  },
  {
    "id": 13,
    "slug": "accessories-sunglasses-accessories-tortoiseshell-cat-eye-sunglasses-02",
    "sku": "STY-ACC-SUN-013",
    "name": "Tortoiseshell Cat Eye Sunglasses",
    "title": "Tortoiseshell Cat Eye Sunglasses",
    "category": "ACCESSORIES",
    "subcategory": "sunglasses",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/sunglasses/accessories-tortoiseshell-cat-eye-sunglasses-02.png",
    "images": [
      "/images/shop/products/accessories/sunglasses/accessories-tortoiseshell-cat-eye-sunglasses-02.png"
    ],
    "price": 1399,
    "oldPrice": 1800,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 39,
    "featured": false,
    "isNew": true,
    "shortDescription": "A premium tortoiseshell cat eye sunglasses designed for modern styling and comfort.",
    "description": "The Tortoiseshell Cat Eye Sunglasses combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sunglasses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Sunglasses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "LIMITED"
  },
  {
    "id": 14,
    "slug": "accessories-wallets-accessories-black-leather-wallet-01",
    "sku": "STY-ACC-WLT-014",
    "name": "Black Leather Wallet",
    "title": "Black Leather Wallet",
    "category": "ACCESSORIES",
    "subcategory": "wallets",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/wallets/accessories-black-leather-wallet-01.png",
    "images": [
      "/images/shop/products/accessories/wallets/accessories-black-leather-wallet-01.png"
    ],
    "price": 1299,
    "oldPrice": 1700,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 15,
    "featured": false,
    "isNew": true,
    "shortDescription": "A premium black leather wallet designed for modern styling and comfort.",
    "description": "The Black Leather Wallet combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium wallets construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Wallets"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium leather",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 15,
    "slug": "accessories-wallets-accessories-tan-bifold-wallet-02",
    "sku": "STY-ACC-WLT-015",
    "name": "Tan Bifold Wallet",
    "title": "Tan Bifold Wallet",
    "category": "ACCESSORIES",
    "subcategory": "wallets",
    "brand": "Styloverse",
    "image": "/images/shop/products/accessories/wallets/accessories-tan-bifold-wallet-02.png",
    "images": [
      "/images/shop/products/accessories/wallets/accessories-tan-bifold-wallet-02.png"
    ],
    "price": 1299,
    "oldPrice": 1700,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 22,
    "featured": false,
    "isNew": true,
    "shortDescription": "A premium tan bifold wallet designed for modern styling and comfort.",
    "description": "The Tan Bifold Wallet combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium wallets construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "ACCESSORIES"
      },
      {
        "label": "Subcategory",
        "value": "Wallets"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently with a soft dry cloth",
      "Keep away from moisture",
      "Store separately when not in use"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 16,
    "slug": "footwear-boots-footwear-black-leather-ankle-boots-01",
    "sku": "STY-FWT-BOT-016",
    "name": "Black Leather Ankle Boots",
    "title": "Black Leather Ankle Boots",
    "category": "FOOTWEAR",
    "subcategory": "boots",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/boots/footwear-black-leather-ankle-boots-01.png",
    "images": [
      "/images/shop/products/footwear/boots/footwear-black-leather-ankle-boots-01.png"
    ],
    "price": 3499,
    "oldPrice": 4400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 29,
    "featured": false,
    "isNew": true,
    "shortDescription": "A premium black leather ankle boots designed for modern styling and comfort.",
    "description": "The Black Leather Ankle Boots combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium boots construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Boots"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium leather",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 17,
    "slug": "footwear-boots-footwear-brown-suede-chelsea-boots-02",
    "sku": "STY-FWT-BOT-017",
    "name": "Brown Suede Chelsea Boots",
    "title": "Brown Suede Chelsea Boots",
    "category": "FOOTWEAR",
    "subcategory": "boots",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/boots/footwear-brown-suede-chelsea-boots-02.png",
    "images": [
      "/images/shop/products/footwear/boots/footwear-brown-suede-chelsea-boots-02.png"
    ],
    "price": 3499,
    "oldPrice": 4400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 36,
    "featured": false,
    "isNew": true,
    "shortDescription": "A premium brown suede chelsea boots designed for modern styling and comfort.",
    "description": "The Brown Suede Chelsea Boots combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium boots construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Boots"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium suede",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "EXCLUSIVE"
  },
  {
    "id": 18,
    "slug": "footwear-heels-footwear-black-pointed-toe-heels-01",
    "sku": "STY-FWT-HEL-018",
    "name": "Black Pointed Toe Heels",
    "title": "Black Pointed Toe Heels",
    "category": "FOOTWEAR",
    "subcategory": "heels",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/heels/footwear-black-pointed-toe-heels-01.png",
    "images": [
      "/images/shop/products/footwear/heels/footwear-black-pointed-toe-heels-01.png"
    ],
    "price": 2799,
    "oldPrice": 3500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 12,
    "featured": false,
    "isNew": true,
    "shortDescription": "A premium black pointed toe heels designed for modern styling and comfort.",
    "description": "The Black Pointed Toe Heels combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium heels construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Heels"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 19,
    "slug": "footwear-heels-footwear-nude-strappy-heels-02",
    "sku": "STY-FWT-HEL-019",
    "name": "Nude Strappy Heels",
    "title": "Nude Strappy Heels",
    "category": "FOOTWEAR",
    "subcategory": "heels",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/heels/footwear-nude-strappy-heels-02.png",
    "images": [
      "/images/shop/products/footwear/heels/footwear-nude-strappy-heels-02.png"
    ],
    "price": 2799,
    "oldPrice": 3500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 19,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium nude strappy heels designed for modern styling and comfort.",
    "description": "The Nude Strappy Heels combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium heels construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Heels"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 20,
    "slug": "footwear-loafers-footwear-black-leather-loafers-01",
    "sku": "STY-FWT-LOF-020",
    "name": "Black Leather Loafers",
    "title": "Black Leather Loafers",
    "category": "FOOTWEAR",
    "subcategory": "loafers",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/loafers/footwear-black-leather-loafers-01.png",
    "images": [
      "/images/shop/products/footwear/loafers/footwear-black-leather-loafers-01.png"
    ],
    "price": 2999,
    "oldPrice": 3800,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 26,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black leather loafers designed for modern styling and comfort.",
    "description": "The Black Leather Loafers combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium loafers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Loafers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium leather",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 21,
    "slug": "footwear-loafers-footwear-brown-suede-loafers-02",
    "sku": "STY-FWT-LOF-021",
    "name": "Brown Suede Loafers",
    "title": "Brown Suede Loafers",
    "category": "FOOTWEAR",
    "subcategory": "loafers",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/loafers/footwear-brown-suede-loafers-02.png",
    "images": [
      "/images/shop/products/footwear/loafers/footwear-brown-suede-loafers-02.png"
    ],
    "price": 2999,
    "oldPrice": 3800,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 33,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium brown suede loafers designed for modern styling and comfort.",
    "description": "The Brown Suede Loafers combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium loafers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Loafers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium suede",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 22,
    "slug": "footwear-sandals-footwear-black-minimal-slide-sandals-02",
    "sku": "STY-FWT-SND-022",
    "name": "Black Minimal Slide Sandals",
    "title": "Black Minimal Slide Sandals",
    "category": "FOOTWEAR",
    "subcategory": "sandals",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/sandals/footwear-black-minimal-slide-sandals-02.png",
    "images": [
      "/images/shop/products/footwear/sandals/footwear-black-minimal-slide-sandals-02.png"
    ],
    "price": 1999,
    "oldPrice": 2500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 40,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black minimal slide sandals designed for modern styling and comfort.",
    "description": "The Black Minimal Slide Sandals combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sandals construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Sandals"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "TRENDING"
  },
  {
    "id": 23,
    "slug": "footwear-sandals-footwear-tan-leather-sandals-01",
    "sku": "STY-FWT-SND-023",
    "name": "Tan Leather Sandals",
    "title": "Tan Leather Sandals",
    "category": "FOOTWEAR",
    "subcategory": "sandals",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/sandals/footwear-tan-leather-sandals-01.png",
    "images": [
      "/images/shop/products/footwear/sandals/footwear-tan-leather-sandals-01.png"
    ],
    "price": 1999,
    "oldPrice": 2500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 16,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium tan leather sandals designed for modern styling and comfort.",
    "description": "The Tan Leather Sandals combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sandals construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Sandals"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium leather",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 24,
    "slug": "footwear-sneakers-footwear-beige-suede-sneakers-03",
    "sku": "STY-FWT-SNK-024",
    "name": "Beige Suede Sneakers",
    "title": "Beige Suede Sneakers",
    "category": "FOOTWEAR",
    "subcategory": "sneakers",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/sneakers/footwear-beige-suede-sneakers-03.png",
    "images": [
      "/images/shop/products/footwear/sneakers/footwear-beige-suede-sneakers-03.png"
    ],
    "price": 3299,
    "oldPrice": 4200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 23,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium beige suede sneakers designed for modern styling and comfort.",
    "description": "The Beige Suede Sneakers combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sneakers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Sneakers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium suede",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 25,
    "slug": "footwear-sneakers-footwear-black-luxury-sneakers-02",
    "sku": "STY-FWT-SNK-025",
    "name": "Black Luxury Sneakers",
    "title": "Black Luxury Sneakers",
    "category": "FOOTWEAR",
    "subcategory": "sneakers",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/sneakers/footwear-black-luxury-sneakers-02.png",
    "images": [
      "/images/shop/products/footwear/sneakers/footwear-black-luxury-sneakers-02.png"
    ],
    "price": 3299,
    "oldPrice": 4200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 30,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black luxury sneakers designed for modern styling and comfort.",
    "description": "The Black Luxury Sneakers combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sneakers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Sneakers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 26,
    "slug": "footwear-sneakers-footwear-grey-chunky-sneakers-04",
    "sku": "STY-FWT-SNK-026",
    "name": "Grey Chunky Sneakers",
    "title": "Grey Chunky Sneakers",
    "category": "FOOTWEAR",
    "subcategory": "sneakers",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/sneakers/footwear-grey-chunky-sneakers-04.png",
    "images": [
      "/images/shop/products/footwear/sneakers/footwear-grey-chunky-sneakers-04.png"
    ],
    "price": 3299,
    "oldPrice": 4200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 37,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium grey chunky sneakers designed for modern styling and comfort.",
    "description": "The Grey Chunky Sneakers combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sneakers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Sneakers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "LIMITED"
  },
  {
    "id": 27,
    "slug": "footwear-sneakers-footwear-white-leather-sneakers-01",
    "sku": "STY-FWT-SNK-027",
    "name": "White Leather Sneakers",
    "title": "White Leather Sneakers",
    "category": "FOOTWEAR",
    "subcategory": "sneakers",
    "brand": "Styloverse",
    "image": "/images/shop/products/footwear/sneakers/footwear-white-leather-sneakers-01.png",
    "images": [
      "/images/shop/products/footwear/sneakers/footwear-white-leather-sneakers-01.png"
    ],
    "price": 3299,
    "oldPrice": 4200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 13,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium white leather sneakers designed for modern styling and comfort.",
    "description": "The White Leather Sneakers combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sneakers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "FOOTWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Sneakers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium leather",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 28,
    "slug": "men-blazers-men-black-tailored-blazer-01",
    "sku": "STY-MEN-BLZ-028",
    "name": "Black Tailored Blazer",
    "title": "Black Tailored Blazer",
    "category": "MEN",
    "subcategory": "blazers",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/blazers/men-black-tailored-blazer-01.png",
    "images": [
      "/images/shop/products/men/blazers/men-black-tailored-blazer-01.png"
    ],
    "price": 4499,
    "oldPrice": 5700,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 20,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black tailored blazer designed for modern styling and comfort.",
    "description": "The Black Tailored Blazer combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium blazers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Blazers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 29,
    "slug": "men-blazers-men-grey-check-blazer-03",
    "sku": "STY-MEN-BLZ-029",
    "name": "Grey Check Blazer",
    "title": "Grey Check Blazer",
    "category": "MEN",
    "subcategory": "blazers",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/blazers/men-grey-check-blazer-03.png",
    "images": [
      "/images/shop/products/men/blazers/men-grey-check-blazer-03.png"
    ],
    "price": 4499,
    "oldPrice": 5700,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 27,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium grey check blazer designed for modern styling and comfort.",
    "description": "The Grey Check Blazer combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium blazers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Blazers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 30,
    "slug": "men-blazers-men-navy-blue-blazer-02",
    "sku": "STY-MEN-BLZ-030",
    "name": "Navy Blue Blazer",
    "title": "Navy Blue Blazer",
    "category": "MEN",
    "subcategory": "blazers",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/blazers/men-navy-blue-blazer-02.png",
    "images": [
      "/images/shop/products/men/blazers/men-navy-blue-blazer-02.png"
    ],
    "price": 4499,
    "oldPrice": 5700,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 34,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium navy blue blazer designed for modern styling and comfort.",
    "description": "The Navy Blue Blazer combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium blazers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Blazers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 31,
    "slug": "men-denim-men-dark-indigo-slim-jeans-01",
    "sku": "STY-MEN-DNM-031",
    "name": "Dark Indigo Slim Jeans",
    "title": "Dark Indigo Slim Jeans",
    "category": "MEN",
    "subcategory": "denim",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/denim/men-dark-indigo-slim-jeans-01.png",
    "images": [
      "/images/shop/products/men/denim/men-dark-indigo-slim-jeans-01.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 10,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium dark indigo slim jeans designed for modern styling and comfort.",
    "description": "The Dark Indigo Slim Jeans combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium denim construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Denim"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium cotton denim",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 32,
    "slug": "men-denim-men-washed-blue-straight-jeans-02",
    "sku": "STY-MEN-DNM-032",
    "name": "Washed Blue Straight Jeans",
    "title": "Washed Blue Straight Jeans",
    "category": "MEN",
    "subcategory": "denim",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/denim/men-washed-blue-straight-jeans-02.png",
    "images": [
      "/images/shop/products/men/denim/men-washed-blue-straight-jeans-02.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 17,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium washed blue straight jeans designed for modern styling and comfort.",
    "description": "The Washed Blue Straight Jeans combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium denim construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Denim"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium cotton denim",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 33,
    "slug": "men-knitwear-men-camel-merino-crewneck-01",
    "sku": "STY-MEN-KNT-033",
    "name": "Camel Merino Crewneck",
    "title": "Camel Merino Crewneck",
    "category": "MEN",
    "subcategory": "knitwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/knitwear/men-camel-merino-crewneck-01.png",
    "images": [
      "/images/shop/products/men/knitwear/men-camel-merino-crewneck-01.png"
    ],
    "price": 2799,
    "oldPrice": 3500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 24,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium camel merino crewneck designed for modern styling and comfort.",
    "description": "The Camel Merino Crewneck combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium knitwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Knitwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "TRENDING"
  },
  {
    "id": 34,
    "slug": "men-knitwear-men-charcoal-turtleneck-sweater-02",
    "sku": "STY-MEN-KNT-034",
    "name": "Charcoal Turtleneck Sweater",
    "title": "Charcoal Turtleneck Sweater",
    "category": "MEN",
    "subcategory": "knitwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/knitwear/men-charcoal-turtleneck-sweater-02.png",
    "images": [
      "/images/shop/products/men/knitwear/men-charcoal-turtleneck-sweater-02.png"
    ],
    "price": 2799,
    "oldPrice": 3500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 31,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium charcoal turtleneck sweater designed for modern styling and comfort.",
    "description": "The Charcoal Turtleneck Sweater combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium knitwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Knitwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "EXCLUSIVE"
  },
  {
    "id": 35,
    "slug": "men-kurta-pajama-men-black-embroidered-kurta-pajama-02",
    "sku": "STY-MEN-KRP-035",
    "name": "Black Embroidered Kurta Pajama",
    "title": "Black Embroidered Kurta Pajama",
    "category": "MEN",
    "subcategory": "kurta-pajama",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/kurta-pajama/men-black-embroidered-kurta-pajama-02.png",
    "images": [
      "/images/shop/products/men/kurta-pajama/men-black-embroidered-kurta-pajama-02.png"
    ],
    "price": 3499,
    "oldPrice": 4400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 38,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black embroidered kurta pajama designed for modern styling and comfort.",
    "description": "The Black Embroidered Kurta Pajama combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium kurta pajama construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Kurta Pajama"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 36,
    "slug": "men-kurta-pajama-men-ivory-linen-kurta-pajama-01",
    "sku": "STY-MEN-KRP-036",
    "name": "Ivory Linen Kurta Pajama",
    "title": "Ivory Linen Kurta Pajama",
    "category": "MEN",
    "subcategory": "kurta-pajama",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/kurta-pajama/men-ivory-linen-kurta-pajama-01.png",
    "images": [
      "/images/shop/products/men/kurta-pajama/men-ivory-linen-kurta-pajama-01.png"
    ],
    "price": 3499,
    "oldPrice": 4400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 14,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium ivory linen kurta pajama designed for modern styling and comfort.",
    "description": "The Ivory Linen Kurta Pajama combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium kurta pajama construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Kurta Pajama"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Breathable linen blend",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 37,
    "slug": "men-kurta-pajama-men-navy-festive-kurta-pajama-03",
    "sku": "STY-MEN-KRP-037",
    "name": "Navy Festive Kurta Pajama",
    "title": "Navy Festive Kurta Pajama",
    "category": "MEN",
    "subcategory": "kurta-pajama",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/kurta-pajama/men-navy-festive-kurta-pajama-03.png",
    "images": [
      "/images/shop/products/men/kurta-pajama/men-navy-festive-kurta-pajama-03.png"
    ],
    "price": 3499,
    "oldPrice": 4400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 21,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium navy festive kurta pajama designed for modern styling and comfort.",
    "description": "The Navy Festive Kurta Pajama combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium kurta pajama construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Kurta Pajama"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 38,
    "slug": "men-kurta-pajama-men-sage-green-kurta-pajama-04",
    "sku": "STY-MEN-KRP-038",
    "name": "Sage Green Kurta Pajama",
    "title": "Sage Green Kurta Pajama",
    "category": "MEN",
    "subcategory": "kurta-pajama",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/kurta-pajama/men-sage-green-kurta-pajama-04.png",
    "images": [
      "/images/shop/products/men/kurta-pajama/men-sage-green-kurta-pajama-04.png"
    ],
    "price": 3499,
    "oldPrice": 4400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 28,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium sage green kurta pajama designed for modern styling and comfort.",
    "description": "The Sage Green Kurta Pajama combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium kurta pajama construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Kurta Pajama"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 39,
    "slug": "men-outerwear-men-beige-trench-coat-02",
    "sku": "STY-MEN-OTR-039",
    "name": "Beige Trench Coat",
    "title": "Beige Trench Coat",
    "category": "MEN",
    "subcategory": "outerwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/outerwear/men-beige-trench-coat-02.png",
    "images": [
      "/images/shop/products/men/outerwear/men-beige-trench-coat-02.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 35,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium beige trench coat designed for modern styling and comfort.",
    "description": "The Beige Trench Coat combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium outerwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Outerwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "LIMITED"
  },
  {
    "id": 40,
    "slug": "men-outerwear-men-black-quilted-bomber-03",
    "sku": "STY-MEN-OTR-040",
    "name": "Black Quilted Bomber",
    "title": "Black Quilted Bomber",
    "category": "MEN",
    "subcategory": "outerwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/outerwear/men-black-quilted-bomber-03.png",
    "images": [
      "/images/shop/products/men/outerwear/men-black-quilted-bomber-03.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 11,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black quilted bomber designed for modern styling and comfort.",
    "description": "The Black Quilted Bomber combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium outerwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Outerwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 41,
    "slug": "men-outerwear-men-camel-wool-overcoat-01",
    "sku": "STY-MEN-OTR-041",
    "name": "Camel Wool Overcoat",
    "title": "Camel Wool Overcoat",
    "category": "MEN",
    "subcategory": "outerwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/outerwear/men-camel-wool-overcoat-01.png",
    "images": [
      "/images/shop/products/men/outerwear/men-camel-wool-overcoat-01.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 18,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium camel wool overcoat designed for modern styling and comfort.",
    "description": "The Camel Wool Overcoat combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium outerwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Outerwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium wool blend",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 42,
    "slug": "men-outerwear-men-olive-puffer-jacket-04",
    "sku": "STY-MEN-OTR-042",
    "name": "Olive Puffer Jacket",
    "title": "Olive Puffer Jacket",
    "category": "MEN",
    "subcategory": "outerwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/outerwear/men-olive-puffer-jacket-04.png",
    "images": [
      "/images/shop/products/men/outerwear/men-olive-puffer-jacket-04.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 25,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium olive puffer jacket designed for modern styling and comfort.",
    "description": "The Olive Puffer Jacket combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium outerwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Outerwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 43,
    "slug": "men-shirts-men-black-formal-shirt-02",
    "sku": "STY-MEN-SHT-043",
    "name": "Black Formal Shirt",
    "title": "Black Formal Shirt",
    "category": "MEN",
    "subcategory": "shirts",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/shirts/men-black-formal-shirt-02.png",
    "images": [
      "/images/shop/products/men/shirts/men-black-formal-shirt-02.png"
    ],
    "price": 1999,
    "oldPrice": 2500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 32,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black formal shirt designed for modern styling and comfort.",
    "description": "The Black Formal Shirt combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium shirts construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Shirts"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 44,
    "slug": "men-shirts-men-blue-striped-shirt-03",
    "sku": "STY-MEN-SHT-044",
    "name": "Blue Striped Shirt",
    "title": "Blue Striped Shirt",
    "category": "MEN",
    "subcategory": "shirts",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/shirts/men-blue-striped-shirt-03.png",
    "images": [
      "/images/shop/products/men/shirts/men-blue-striped-shirt-03.png"
    ],
    "price": 1999,
    "oldPrice": 2500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 39,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium blue striped shirt designed for modern styling and comfort.",
    "description": "The Blue Striped Shirt combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium shirts construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Shirts"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "TRENDING"
  },
  {
    "id": 45,
    "slug": "men-shirts-men-white-oxford-shirt-01",
    "sku": "STY-MEN-SHT-045",
    "name": "White Oxford Shirt",
    "title": "White Oxford Shirt",
    "category": "MEN",
    "subcategory": "shirts",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/shirts/men-white-oxford-shirt-01.png",
    "images": [
      "/images/shop/products/men/shirts/men-white-oxford-shirt-01.png"
    ],
    "price": 1999,
    "oldPrice": 2500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 15,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium white oxford shirt designed for modern styling and comfort.",
    "description": "The White Oxford Shirt combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium shirts construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Shirts"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 46,
    "slug": "men-trousers-men-beige-pleated-trousers-02",
    "sku": "STY-MEN-TRS-046",
    "name": "Beige Pleated Trousers",
    "title": "Beige Pleated Trousers",
    "category": "MEN",
    "subcategory": "trousers",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/trousers/men-beige-pleated-trousers-02.png",
    "images": [
      "/images/shop/products/men/trousers/men-beige-pleated-trousers-02.png"
    ],
    "price": 2299,
    "oldPrice": 2900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 22,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium beige pleated trousers designed for modern styling and comfort.",
    "description": "The Beige Pleated Trousers combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium trousers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Trousers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 47,
    "slug": "men-trousers-men-black-tailored-trousers-01",
    "sku": "STY-MEN-TRS-047",
    "name": "Black Tailored Trousers",
    "title": "Black Tailored Trousers",
    "category": "MEN",
    "subcategory": "trousers",
    "brand": "Styloverse",
    "image": "/images/shop/products/men/trousers/men-black-tailored-trousers-01.png",
    "images": [
      "/images/shop/products/men/trousers/men-black-tailored-trousers-01.png"
    ],
    "price": 2299,
    "oldPrice": 2900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 29,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black tailored trousers designed for modern styling and comfort.",
    "description": "The Black Tailored Trousers combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium trousers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "MEN"
      },
      {
        "label": "Subcategory",
        "value": "Trousers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 48,
    "slug": "streetwear-cargos-streetwear-black-relaxed-cargo-pants-01",
    "sku": "STY-STR-CRG-048",
    "name": "Black Relaxed Cargo Pants",
    "title": "Black Relaxed Cargo Pants",
    "category": "STREETWEAR",
    "subcategory": "cargos",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/cargos/streetwear-black-relaxed-cargo-pants-01.png",
    "images": [
      "/images/shop/products/streetwear/cargos/streetwear-black-relaxed-cargo-pants-01.png"
    ],
    "price": 2299,
    "oldPrice": 2900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 36,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black relaxed cargo pants designed for modern styling and comfort.",
    "description": "The Black Relaxed Cargo Pants combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium cargos construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Cargos"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 49,
    "slug": "streetwear-cargos-streetwear-olive-utility-cargo-pants-02",
    "sku": "STY-STR-CRG-049",
    "name": "Olive Utility Cargo Pants",
    "title": "Olive Utility Cargo Pants",
    "category": "STREETWEAR",
    "subcategory": "cargos",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/cargos/streetwear-olive-utility-cargo-pants-02.png",
    "images": [
      "/images/shop/products/streetwear/cargos/streetwear-olive-utility-cargo-pants-02.png"
    ],
    "price": 2299,
    "oldPrice": 2900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 12,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium olive utility cargo pants designed for modern styling and comfort.",
    "description": "The Olive Utility Cargo Pants combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium cargos construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Cargos"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 50,
    "slug": "streetwear-co-ords-streetwear-beige-minimal-coord-set-02",
    "sku": "STY-STR-CRD-050",
    "name": "Beige Minimal Co-ord Set",
    "title": "Beige Minimal Co-ord Set",
    "category": "STREETWEAR",
    "subcategory": "co-ords",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/co-ords/streetwear-beige-minimal-coord-set-02.png",
    "images": [
      "/images/shop/products/streetwear/co-ords/streetwear-beige-minimal-coord-set-02.png"
    ],
    "price": 2999,
    "oldPrice": 3800,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 19,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium beige minimal co-ord set designed for modern styling and comfort.",
    "description": "The Beige Minimal Co-ord Set combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium co ords construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Co Ords"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 51,
    "slug": "streetwear-co-ords-streetwear-black-relaxed-coord-set-01",
    "sku": "STY-STR-CRD-051",
    "name": "Black Relaxed Co-ord Set",
    "title": "Black Relaxed Co-ord Set",
    "category": "STREETWEAR",
    "subcategory": "co-ords",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/co-ords/streetwear-black-relaxed-coord-set-01.png",
    "images": [
      "/images/shop/products/streetwear/co-ords/streetwear-black-relaxed-coord-set-01.png"
    ],
    "price": 2999,
    "oldPrice": 3800,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 26,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black relaxed co-ord set designed for modern styling and comfort.",
    "description": "The Black Relaxed Co-ord Set combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium co ords construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Co Ords"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "EXCLUSIVE"
  },
  {
    "id": 52,
    "slug": "streetwear-hoodies-streetwear-black-oversized-hoodie-01",
    "sku": "STY-STR-HOD-052",
    "name": "Black Oversized Hoodie",
    "title": "Black Oversized Hoodie",
    "category": "STREETWEAR",
    "subcategory": "hoodies",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/hoodies/streetwear-black-oversized-hoodie-01.png",
    "images": [
      "/images/shop/products/streetwear/hoodies/streetwear-black-oversized-hoodie-01.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 33,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black oversized hoodie designed for modern styling and comfort.",
    "description": "The Black Oversized Hoodie combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium hoodies construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Hoodies"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "LIMITED"
  },
  {
    "id": 53,
    "slug": "streetwear-hoodies-streetwear-cream-premium-hoodie-03",
    "sku": "STY-STR-HOD-053",
    "name": "Cream Premium Hoodie",
    "title": "Cream Premium Hoodie",
    "category": "STREETWEAR",
    "subcategory": "hoodies",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/hoodies/streetwear-cream-premium-hoodie-03.png",
    "images": [
      "/images/shop/products/streetwear/hoodies/streetwear-cream-premium-hoodie-03.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 40,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium cream premium hoodie designed for modern styling and comfort.",
    "description": "The Cream Premium Hoodie combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium hoodies construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Hoodies"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 54,
    "slug": "streetwear-hoodies-streetwear-grey-minimal-hoodie-02",
    "sku": "STY-STR-HOD-054",
    "name": "Grey Minimal Hoodie",
    "title": "Grey Minimal Hoodie",
    "category": "STREETWEAR",
    "subcategory": "hoodies",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/hoodies/streetwear-grey-minimal-hoodie-02.png",
    "images": [
      "/images/shop/products/streetwear/hoodies/streetwear-grey-minimal-hoodie-02.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 16,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium grey minimal hoodie designed for modern styling and comfort.",
    "description": "The Grey Minimal Hoodie combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium hoodies construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Hoodies"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 55,
    "slug": "streetwear-jackets-streetwear-black-bomber-jacket-01",
    "sku": "STY-STR-JKT-055",
    "name": "Black Bomber Jacket",
    "title": "Black Bomber Jacket",
    "category": "STREETWEAR",
    "subcategory": "jackets",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/jackets/streetwear-black-bomber-jacket-01.png",
    "images": [
      "/images/shop/products/streetwear/jackets/streetwear-black-bomber-jacket-01.png"
    ],
    "price": 3499,
    "oldPrice": 4400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 23,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black bomber jacket designed for modern styling and comfort.",
    "description": "The Black Bomber Jacket combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium jackets construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Jackets"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "TRENDING"
  },
  {
    "id": 56,
    "slug": "streetwear-jackets-streetwear-olive-utility-jacket-02",
    "sku": "STY-STR-JKT-056",
    "name": "Olive Utility Jacket",
    "title": "Olive Utility Jacket",
    "category": "STREETWEAR",
    "subcategory": "jackets",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/jackets/streetwear-olive-utility-jacket-02.png",
    "images": [
      "/images/shop/products/streetwear/jackets/streetwear-olive-utility-jacket-02.png"
    ],
    "price": 3499,
    "oldPrice": 4400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 30,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium olive utility jacket designed for modern styling and comfort.",
    "description": "The Olive Utility Jacket combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium jackets construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Jackets"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 57,
    "slug": "streetwear-tshirts-streetwear-black-oversized-tshirt-01",
    "sku": "STY-STR-TSH-057",
    "name": "Black Oversized T-Shirt",
    "title": "Black Oversized T-Shirt",
    "category": "STREETWEAR",
    "subcategory": "tshirts",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/tshirts/streetwear-black-oversized-tshirt-01.png",
    "images": [
      "/images/shop/products/streetwear/tshirts/streetwear-black-oversized-tshirt-01.png"
    ],
    "price": 1499,
    "oldPrice": 1900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 37,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black oversized t-shirt designed for modern styling and comfort.",
    "description": "The Black Oversized T-Shirt combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium tshirts construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Tshirts"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 58,
    "slug": "streetwear-tshirts-streetwear-washed-grey-graphic-tshirt-03",
    "sku": "STY-STR-TSH-058",
    "name": "Washed Grey Graphic T-Shirt",
    "title": "Washed Grey Graphic T-Shirt",
    "category": "STREETWEAR",
    "subcategory": "tshirts",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/tshirts/streetwear-washed-grey-graphic-tshirt-03.png",
    "images": [
      "/images/shop/products/streetwear/tshirts/streetwear-washed-grey-graphic-tshirt-03.png"
    ],
    "price": 1499,
    "oldPrice": 1900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 13,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium washed grey graphic t-shirt designed for modern styling and comfort.",
    "description": "The Washed Grey Graphic T-Shirt combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium tshirts construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Tshirts"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 59,
    "slug": "streetwear-tshirts-streetwear-white-minimal-tshirt-02",
    "sku": "STY-STR-TSH-059",
    "name": "White Minimal T-Shirt",
    "title": "White Minimal T-Shirt",
    "category": "STREETWEAR",
    "subcategory": "tshirts",
    "brand": "Styloverse",
    "image": "/images/shop/products/streetwear/tshirts/streetwear-white-minimal-tshirt-02.png",
    "images": [
      "/images/shop/products/streetwear/tshirts/streetwear-white-minimal-tshirt-02.png"
    ],
    "price": 1499,
    "oldPrice": 1900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 20,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium white minimal t-shirt designed for modern styling and comfort.",
    "description": "The White Minimal T-Shirt combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium tshirts construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "STREETWEAR"
      },
      {
        "label": "Subcategory",
        "value": "Tshirts"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 60,
    "slug": "winter-boots-winter-beige-fur-lined-boots-03",
    "sku": "STY-WNT-BOT-060",
    "name": "Beige Fur Lined Boots",
    "title": "Beige Fur Lined Boots",
    "category": "WINTER",
    "subcategory": "boots",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/boots/winter-beige-fur-lined-boots-03.png",
    "images": [
      "/images/shop/products/winter/boots/winter-beige-fur-lined-boots-03.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 27,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium beige fur lined boots designed for modern styling and comfort.",
    "description": "The Beige Fur Lined Boots combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium boots construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Boots"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 61,
    "slug": "winter-boots-winter-black-leather-ankle-boots-01",
    "sku": "STY-WNT-BOT-061",
    "name": "Black Leather Ankle Boots",
    "title": "Black Leather Ankle Boots",
    "category": "WINTER",
    "subcategory": "boots",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/boots/winter-black-leather-ankle-boots-01.png",
    "images": [
      "/images/shop/products/winter/boots/winter-black-leather-ankle-boots-01.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 34,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black leather ankle boots designed for modern styling and comfort.",
    "description": "The Black Leather Ankle Boots combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium boots construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Boots"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium leather",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 62,
    "slug": "winter-boots-winter-dark-brown-lace-up-boots-04",
    "sku": "STY-WNT-BOT-062",
    "name": "Dark Brown Lace Up Boots",
    "title": "Dark Brown Lace Up Boots",
    "category": "WINTER",
    "subcategory": "boots",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/boots/winter-dark-brown-lace-up-boots-04.png",
    "images": [
      "/images/shop/products/winter/boots/winter-dark-brown-lace-up-boots-04.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 10,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium dark brown lace up boots designed for modern styling and comfort.",
    "description": "The Dark Brown Lace Up Boots combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium boots construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Boots"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 63,
    "slug": "winter-boots-winter-tan-suede-chelsea-boots-02",
    "sku": "STY-WNT-BOT-063",
    "name": "Tan Suede Chelsea Boots",
    "title": "Tan Suede Chelsea Boots",
    "category": "WINTER",
    "subcategory": "boots",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/boots/winter-tan-suede-chelsea-boots-02.png",
    "images": [
      "/images/shop/products/winter/boots/winter-tan-suede-chelsea-boots-02.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 17,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium tan suede chelsea boots designed for modern styling and comfort.",
    "description": "The Tan Suede Chelsea Boots combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium boots construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Boots"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium suede",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 64,
    "slug": "winter-coats-winter-camel-wool-long-coat-01",
    "sku": "STY-WNT-COT-064",
    "name": "Camel Wool Long Coat",
    "title": "Camel Wool Long Coat",
    "category": "WINTER",
    "subcategory": "coats",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/coats/winter-camel-wool-long-coat-01.png",
    "images": [
      "/images/shop/products/winter/coats/winter-camel-wool-long-coat-01.png"
    ],
    "price": 5999,
    "oldPrice": 7500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 24,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium camel wool long coat designed for modern styling and comfort.",
    "description": "The Camel Wool Long Coat combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium coats construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Coats"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium wool blend",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 65,
    "slug": "winter-coats-winter-charcoal-double-breasted-coat-02",
    "sku": "STY-WNT-COT-065",
    "name": "Charcoal Double Breasted Coat",
    "title": "Charcoal Double Breasted Coat",
    "category": "WINTER",
    "subcategory": "coats",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/coats/winter-charcoal-double-breasted-coat-02.png",
    "images": [
      "/images/shop/products/winter/coats/winter-charcoal-double-breasted-coat-02.png"
    ],
    "price": 5999,
    "oldPrice": 7500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 31,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium charcoal double breasted coat designed for modern styling and comfort.",
    "description": "The Charcoal Double Breasted Coat combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium coats construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Coats"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "LIMITED"
  },
  {
    "id": 66,
    "slug": "winter-coats-winter-ivory-belted-winter-coat-03",
    "sku": "STY-WNT-COT-066",
    "name": "Ivory Belted Winter Coat",
    "title": "Ivory Belted Winter Coat",
    "category": "WINTER",
    "subcategory": "coats",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/coats/winter-ivory-belted-winter-coat-03.png",
    "images": [
      "/images/shop/products/winter/coats/winter-ivory-belted-winter-coat-03.png"
    ],
    "price": 5999,
    "oldPrice": 7500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 38,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium ivory belted winter coat designed for modern styling and comfort.",
    "description": "The Ivory Belted Winter Coat combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium coats construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Coats"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "TRENDING"
  },
  {
    "id": 67,
    "slug": "winter-coats-winter-navy-tailored-overcoat-04",
    "sku": "STY-WNT-COT-067",
    "name": "Navy Tailored Overcoat",
    "title": "Navy Tailored Overcoat",
    "category": "WINTER",
    "subcategory": "coats",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/coats/winter-navy-tailored-overcoat-04.png",
    "images": [
      "/images/shop/products/winter/coats/winter-navy-tailored-overcoat-04.png"
    ],
    "price": 5999,
    "oldPrice": 7500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 14,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium navy tailored overcoat designed for modern styling and comfort.",
    "description": "The Navy Tailored Overcoat combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium coats construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Coats"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 68,
    "slug": "winter-jackets-winter-black-quilted-puffer-jacket-01",
    "sku": "STY-WNT-JKT-068",
    "name": "Black Quilted Puffer Jacket",
    "title": "Black Quilted Puffer Jacket",
    "category": "WINTER",
    "subcategory": "jackets",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/jackets/winter-black-quilted-puffer-jacket-01.png",
    "images": [
      "/images/shop/products/winter/jackets/winter-black-quilted-puffer-jacket-01.png"
    ],
    "price": 4499,
    "oldPrice": 5700,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 21,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black quilted puffer jacket designed for modern styling and comfort.",
    "description": "The Black Quilted Puffer Jacket combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium jackets construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Jackets"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "EXCLUSIVE"
  },
  {
    "id": 69,
    "slug": "winter-jackets-winter-burgundy-cropped-puffer-jacket-04",
    "sku": "STY-WNT-JKT-069",
    "name": "Burgundy Cropped Puffer Jacket",
    "title": "Burgundy Cropped Puffer Jacket",
    "category": "WINTER",
    "subcategory": "jackets",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/jackets/winter-burgundy-cropped-puffer-jacket-04.png",
    "images": [
      "/images/shop/products/winter/jackets/winter-burgundy-cropped-puffer-jacket-04.png"
    ],
    "price": 4499,
    "oldPrice": 5700,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 28,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium burgundy cropped puffer jacket designed for modern styling and comfort.",
    "description": "The Burgundy Cropped Puffer Jacket combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium jackets construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Jackets"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 70,
    "slug": "winter-jackets-winter-cream-shearling-jacket-03",
    "sku": "STY-WNT-JKT-070",
    "name": "Cream Shearling Jacket",
    "title": "Cream Shearling Jacket",
    "category": "WINTER",
    "subcategory": "jackets",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/jackets/winter-cream-shearling-jacket-03.png",
    "images": [
      "/images/shop/products/winter/jackets/winter-cream-shearling-jacket-03.png"
    ],
    "price": 4499,
    "oldPrice": 5700,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 35,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium cream shearling jacket designed for modern styling and comfort.",
    "description": "The Cream Shearling Jacket combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium jackets construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Jackets"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 71,
    "slug": "winter-jackets-winter-olive-hooded-parka-jacket-02",
    "sku": "STY-WNT-JKT-071",
    "name": "Olive Hooded Parka Jacket",
    "title": "Olive Hooded Parka Jacket",
    "category": "WINTER",
    "subcategory": "jackets",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/jackets/winter-olive-hooded-parka-jacket-02.png",
    "images": [
      "/images/shop/products/winter/jackets/winter-olive-hooded-parka-jacket-02.png"
    ],
    "price": 4499,
    "oldPrice": 5700,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 11,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium olive hooded parka jacket designed for modern styling and comfort.",
    "description": "The Olive Hooded Parka Jacket combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium jackets construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Jackets"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 72,
    "slug": "winter-knitwear-winter-burgundy-button-knit-cardigan-01",
    "sku": "STY-WNT-KNT-072",
    "name": "Burgundy Button Knit Cardigan",
    "title": "Burgundy Button Knit Cardigan",
    "category": "WINTER",
    "subcategory": "knitwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/knitwear/winter-burgundy-button-knit-cardigan-01.png",
    "images": [
      "/images/shop/products/winter/knitwear/winter-burgundy-button-knit-cardigan-01.png"
    ],
    "price": 2999,
    "oldPrice": 3800,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 18,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium burgundy button knit cardigan designed for modern styling and comfort.",
    "description": "The Burgundy Button Knit Cardigan combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium knitwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Knitwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 73,
    "slug": "winter-knitwear-winter-charcoal-ribbed-knit-dress-04",
    "sku": "STY-WNT-KNT-073",
    "name": "Charcoal Ribbed Knit Dress",
    "title": "Charcoal Ribbed Knit Dress",
    "category": "WINTER",
    "subcategory": "knitwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/knitwear/winter-charcoal-ribbed-knit-dress-04.png",
    "images": [
      "/images/shop/products/winter/knitwear/winter-charcoal-ribbed-knit-dress-04.png"
    ],
    "price": 2999,
    "oldPrice": 3800,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 25,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium charcoal ribbed knit dress designed for modern styling and comfort.",
    "description": "The Charcoal Ribbed Knit Dress combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium knitwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Knitwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 74,
    "slug": "winter-knitwear-winter-cream-cable-knit-vest-02",
    "sku": "STY-WNT-KNT-074",
    "name": "Cream Cable Knit Vest",
    "title": "Cream Cable Knit Vest",
    "category": "WINTER",
    "subcategory": "knitwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/knitwear/winter-cream-cable-knit-vest-02.png",
    "images": [
      "/images/shop/products/winter/knitwear/winter-cream-cable-knit-vest-02.png"
    ],
    "price": 2999,
    "oldPrice": 3800,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 32,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium cream cable knit vest designed for modern styling and comfort.",
    "description": "The Cream Cable Knit Vest combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium knitwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Knitwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 75,
    "slug": "winter-knitwear-winter-sage-longline-knit-cardigan-03",
    "sku": "STY-WNT-KNT-075",
    "name": "Sage Longline Knit Cardigan",
    "title": "Sage Longline Knit Cardigan",
    "category": "WINTER",
    "subcategory": "knitwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/knitwear/winter-sage-longline-knit-cardigan-03.png",
    "images": [
      "/images/shop/products/winter/knitwear/winter-sage-longline-knit-cardigan-03.png"
    ],
    "price": 2999,
    "oldPrice": 3800,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 39,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium sage longline knit cardigan designed for modern styling and comfort.",
    "description": "The Sage Longline Knit Cardigan combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium knitwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Knitwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 76,
    "slug": "winter-scarves-winter-burgundy-plaid-scarf-03",
    "sku": "STY-WNT-SCF-076",
    "name": "Burgundy Plaid Scarf",
    "title": "Burgundy Plaid Scarf",
    "category": "WINTER",
    "subcategory": "scarves",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/scarves/winter-burgundy-plaid-scarf-03.png",
    "images": [
      "/images/shop/products/winter/scarves/winter-burgundy-plaid-scarf-03.png"
    ],
    "price": 1499,
    "oldPrice": 1900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 15,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium burgundy plaid scarf designed for modern styling and comfort.",
    "description": "The Burgundy Plaid Scarf combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium scarves construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Scarves"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 77,
    "slug": "winter-scarves-winter-camel-cashmere-scarf-02",
    "sku": "STY-WNT-SCF-077",
    "name": "Camel Cashmere Scarf",
    "title": "Camel Cashmere Scarf",
    "category": "WINTER",
    "subcategory": "scarves",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/scarves/winter-camel-cashmere-scarf-02.png",
    "images": [
      "/images/shop/products/winter/scarves/winter-camel-cashmere-scarf-02.png"
    ],
    "price": 1499,
    "oldPrice": 1900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 22,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium camel cashmere scarf designed for modern styling and comfort.",
    "description": "The Camel Cashmere Scarf combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium scarves construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Scarves"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Soft cashmere blend",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "TRENDING"
  },
  {
    "id": 78,
    "slug": "winter-scarves-winter-grey-wool-scarf-01",
    "sku": "STY-WNT-SCF-078",
    "name": "Grey Wool Scarf",
    "title": "Grey Wool Scarf",
    "category": "WINTER",
    "subcategory": "scarves",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/scarves/winter-grey-wool-scarf-01.png",
    "images": [
      "/images/shop/products/winter/scarves/winter-grey-wool-scarf-01.png"
    ],
    "price": 1499,
    "oldPrice": 1900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 29,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium grey wool scarf designed for modern styling and comfort.",
    "description": "The Grey Wool Scarf combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium scarves construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Scarves"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium wool blend",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "LIMITED"
  },
  {
    "id": 79,
    "slug": "winter-scarves-winter-ivory-chunky-knit-scarf-04",
    "sku": "STY-WNT-SCF-079",
    "name": "Ivory Chunky Knit Scarf",
    "title": "Ivory Chunky Knit Scarf",
    "category": "WINTER",
    "subcategory": "scarves",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/scarves/winter-ivory-chunky-knit-scarf-04.png",
    "images": [
      "/images/shop/products/winter/scarves/winter-ivory-chunky-knit-scarf-04.png"
    ],
    "price": 1499,
    "oldPrice": 1900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 36,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium ivory chunky knit scarf designed for modern styling and comfort.",
    "description": "The Ivory Chunky Knit Scarf combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium scarves construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Scarves"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 80,
    "slug": "winter-sweaters-winter-camel-cashmere-sweater-03",
    "sku": "STY-WNT-SWT-080",
    "name": "Camel Cashmere Sweater",
    "title": "Camel Cashmere Sweater",
    "category": "WINTER",
    "subcategory": "sweaters",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/sweaters/winter-camel-cashmere-sweater-03.png",
    "images": [
      "/images/shop/products/winter/sweaters/winter-camel-cashmere-sweater-03.png"
    ],
    "price": 2799,
    "oldPrice": 3500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 12,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium camel cashmere sweater designed for modern styling and comfort.",
    "description": "The Camel Cashmere Sweater combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sweaters construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Sweaters"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Soft cashmere blend",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 81,
    "slug": "winter-sweaters-winter-charcoal-turtleneck-sweater-02",
    "sku": "STY-WNT-SWT-081",
    "name": "Charcoal Turtleneck Sweater",
    "title": "Charcoal Turtleneck Sweater",
    "category": "WINTER",
    "subcategory": "sweaters",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/sweaters/winter-charcoal-turtleneck-sweater-02.png",
    "images": [
      "/images/shop/products/winter/sweaters/winter-charcoal-turtleneck-sweater-02.png"
    ],
    "price": 2799,
    "oldPrice": 3500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 19,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium charcoal turtleneck sweater designed for modern styling and comfort.",
    "description": "The Charcoal Turtleneck Sweater combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sweaters construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Sweaters"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 82,
    "slug": "winter-sweaters-winter-cream-cable-knit-sweater-01",
    "sku": "STY-WNT-SWT-082",
    "name": "Cream Cable Knit Sweater",
    "title": "Cream Cable Knit Sweater",
    "category": "WINTER",
    "subcategory": "sweaters",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/sweaters/winter-cream-cable-knit-sweater-01.png",
    "images": [
      "/images/shop/products/winter/sweaters/winter-cream-cable-knit-sweater-01.png"
    ],
    "price": 2799,
    "oldPrice": 3500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 26,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium cream cable knit sweater designed for modern styling and comfort.",
    "description": "The Cream Cable Knit Sweater combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sweaters construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Sweaters"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 83,
    "slug": "winter-sweaters-winter-forest-green-halfzip-sweater-04",
    "sku": "STY-WNT-SWT-083",
    "name": "Forest Green Half-Zip Sweater",
    "title": "Forest Green Half-Zip Sweater",
    "category": "WINTER",
    "subcategory": "sweaters",
    "brand": "Styloverse",
    "image": "/images/shop/products/winter/sweaters/winter-forest-green-halfzip-sweater-04.png",
    "images": [
      "/images/shop/products/winter/sweaters/winter-forest-green-halfzip-sweater-04.png"
    ],
    "price": 2799,
    "oldPrice": 3500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 33,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium forest green half-zip sweater designed for modern styling and comfort.",
    "description": "The Forest Green Half-Zip Sweater combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sweaters construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WINTER"
      },
      {
        "label": "Subcategory",
        "value": "Sweaters"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Clean gently using a soft cloth",
      "Do not use harsh chemicals",
      "Air dry naturally",
      "Store away from direct sunlight"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 84,
    "slug": "women-blazers-women-beige-tailored-blazer-01",
    "sku": "STY-WMN-BLZ-084",
    "name": "Beige Tailored Blazer",
    "title": "Beige Tailored Blazer",
    "category": "WOMEN",
    "subcategory": "blazers",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/blazers/women-beige-tailored-blazer-01.png",
    "images": [
      "/images/shop/products/women/blazers/women-beige-tailored-blazer-01.png"
    ],
    "price": 4299,
    "oldPrice": 5400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 40,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium beige tailored blazer designed for modern styling and comfort.",
    "description": "The Beige Tailored Blazer combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium blazers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Blazers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 85,
    "slug": "women-blazers-women-black-structured-blazer-02",
    "sku": "STY-WMN-BLZ-085",
    "name": "Black Structured Blazer",
    "title": "Black Structured Blazer",
    "category": "WOMEN",
    "subcategory": "blazers",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/blazers/women-black-structured-blazer-02.png",
    "images": [
      "/images/shop/products/women/blazers/women-black-structured-blazer-02.png"
    ],
    "price": 4299,
    "oldPrice": 5400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 16,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black structured blazer designed for modern styling and comfort.",
    "description": "The Black Structured Blazer combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium blazers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Blazers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "EXCLUSIVE"
  },
  {
    "id": 86,
    "slug": "women-blazers-women-ivory-double-breasted-blazer-03",
    "sku": "STY-WMN-BLZ-086",
    "name": "Ivory Double Breasted Blazer",
    "title": "Ivory Double Breasted Blazer",
    "category": "WOMEN",
    "subcategory": "blazers",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/blazers/women-ivory-double-breasted-blazer-03.png",
    "images": [
      "/images/shop/products/women/blazers/women-ivory-double-breasted-blazer-03.png"
    ],
    "price": 4299,
    "oldPrice": 5400,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 23,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium ivory double breasted blazer designed for modern styling and comfort.",
    "description": "The Ivory Double Breasted Blazer combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium blazers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Blazers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 87,
    "slug": "women-denim-women-dark-indigo-skinny-jeans-01",
    "sku": "STY-WMN-DNM-087",
    "name": "Dark Indigo Skinny Jeans",
    "title": "Dark Indigo Skinny Jeans",
    "category": "WOMEN",
    "subcategory": "denim",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/denim/women-dark-indigo-skinny-jeans-01.png",
    "images": [
      "/images/shop/products/women/denim/women-dark-indigo-skinny-jeans-01.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 30,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium dark indigo skinny jeans designed for modern styling and comfort.",
    "description": "The Dark Indigo Skinny Jeans combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium denim construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Denim"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium cotton denim",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 88,
    "slug": "women-denim-women-light-blue-wide-leg-jeans-02",
    "sku": "STY-WMN-DNM-088",
    "name": "Light Blue Wide Leg Jeans",
    "title": "Light Blue Wide Leg Jeans",
    "category": "WOMEN",
    "subcategory": "denim",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/denim/women-light-blue-wide-leg-jeans-02.png",
    "images": [
      "/images/shop/products/women/denim/women-light-blue-wide-leg-jeans-02.png"
    ],
    "price": 2499,
    "oldPrice": 3200,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 37,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium light blue wide leg jeans designed for modern styling and comfort.",
    "description": "The Light Blue Wide Leg Jeans combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium denim construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Denim"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium cotton denim",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "TRENDING"
  },
  {
    "id": 89,
    "slug": "women-dresses-dress-champagne-gold-draped-dress-08",
    "sku": "STY-WMN-DRS-089",
    "name": "Champagne Gold Draped Dress",
    "title": "Champagne Gold Draped Dress",
    "category": "WOMEN",
    "subcategory": "dresses",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/dresses/dress-champagne-gold-draped-dress-08.png",
    "images": [
      "/images/shop/products/women/dresses/dress-champagne-gold-draped-dress-08.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 13,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium champagne gold draped dress designed for modern styling and comfort.",
    "description": "The Champagne Gold Draped Dress combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium dresses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Dresses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 90,
    "slug": "women-dresses-dress-cobalt-blue-satin-midi-dress-05",
    "sku": "STY-WMN-DRS-090",
    "name": "Cobalt Blue Satin Midi Dress",
    "title": "Cobalt Blue Satin Midi Dress",
    "category": "WOMEN",
    "subcategory": "dresses",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/dresses/dress-cobalt-blue-satin-midi-dress-05.png",
    "images": [
      "/images/shop/products/women/dresses/dress-cobalt-blue-satin-midi-dress-05.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 20,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium cobalt blue satin midi dress designed for modern styling and comfort.",
    "description": "The Cobalt Blue Satin Midi Dress combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium dresses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Dresses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium satin blend",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 91,
    "slug": "women-dresses-dress-deep-emerald-velvet-maxi-dress-06",
    "sku": "STY-WMN-DRS-091",
    "name": "Deep Emerald Velvet Maxi Dress",
    "title": "Deep Emerald Velvet Maxi Dress",
    "category": "WOMEN",
    "subcategory": "dresses",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/dresses/dress-deep-emerald-velvet-maxi-dress-06.png",
    "images": [
      "/images/shop/products/women/dresses/dress-deep-emerald-velvet-maxi-dress-06.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 27,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium deep emerald velvet maxi dress designed for modern styling and comfort.",
    "description": "The Deep Emerald Velvet Maxi Dress combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium dresses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Dresses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium velvet",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "LIMITED"
  },
  {
    "id": 92,
    "slug": "women-dresses-dress-deep-plum-sequin-evening-dress-07",
    "sku": "STY-WMN-DRS-092",
    "name": "Deep Plum Sequin Evening Dress",
    "title": "Deep Plum Sequin Evening Dress",
    "category": "WOMEN",
    "subcategory": "dresses",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/dresses/dress-deep-plum-sequin-evening-dress-07.png",
    "images": [
      "/images/shop/products/women/dresses/dress-deep-plum-sequin-evening-dress-07.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 34,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium deep plum sequin evening dress designed for modern styling and comfort.",
    "description": "The Deep Plum Sequin Evening Dress combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium dresses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Dresses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 93,
    "slug": "women-dresses-dress-maroon-velvet-slit-dress-09",
    "sku": "STY-WMN-DRS-093",
    "name": "Maroon Velvet Slit Dress",
    "title": "Maroon Velvet Slit Dress",
    "category": "WOMEN",
    "subcategory": "dresses",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/dresses/dress-maroon-velvet-slit-dress-09.png",
    "images": [
      "/images/shop/products/women/dresses/dress-maroon-velvet-slit-dress-09.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 10,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium maroon velvet slit dress designed for modern styling and comfort.",
    "description": "The Maroon Velvet Slit Dress combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium dresses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Dresses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium velvet",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 94,
    "slug": "women-dresses-women-black-satin-evening-dress",
    "sku": "STY-WMN-DRS-094",
    "name": "Black Satin Evening Dress",
    "title": "Black Satin Evening Dress",
    "category": "WOMEN",
    "subcategory": "dresses",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/dresses/women-black-satin-evening-dress.png",
    "images": [
      "/images/shop/products/women/dresses/women-black-satin-evening-dress.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 17,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black satin evening dress designed for modern styling and comfort.",
    "description": "The Black Satin Evening Dress combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium dresses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Dresses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium satin blend",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 95,
    "slug": "women-dresses-women-champagne-pleated-dress-04",
    "sku": "STY-WMN-DRS-095",
    "name": "Champagne Pleated Dress",
    "title": "Champagne Pleated Dress",
    "category": "WOMEN",
    "subcategory": "dresses",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/dresses/women-champagne-pleated-dress-04.png",
    "images": [
      "/images/shop/products/women/dresses/women-champagne-pleated-dress-04.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 24,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium champagne pleated dress designed for modern styling and comfort.",
    "description": "The Champagne Pleated Dress combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium dresses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Dresses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 96,
    "slug": "women-dresses-women-ivory-midi-dress-01",
    "sku": "STY-WMN-DRS-096",
    "name": "Ivory Midi Dress",
    "title": "Ivory Midi Dress",
    "category": "WOMEN",
    "subcategory": "dresses",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/dresses/women-ivory-midi-dress-01.png",
    "images": [
      "/images/shop/products/women/dresses/women-ivory-midi-dress-01.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 31,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium ivory midi dress designed for modern styling and comfort.",
    "description": "The Ivory Midi Dress combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium dresses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Dresses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 97,
    "slug": "women-dresses-women-wine-wrap-dress-03",
    "sku": "STY-WMN-DRS-097",
    "name": "Wine Wrap Dress",
    "title": "Wine Wrap Dress",
    "category": "WOMEN",
    "subcategory": "dresses",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/dresses/women-wine-wrap-dress-03.png",
    "images": [
      "/images/shop/products/women/dresses/women-wine-wrap-dress-03.png"
    ],
    "price": 3999,
    "oldPrice": 5000,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 38,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium wine wrap dress designed for modern styling and comfort.",
    "description": "The Wine Wrap Dress combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium dresses construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Dresses"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 98,
    "slug": "women-knitwear-women-camel-cashmere-sweater-01",
    "sku": "STY-WMN-KNT-098",
    "name": "Camel Cashmere Sweater",
    "title": "Camel Cashmere Sweater",
    "category": "WOMEN",
    "subcategory": "knitwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/knitwear/women-camel-cashmere-sweater-01.png",
    "images": [
      "/images/shop/products/women/knitwear/women-camel-cashmere-sweater-01.png"
    ],
    "price": 2799,
    "oldPrice": 3500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 14,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium camel cashmere sweater designed for modern styling and comfort.",
    "description": "The Camel Cashmere Sweater combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium knitwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Knitwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Soft cashmere blend",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 99,
    "slug": "women-knitwear-women-ivory-ribbed-turtleneck-02",
    "sku": "STY-WMN-KNT-099",
    "name": "Ivory Ribbed Turtleneck",
    "title": "Ivory Ribbed Turtleneck",
    "category": "WOMEN",
    "subcategory": "knitwear",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/knitwear/women-ivory-ribbed-turtleneck-02.png",
    "images": [
      "/images/shop/products/women/knitwear/women-ivory-ribbed-turtleneck-02.png"
    ],
    "price": 2799,
    "oldPrice": 3500,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 21,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium ivory ribbed turtleneck designed for modern styling and comfort.",
    "description": "The Ivory Ribbed Turtleneck combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium knitwear construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Knitwear"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "TRENDING"
  },
  {
    "id": 100,
    "slug": "women-sarees-saree-burnt-orange-organza-saree-06",
    "sku": "STY-WMN-SAR-100",
    "name": "Burnt Orange Organza Saree",
    "title": "Burnt Orange Organza Saree",
    "category": "WOMEN",
    "subcategory": "sarees",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/sarees/saree-burnt-orange-organza-saree-06.png",
    "images": [
      "/images/shop/products/women/sarees/saree-burnt-orange-organza-saree-06.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 28,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium burnt orange organza saree designed for modern styling and comfort.",
    "description": "The Burnt Orange Organza Saree combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sarees construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Sarees"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 101,
    "slug": "women-sarees-saree-deep-teal-satin-saree-05",
    "sku": "STY-WMN-SAR-101",
    "name": "Deep Teal Satin Saree",
    "title": "Deep Teal Satin Saree",
    "category": "WOMEN",
    "subcategory": "sarees",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/sarees/saree-deep-teal-satin-saree-05.png",
    "images": [
      "/images/shop/products/women/sarees/saree-deep-teal-satin-saree-05.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 35,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium deep teal satin saree designed for modern styling and comfort.",
    "description": "The Deep Teal Satin Saree combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sarees construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Sarees"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium satin blend",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 102,
    "slug": "women-sarees-saree-lavender-sequin-saree-07",
    "sku": "STY-WMN-SAR-102",
    "name": "Lavender Sequin Saree",
    "title": "Lavender Sequin Saree",
    "category": "WOMEN",
    "subcategory": "sarees",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/sarees/saree-lavender-sequin-saree-07.png",
    "images": [
      "/images/shop/products/women/sarees/saree-lavender-sequin-saree-07.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 11,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium lavender sequin saree designed for modern styling and comfort.",
    "description": "The Lavender Sequin Saree combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sarees construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Sarees"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "EXCLUSIVE"
  },
  {
    "id": 103,
    "slug": "women-sarees-women-black-sequin-evening-saree-02",
    "sku": "STY-WMN-SAR-103",
    "name": "Black Sequin Evening Saree",
    "title": "Black Sequin Evening Saree",
    "category": "WOMEN",
    "subcategory": "sarees",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/sarees/women-black-sequin-evening-saree-02.png",
    "images": [
      "/images/shop/products/women/sarees/women-black-sequin-evening-saree-02.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 18,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black sequin evening saree designed for modern styling and comfort.",
    "description": "The Black Sequin Evening Saree combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sarees construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Sarees"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 104,
    "slug": "women-sarees-women-ivory-embroidered-organza-saree-01",
    "sku": "STY-WMN-SAR-104",
    "name": "Ivory Embroidered Organza Saree",
    "title": "Ivory Embroidered Organza Saree",
    "category": "WOMEN",
    "subcategory": "sarees",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/sarees/women-ivory-embroidered-organza-saree-01.png",
    "images": [
      "/images/shop/products/women/sarees/women-ivory-embroidered-organza-saree-01.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 25,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium ivory embroidered organza saree designed for modern styling and comfort.",
    "description": "The Ivory Embroidered Organza Saree combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sarees construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Sarees"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "LIMITED"
  },
  {
    "id": 105,
    "slug": "women-sarees-women-sage-green-floral-organza-saree-04",
    "sku": "STY-WMN-SAR-105",
    "name": "Sage Green Floral Organza Saree",
    "title": "Sage Green Floral Organza Saree",
    "category": "WOMEN",
    "subcategory": "sarees",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/sarees/women-sage-green-floral-organza-saree-04.png",
    "images": [
      "/images/shop/products/women/sarees/women-sage-green-floral-organza-saree-04.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 32,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium sage green floral organza saree designed for modern styling and comfort.",
    "description": "The Sage Green Floral Organza Saree combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sarees construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Sarees"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 106,
    "slug": "women-sarees-women-wine-banarasi-silk-saree-03",
    "sku": "STY-WMN-SAR-106",
    "name": "Wine Banarasi Silk Saree",
    "title": "Wine Banarasi Silk Saree",
    "category": "WOMEN",
    "subcategory": "sarees",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/sarees/women-wine-banarasi-silk-saree-03.png",
    "images": [
      "/images/shop/products/women/sarees/women-wine-banarasi-silk-saree-03.png"
    ],
    "price": 4999,
    "oldPrice": 6300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 39,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium wine banarasi silk saree designed for modern styling and comfort.",
    "description": "The Wine Banarasi Silk Saree combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "One Size"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium sarees construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Sarees"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium silk blend",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 107,
    "slug": "women-tops-women-black-satin-top-02",
    "sku": "STY-WMN-TOP-107",
    "name": "Black Satin Top",
    "title": "Black Satin Top",
    "category": "WOMEN",
    "subcategory": "tops",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/tops/women-black-satin-top-02.png",
    "images": [
      "/images/shop/products/women/tops/women-black-satin-top-02.png"
    ],
    "price": 1799,
    "oldPrice": 2300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 15,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black satin top designed for modern styling and comfort.",
    "description": "The Black Satin Top combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium tops construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Tops"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium satin blend",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 108,
    "slug": "women-tops-women-blue-striped-shirt-top-03",
    "sku": "STY-WMN-TOP-108",
    "name": "Blue Striped Shirt Top",
    "title": "Blue Striped Shirt Top",
    "category": "WOMEN",
    "subcategory": "tops",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/tops/women-blue-striped-shirt-top-03.png",
    "images": [
      "/images/shop/products/women/tops/women-blue-striped-shirt-top-03.png"
    ],
    "price": 1799,
    "oldPrice": 2300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 22,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium blue striped shirt top designed for modern styling and comfort.",
    "description": "The Blue Striped Shirt Top combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium tops construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Tops"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 109,
    "slug": "women-tops-women-white-silk-blouse-01",
    "sku": "STY-WMN-TOP-109",
    "name": "White Silk Blouse",
    "title": "White Silk Blouse",
    "category": "WOMEN",
    "subcategory": "tops",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/tops/women-white-silk-blouse-01.png",
    "images": [
      "/images/shop/products/women/tops/women-white-silk-blouse-01.png"
    ],
    "price": 1799,
    "oldPrice": 2300,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 29,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium white silk blouse designed for modern styling and comfort.",
    "description": "The White Silk Blouse combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium tops construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Tops"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium silk blend",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  },
  {
    "id": 110,
    "slug": "women-trousers-women-beige-high-waist-trousers-02",
    "sku": "STY-WMN-TRS-110",
    "name": "Beige High Waist Trousers",
    "title": "Beige High Waist Trousers",
    "category": "WOMEN",
    "subcategory": "trousers",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/trousers/women-beige-high-waist-trousers-02.png",
    "images": [
      "/images/shop/products/women/trousers/women-beige-high-waist-trousers-02.png"
    ],
    "price": 2299,
    "oldPrice": 2900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 36,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium beige high waist trousers designed for modern styling and comfort.",
    "description": "The Beige High Waist Trousers combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium trousers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Trousers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": [],
    "badge": "TRENDING"
  },
  {
    "id": 111,
    "slug": "women-trousers-women-black-wide-leg-trousers-01",
    "sku": "STY-WMN-TRS-111",
    "name": "Black Wide Leg Trousers",
    "title": "Black Wide Leg Trousers",
    "category": "WOMEN",
    "subcategory": "trousers",
    "brand": "Styloverse",
    "image": "/images/shop/products/women/trousers/women-black-wide-leg-trousers-01.png",
    "images": [
      "/images/shop/products/women/trousers/women-black-wide-leg-trousers-01.png"
    ],
    "price": 2299,
    "oldPrice": 2900,
    "rating": 4.6,
    "reviewCount": 0,
    "stock": 12,
    "featured": false,
    "isNew": false,
    "shortDescription": "A premium black wide leg trousers designed for modern styling and comfort.",
    "description": "The Black Wide Leg Trousers combines refined design, reliable comfort and premium finishing. It is selected for the Styloverse collection.",
    "sizes": [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38"
    ],
    "colors": [
      {
        "name": "As Shown",
        "value": "#A3A3A3"
      }
    ],
    "features": [
      "Premium trousers construction",
      "Comfortable everyday design",
      "Refined Styloverse finish",
      "Designed for versatile styling"
    ],
    "specifications": [
      {
        "label": "Category",
        "value": "WOMEN"
      },
      {
        "label": "Subcategory",
        "value": "Trousers"
      },
      {
        "label": "Brand",
        "value": "Styloverse"
      },
      {
        "label": "Country of Origin",
        "value": "India"
      }
    ],
    "material": "Premium-quality fabric and materials",
    "careInstructions": [
      "Gentle wash or dry clean as required",
      "Do not bleach",
      "Dry in shade",
      "Use low-temperature ironing"
    ],
    "deliveryInformation": "Free standard delivery within 2-4 business days on eligible orders.",
    "returnPolicy": "Easy return or exchange available within 7 days of delivery.",
    "reviews": []
  }
];

type CuratedStudioAsset = Pick<
  Product,
  | "id"
  | "slug"
  | "sku"
  | "name"
  | "category"
  | "subcategory"
  | "image"
  | "price"
  | "oldPrice"
  | "sizes"
  | "material"
> & {
  colorName: string;
  colorValue: string;
};

const CURATED_STUDIO_ASSETS: CuratedStudioAsset[] = [
  {
    id: 112,
    slug: "accessories-bags-sand-pebble-leather-backpack",
    sku: "STY-ACC-BAG-112",
    name: "Sand Pebble Leather Backpack",
    category: "ACCESSORIES",
    subcategory: "bags",
    image: "/images/new-arrivals/Backpack.png",
    price: 3299,
    oldPrice: 4200,
    sizes: ["One Size"],
    material: "Premium pebble-grain vegan leather",
    colorName: "Sand",
    colorValue: "#C8AD8D",
  },
  {
    id: 113,
    slug: "women-dresses-ivory-linen-shift-dress",
    sku: "STY-WOM-DRS-113",
    name: "Ivory Linen Shift Dress",
    category: "WOMEN",
    subcategory: "dresses",
    image: "/images/new-arrivals/Dress.png",
    price: 2799,
    oldPrice: 3500,
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "Breathable premium linen blend",
    colorName: "Ivory",
    colorValue: "#F2EEE5",
  },
  {
    id: 114,
    slug: "streetwear-jackets-black-utility-zip-jacket",
    sku: "STY-STR-JKT-114",
    name: "Black Utility Zip Jacket",
    category: "STREETWEAR",
    subcategory: "jackets",
    image: "/images/new-arrivals/Jacket.png",
    price: 3899,
    oldPrice: 4900,
    sizes: ["S", "M", "L", "XL", "XXL"],
    material: "Structured premium cotton twill",
    colorName: "Black",
    colorValue: "#171717",
  },
  {
    id: 115,
    slug: "footwear-sneakers-ivory-everyday-sneakers",
    sku: "STY-FTW-SNK-115",
    name: "Ivory Everyday Sneakers",
    category: "FOOTWEAR",
    subcategory: "sneakers",
    image: "/images/new-arrivals/Shoes.png",
    price: 3499,
    oldPrice: 4400,
    sizes: ["6", "7", "8", "9", "10", "11"],
    material: "Premium vegan leather with cushioned sole",
    colorName: "Ivory",
    colorValue: "#EDE8DD",
  },
  {
    id: 116,
    slug: "men-blazers-sand-wool-tailored-blazer",
    sku: "STY-MEN-BLZ-116",
    name: "Sand Wool Tailored Blazer",
    category: "MEN",
    subcategory: "blazers",
    image: "/images/products/premium-jacket.png",
    price: 5299,
    oldPrice: 6800,
    sizes: ["S", "M", "L", "XL", "XXL"],
    material: "Premium wool-blend suiting",
    colorName: "Sand",
    colorValue: "#B8A58D",
  },
  {
    id: 117,
    slug: "streetwear-hoodies-oatmeal-essential-hoodie",
    sku: "STY-STR-HOD-117",
    name: "Oatmeal Essential Hoodie",
    category: "STREETWEAR",
    subcategory: "hoodies",
    image: "/images/products/product1.png",
    price: 2499,
    oldPrice: 3200,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    material: "Heavyweight brushed cotton fleece",
    colorName: "Oatmeal",
    colorValue: "#D3BFA2",
  },
  {
    id: 118,
    slug: "women-blazers-natural-linen-tailored-blazer",
    sku: "STY-WOM-BLZ-118",
    name: "Natural Linen Tailored Blazer",
    category: "WOMEN",
    subcategory: "blazers",
    image: "/images/products/product2.png",
    price: 4299,
    oldPrice: 5400,
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "Premium natural linen blend",
    colorName: "Natural",
    colorValue: "#D8C8AD",
  },
  {
    id: 119,
    slug: "footwear-sneakers-white-leather-platform-sneakers",
    sku: "STY-FTW-SNK-119",
    name: "White Leather Platform Sneakers",
    category: "FOOTWEAR",
    subcategory: "sneakers",
    image: "/images/products/product3.png",
    price: 3999,
    oldPrice: 5100,
    sizes: ["6", "7", "8", "9", "10", "11"],
    material: "Premium vegan leather with platform sole",
    colorName: "White",
    colorValue: "#F4F4F1",
  },
  {
    id: 120,
    slug: "accessories-bags-camel-structured-tote-bag",
    sku: "STY-ACC-BAG-120",
    name: "Camel Structured Tote Bag",
    category: "ACCESSORIES",
    subcategory: "bags",
    image: "/images/products/product4.png",
    price: 2899,
    oldPrice: 3700,
    sizes: ["One Size"],
    material: "Premium textured vegan leather",
    colorName: "Camel",
    colorValue: "#B98D63",
  },
];

function createCuratedStudioProduct(
  asset: CuratedStudioAsset
): Product {
  return {
    id: asset.id,
    slug: asset.slug,
    sku: asset.sku,
    name: asset.name,
    title: asset.name,
    category: asset.category,
    subcategory: asset.subcategory,
    brand: "Styloverse Atelier",
    badge: "NEW",
    image: asset.image,
    images: [asset.image],
    price: asset.price,
    oldPrice: asset.oldPrice,
    rating: 4.7,
    reviewCount: 0,
    stock: 24,
    featured: true,
    isNew: true,
    shortDescription: `${asset.name} is a newly curated Styloverse essential with premium finishing and versatile styling.`,
    description: `${asset.name} brings refined materials, considered proportions and dependable comfort to the Styloverse collection.`,
    sizes: asset.sizes,
    colors: [
      {
        name: asset.colorName,
        value: asset.colorValue,
      },
    ],
    features: [
      "New Styloverse atelier selection",
      "Premium material and refined construction",
      "Designed for versatile modern styling",
      "Carefully finished for lasting everyday use",
    ],
    specifications: [
      {
        label: "Category",
        value: asset.category,
      },
      {
        label: "Subcategory",
        value: asset.subcategory.replace(/-/g, " "),
      },
      {
        label: "Brand",
        value: "Styloverse Atelier",
      },
      {
        label: "Country of Origin",
        value: "India",
      },
    ],
    material: asset.material,
    careInstructions: [
      "Follow the care label instructions",
      "Do not bleach",
      "Store in a cool, dry place",
      "Use professional cleaning when required",
    ],
    deliveryInformation:
      "Free standard delivery within 2-4 business days on eligible orders.",
    returnPolicy:
      "Easy return or exchange available within 7 days of delivery.",
    reviews: [],
  };
}

products.push(
  ...CURATED_STUDIO_ASSETS.map(createCuratedStudioProduct)
);

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

export function getProductByIdentifier(
  identifier: string | number
): Product | undefined {
  return (
    getProductById(identifier) ??
    getProductBySlug(String(identifier))
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
