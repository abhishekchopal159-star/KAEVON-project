export type StyleProfile = {
  userId: string;
  preferredCategories: string[];
  preferredColors: string[];
  preferredOccasions: string[];
  preferredFits: string[];
  sizes: { top: string; bottom: string; footwear: string };
  measurements: { chest: string; waist: string; hips: string; height: string };
  budgetMin: number;
  budgetMax: number;
  wardrobeProductIds: string[];
  packagingPreference: "signature" | "gift" | "minimal";
  locale: string;
  currency: string;
  updatedAt: string;
};

export const EMPTY_STYLE_PROFILE: StyleProfile = {
  userId: "", preferredCategories: [], preferredColors: [], preferredOccasions: [],
  preferredFits: [], sizes: { top: "", bottom: "", footwear: "" },
  measurements: { chest: "", waist: "", hips: "", height: "" }, budgetMin: 0,
  budgetMax: 25000, wardrobeProductIds: [], packagingPreference: "signature",
  locale: "en-IN", currency: "INR", updatedAt: "",
};
