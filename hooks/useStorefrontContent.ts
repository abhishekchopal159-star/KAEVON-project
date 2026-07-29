"use client";

import { useEffect, useState } from "react";
import { DEFAULT_HOME_CONTENT, type HomeContent, type StoreCategory } from "@/types/content-admin";
import { isContentLive, subscribeToHomeContent, subscribeToStoreCategories } from "@/services/content-admin.service";

export function useStorefrontContent() {
  const [home, setHome] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const [categories, setCategories] = useState<StoreCategory[]>([]);

  useEffect(() => {
    const stopHome = subscribeToHomeContent((value) => { if (isContentLive(value)) setHome(value); });
    const stopCategories = subscribeToStoreCategories((values) => setCategories(values.filter((value) => isContentLive(value))));
    return () => { stopHome(); stopCategories(); };
  }, []);

  return { home, categories };
}
