export const CONTENT_STATUSES = ["draft", "scheduled", "published", "archived"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export type ContentAuditEntry = {
  id: string;
  action: string;
  detail: string;
  actorUid: string;
  actorName: string;
  createdAt: string;
};

export type ContentActor = {
  uid: string;
  displayName: string;
};

export type StoreCategory = {
  id: string;
  slug: string;
  name: string;
  title: string;
  eyebrow: string;
  description: string;
  productCategory: string;
  href: string;
  image: string;
  mobileImage: string;
  subcategories: string[];
  order: number;
  status: ContentStatus;
  publishAt: string;
  unpublishAt: string;
  updatedAt: string;
  audit: ContentAuditEntry[];
};

export type StoreCollection = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  href: string;
  image: string;
  mobileImage: string;
  productIds: string[];
  order: number;
  status: ContentStatus;
  publishAt: string;
  unpublishAt: string;
  updatedAt: string;
  audit: ContentAuditEntry[];
};

export type HomeContent = {
  id: "home";
  announcement: string;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  heroImage: string;
  heroMobileImage: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  featuredCategoryIds: string[];
  featuredProductIds: string[];
  newArrivalProductIds: string[];
  sectionOrder: string[];
  hiddenSections: string[];
  seasonalEyebrow: string;
  seasonalTitle: string;
  seasonalDescription: string;
  seasonalImage: string;
  seasonalMobileImage: string;
  seasonalHref: string;
  footerStatement: string;
  policyShipping: string;
  policyCancellation: string;
  policyReturns: string;
  policyExchanges: string;
  policyRefunds: string;
  policyDemo: string;
  status: ContentStatus;
  publishAt: string;
  unpublishAt: string;
  updatedAt: string;
  audit: ContentAuditEntry[];
};

export const DEFAULT_HOME_CONTENT: HomeContent = {
  id: "home",
  announcement: "COMPLIMENTARY SHIPPING ON ORDERS OVER ₹10,000",
  heroEyebrow: "New Collection 2026",
  heroTitle: "Where Fashion",
  heroAccent: "Meets You",
  heroDescription: "Discover premium fashion, footwear and accessories crafted to elevate your everyday style.",
  heroImage: "/images/banners/new1.jpg",
  heroMobileImage: "/images/banners/new1-mobile.webp",
  primaryLabel: "Shop Now",
  primaryHref: "/shop",
  secondaryLabel: "Explore Collection",
  secondaryHref: "/collections",
  featuredCategoryIds: ["women", "men", "footwear", "accessories"],
  featuredProductIds: [],
  newArrivalProductIds: [],
  sectionOrder: ["categories", "featured", "why", "new-arrivals", "seasonal", "testimonials"],
  hiddenSections: [],
  seasonalEyebrow: "The seasonal atelier",
  seasonalTitle: "A private edit for the moment.",
  seasonalDescription: "Curated silhouettes, considered textures and enduring craftsmanship.",
  seasonalImage: "/images/banners/Banner.png",
  seasonalMobileImage: "/images/banners/Banner.png",
  seasonalHref: "/collections",
  footerStatement: "Your wardrobe, exceptionally curated.",
  policyShipping: "The portfolio build displays delivery estimates and tracking architecture but does not dispatch real parcels. A future owner can connect a carrier adapter and configure serviceability, methods and charges.",
  policyCancellation: "Confirmed orders can be cancelled before operational processing. Item-level cancellation and stock release are recorded so inventory truth remains consistent.",
  policyReturns: "Return eligibility is designed around delivered orders, item condition and a configurable return window. Requests retain reason, evidence, selected items and an auditable status journey.",
  policyExchanges: "Approved size or colour exchanges reserve the replacement variant before the aftercare case can complete.",
  policyRefunds: "COD, bank, UPI and store-credit destinations are supported in the model. Browser clients cannot mark an online refund completed; only a future trusted server or gateway webhook may do so.",
  policyDemo: "Styloverse is currently operating as a portfolio demonstration. No real card, UPI or wallet payment, delivery, pickup or refund occurs.",
  status: "published",
  publishAt: "",
  unpublishAt: "",
  updatedAt: "",
  audit: [],
};
