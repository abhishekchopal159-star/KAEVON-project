import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { buildOccasionEdit, buildPersonalRecommendations } from "@/services/recommendation.service";
import { EMPTY_STYLE_PROFILE } from "@/types/personalization";

describe("personalization", () => {
  it("uses account preferences to rank real catalogue products", () => {
    const ranked=buildPersonalRecommendations(products,{...EMPTY_STYLE_PROFILE,preferredCategories:["WOMEN"]},{wishlistIds:[],cartIds:[],recentIds:[]},8);
    expect(ranked[0].category).toBe("WOMEN");
  });
  it("keeps occasion edits inside budget", () => expect(buildOccasionEdit(products,"wedding",3000).every((item)=>item.price<=3000)).toBe(true));
});
