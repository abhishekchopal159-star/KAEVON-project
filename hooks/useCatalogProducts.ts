"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  products as staticProducts,
  type Product,
} from "@/data/products";
import { subscribeToPublishedProducts } from "@/services/product.service";

export function useCatalogProducts() {
  const [cloudProducts, setCloudProducts] =
    useState<Product[]>([]);

  useEffect(() => {
    return subscribeToPublishedProducts(
      setCloudProducts,
      (error) => {
        console.warn(
          "Unable to load cloud catalogue products:",
          error
        );
      }
    );
  }, []);

  return useMemo(() => {
    const cloudIds = new Set(
      cloudProducts.map((product) =>
        String(product.id)
      )
    );
    const cloudSlugs = new Set(
      cloudProducts.map(
        (product) => product.slug
      )
    );

    return [
      ...cloudProducts,
      ...staticProducts.filter(
        (product) =>
          !cloudIds.has(
            String(product.id)
          ) &&
          !cloudSlugs.has(product.slug)
      ),
    ];
  }, [cloudProducts]);
}
