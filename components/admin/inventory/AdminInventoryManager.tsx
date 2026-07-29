"use client";

import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Barcode,
  Boxes,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  FileSpreadsheet,
  Filter,
  History,
  Loader2,
  PackageCheck,
  PackageMinus,
  PackageOpen,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Warehouse,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Image from "next/image";

import { useAdminAccess } from "@/contexts/AdminContext";
import { products as catalogueProducts } from "@/data/products";
import {
  calculateInventorySummary,
  createDefaultVariants,
  getVariantAvailableStock,
} from "@/lib/inventory";
import {
  adjustInventory,
  bulkSetReorderLevel,
  initializeInventoryCatalogue,
  saveProductVariants,
  subscribeToInventoryMovements,
  subscribeToInventoryProducts,
} from "@/services/inventory.service";
import type {
  InventoryAdjustmentInput,
  InventoryMovement,
  InventoryProduct,
  InventoryVariantDraft,
  ProductVariant,
} from "@/types/inventory";

type StockFilter =
  | "all"
  | "healthy"
  | "low"
  | "out";

type InventorySort =
  | "name"
  | "available_desc"
  | "available_asc"
  | "value_desc"
  | "attention";

type AdjustmentType =
  InventoryAdjustmentInput["type"];

type ImportedInventoryRow = {
  product: InventoryProduct;
  variant: ProductVariant;
  stockOnHand: number;
  reorderLevel: number;
};

const ADJUSTMENT_LABELS: Record<
  AdjustmentType,
  string
> = {
  stock_received: "New shipment",
  manual_increase: "Manual increase",
  manual_decrease: "Manual decrease",
  returned: "Customer return",
  damaged: "Damaged stock",
};

const catalogueInventoryProducts: InventoryProduct[] =
  catalogueProducts.map(
    (product) => {
      const variants =
        product.variants?.length
          ? product.variants
          : createDefaultVariants({
              sku: product.sku,
              sizes: product.sizes,
              colorName:
                product.colors[0]?.name ??
                "As Shown",
              colorValue:
                product.colors[0]?.value ??
                "#A3A3A3",
              image: product.image,
              price: product.price,
              stock: product.stock,
            });

      return {
        documentId: String(product.id),
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        subcategory: product.subcategory,
        image: product.image,
        price: product.price,
        status: "published",
        variants,
        inventory:
          calculateInventorySummary(
            variants
          ),
      };
    }
  );

function mergeInventoryCatalogue(
  cloudProducts: InventoryProduct[]
) {
  const cloudKeys = new Set(
    cloudProducts.flatMap((product) => [
      `id:${String(product.id)}`,
      `slug:${product.slug.toLowerCase()}`,
    ])
  );

  return [
    ...cloudProducts,
    ...catalogueInventoryProducts.filter(
      (product) =>
        !cloudKeys.has(
          `id:${String(product.id)}`
        ) &&
        !cloudKeys.has(
          `slug:${product.slug.toLowerCase()}`
        )
    ),
  ].sort((first, second) =>
    first.name.localeCompare(second.name)
  );
}

const previewProducts =
  catalogueInventoryProducts;

const previewMovements: InventoryMovement[] =
  [
    {
      id: "preview-movement-1",
      productId:
        previewProducts[0]?.documentId ??
        "1",
      productName:
        previewProducts[0]?.name ??
        "Styloverse piece",
      variantId:
        previewProducts[0]?.variants[0]
          ?.id ?? "one-size",
      sku:
        previewProducts[0]?.variants[0]
          ?.sku ?? "STY-PREVIEW-01",
      type: "stock_received",
      quantity: 12,
      previousOnHand: 5,
      nextOnHand: 17,
      previousReserved: 0,
      nextReserved: 0,
      reason: "Private collection intake",
      orderId: "",
      actorUid: "preview-admin",
      actorName: "Abhishek",
      createdAt: new Date(
        Date.now() - 22 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "preview-movement-2",
      productId:
        previewProducts[1]?.documentId ??
        "2",
      productName:
        previewProducts[1]?.name ??
        "Styloverse piece",
      variantId:
        previewProducts[1]?.variants[0]
          ?.id ?? "one-size",
      sku:
        previewProducts[1]?.variants[0]
          ?.sku ?? "STY-PREVIEW-02",
      type: "manual_decrease",
      quantity: 1,
      previousOnHand: 25,
      nextOnHand: 24,
      previousReserved: 0,
      nextReserved: 0,
      reason: "Editorial sample allocation",
      orderId: "",
      actorUid: "preview-admin",
      actorName: "Abhishek",
      createdAt: new Date(
        Date.now() - 3 * 60 * 60 * 1000
      ).toISOString(),
    },
  ];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) {
    return "Just now";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function movementTone(
  type: InventoryMovement["type"]
) {
  if (
    type === "stock_received" ||
    type === "manual_increase" ||
    type === "returned" ||
    type === "exchange_in"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    type === "damaged" ||
    type === "manual_decrease"
  ) {
    return "bg-rose-50 text-rose-700";
  }

  return "bg-amber-50 text-amber-700";
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (
    let index = 0;
    index < line.length;
    index += 1
  ) {
    const character = line[index];

    if (character === '"') {
      if (
        quoted &&
        line[index + 1] === '"'
      ) {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (
      character === "," &&
      !quoted
    ) {
      values.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current.trim());
  return values;
}

function downloadCsv(
  rows: InventoryProduct[]
) {
  const headings = [
    "productId",
    "productName",
    "category",
    "variantId",
    "sku",
    "barcode",
    "size",
    "colour",
    "price",
    "stockOnHand",
    "stockReserved",
    "stockAvailable",
    "stockSold",
    "stockDamaged",
    "reorderLevel",
    "status",
  ];
  const lines = rows.flatMap((product) =>
    product.variants.map((variant) =>
      [
        product.documentId,
        product.name,
        product.category,
        variant.id,
        variant.sku,
        variant.barcode,
        variant.size,
        variant.colorName,
        variant.price,
        variant.stockOnHand,
        variant.stockReserved,
        getVariantAvailableStock(variant),
        variant.stockSold,
        variant.stockDamaged,
        variant.reorderLevel,
        variant.status,
      ]
        .map(escapeCsv)
        .join(",")
    )
  );
  const blob = new Blob(
    [[headings.join(","), ...lines].join("\n")],
    { type: "text/csv;charset=utf-8" }
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `styloverse-inventory-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function cloneVariant(
  variant: ProductVariant
): InventoryVariantDraft {
  return {
    id: variant.id,
    sku: variant.sku,
    barcode: variant.barcode,
    size: variant.size,
    colorName: variant.colorName,
    colorValue: variant.colorValue,
    image: variant.image,
    price: variant.price,
    stockOnHand: variant.stockOnHand,
    stockReserved: variant.stockReserved,
    stockSold: variant.stockSold,
    stockReturned:
      variant.stockReturned,
    stockDamaged: variant.stockDamaged,
    reorderLevel: variant.reorderLevel,
  };
}

export default function AdminInventoryManager() {
  const { profile, isPreview } =
    useAdminAccess();
  const [inventoryProducts, setProducts] =
    useState<InventoryProduct[]>(
      isPreview ? previewProducts : []
    );
  const [movements, setMovements] =
    useState<InventoryMovement[]>(
      isPreview ? previewMovements : []
    );
  const [isLoading, setIsLoading] =
    useState(!isPreview);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [notice, setNotice] = useState("");
  const [queryText, setQueryText] =
    useState("");
  const [category, setCategory] =
    useState("all");
  const [stockFilter, setStockFilter] =
    useState<StockFilter>("all");
  const [sortOrder, setSortOrder] =
    useState<InventorySort>("name");
  const [pageIndex, setPageIndex] =
    useState(0);
  const [selectedProduct, setSelectedProduct] =
    useState<InventoryProduct | null>(
      null
    );
  const [variantDrafts, setVariantDrafts] =
    useState<InventoryVariantDraft[]>([]);
  const [selectedVariantKeys, setSelectedVariantKeys] =
    useState<Set<string>>(new Set());
  const [reorderDraft, setReorderDraft] =
    useState("5");
  const [isSaving, setIsSaving] =
    useState(false);
  const [
    adjustmentVariant,
    setAdjustmentVariant,
  ] = useState<ProductVariant | null>(null);
  const [adjustmentType, setAdjustmentType] =
    useState<AdjustmentType>(
      "stock_received"
    );
  const [adjustmentQuantity, setAdjustmentQuantity] =
    useState("1");
  const [adjustmentReason, setAdjustmentReason] =
    useState("");
  const importInputRef =
    useRef<HTMLInputElement>(null);
  const drawerRef =
    useRef<HTMLDivElement>(null);

  const actor = useMemo(
    () => ({
      uid: profile.uid,
      displayName:
        profile.displayName ||
        "Styloverse administrator",
    }),
    [profile.displayName, profile.uid]
  );

  useEffect(() => {
    if (isPreview) {
      return;
    }

    const unsubscribeProducts =
      subscribeToInventoryProducts(
        (nextProducts) => {
          const mergedProducts =
            mergeInventoryCatalogue(
              nextProducts
            );
          setProducts(mergedProducts);
          setSelectedProduct(
            (current) =>
              current
                ? mergedProducts.find(
                    (product) =>
                      product.documentId ===
                      current.documentId
                  ) ?? null
                : null
          );
          setIsLoading(false);
        },
        (error) => {
          setErrorMessage(error.message);
          setIsLoading(false);
        }
      );
    const unsubscribeMovements =
      subscribeToInventoryMovements(
        setMovements,
        (error) =>
          setErrorMessage(error.message)
      );

    return () => {
      unsubscribeProducts();
      unsubscribeMovements();
    };
  }, [isPreview]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const previous =
      document.activeElement as HTMLElement | null;
    drawerRef.current?.focus();

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
      previous?.focus?.();
    };
  }, [selectedProduct]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          inventoryProducts.map(
            (product) => product.category
          )
        )
      ).sort(),
    [inventoryProducts]
  );

  const filteredProducts = useMemo(() => {
    const search = queryText
      .trim()
      .toLowerCase();

    return inventoryProducts
      .filter((product) => {
        const matchesSearch =
          !search ||
          [
            product.name,
            product.category,
            product.subcategory,
            ...product.variants.flatMap(
              (variant) => [
                variant.sku,
                variant.barcode,
                variant.size,
                variant.colorName,
              ]
            ),
          ]
            .join(" ")
            .toLowerCase()
            .includes(search);
        const matchesCategory =
          category === "all" ||
          product.category === category;
        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "healthy" &&
            product.inventory
              .lowStockVariants === 0 &&
            product.inventory
              .outOfStockVariants === 0) ||
          (stockFilter === "low" &&
            product.inventory
              .lowStockVariants > 0) ||
          (stockFilter === "out" &&
            product.inventory
              .outOfStockVariants > 0);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStock
        );
      })
      .sort((first, second) => {
        if (sortOrder === "available_desc") {
          return (
            second.inventory.stockAvailable -
            first.inventory.stockAvailable
          );
        }

        if (sortOrder === "available_asc") {
          return (
            first.inventory.stockAvailable -
            second.inventory.stockAvailable
          );
        }

        if (sortOrder === "value_desc") {
          return (
            second.inventory.inventoryValue -
            first.inventory.inventoryValue
          );
        }

        if (sortOrder === "attention") {
          const firstAttention =
            first.inventory.outOfStockVariants *
              100 +
            first.inventory.lowStockVariants;
          const secondAttention =
            second.inventory.outOfStockVariants *
              100 +
            second.inventory.lowStockVariants;
          return (
            secondAttention -
            firstAttention
          );
        }

        return first.name.localeCompare(
          second.name
        );
      });
  }, [
    category,
    inventoryProducts,
    queryText,
    sortOrder,
    stockFilter,
  ]);
  const pageSize = 12;
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / pageSize
    )
  );
  const safePageIndex = Math.min(
    pageIndex,
    totalPages - 1
  );
  const visibleProducts =
    filteredProducts.slice(
      safePageIndex * pageSize,
      safePageIndex * pageSize +
        pageSize
    );

  const metrics = useMemo(
    () =>
      inventoryProducts.reduce(
        (summary, product) => {
          summary.available +=
            product.inventory.stockAvailable;
          summary.reserved +=
            product.inventory.stockReserved;
          summary.value +=
            product.inventory.inventoryValue;
          summary.low +=
            product.inventory
              .lowStockVariants;
          summary.out +=
            product.inventory
              .outOfStockVariants;
          summary.variants +=
            product.variants.length;
          return summary;
        },
        {
          available: 0,
          reserved: 0,
          value: 0,
          low: 0,
          out: 0,
          variants: 0,
        }
      ),
    [inventoryProducts]
  );

  function openProduct(
    product: InventoryProduct
  ) {
    setSelectedProduct(product);
    setVariantDrafts(
      product.variants.map(cloneVariant)
    );
    setNotice("");
    setErrorMessage("");
  }

  function updateVariant(
    index: number,
    field: keyof InventoryVariantDraft,
    value: string | number
  ) {
    setVariantDrafts((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  }

  async function saveVariants() {
    if (!selectedProduct) {
      return;
    }

    if (isPreview) {
      setNotice(
        "Preview is read-only. Sign in as the verified administrator to save inventory."
      );
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await saveProductVariants({
        productId:
          selectedProduct.documentId,
        variants: variantDrafts,
        actor,
      });
      setNotice(
        `${selectedProduct.name} variants saved with SKU verification.`
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Inventory variants could not be saved."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function submitAdjustment() {
    if (
      !selectedProduct ||
      !adjustmentVariant
    ) {
      return;
    }

    if (isPreview) {
      setNotice(
        "Preview adjustment simulated safely—no stock was changed."
      );
      setAdjustmentVariant(null);
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await adjustInventory({
        productId:
          selectedProduct.documentId,
        variantId: adjustmentVariant.id,
        quantity: Number(
          adjustmentQuantity
        ),
        type: adjustmentType,
        reason: adjustmentReason,
        actor,
      });
      setNotice(
        `${adjustmentVariant.sku} stock adjusted successfully.`
      );
      setAdjustmentVariant(null);
      setAdjustmentQuantity("1");
      setAdjustmentReason("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Stock adjustment failed."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function toggleVariantSelection(
    productId: string,
    variantId: string
  ) {
    const key = `${productId}::${variantId}`;
    setSelectedVariantKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function applyBulkReorderLevel() {
    if (selectedVariantKeys.size === 0) {
      return;
    }

    if (isPreview) {
      setNotice(
        `Previewed reorder threshold ${reorderDraft} for ${selectedVariantKeys.size} variants.`
      );
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await bulkSetReorderLevel({
        targets: [
          ...selectedVariantKeys,
        ].map((key) => {
          const [productId, variantId] =
            key.split("::");
          return { productId, variantId };
        }),
        reorderLevel: Number(
          reorderDraft
        ),
        actor,
      });
      setNotice(
        `Reorder threshold updated for ${selectedVariantKeys.size} variants.`
      );
      setSelectedVariantKeys(new Set());
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Bulk inventory update failed."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function importInventoryCsv(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .filter((line) => line.trim());
    const headings = parseCsvLine(
      lines[0] ?? ""
    );
    const rows = lines
      .slice(1)
      .map(parseCsvLine);

    if (rows.length === 0) {
      setErrorMessage(
        "The inventory CSV contains no data rows."
      );
      return;
    }

    const requiredHeadings = [
      "productId",
      "variantId",
      "sku",
      "stockOnHand",
      "reorderLevel",
    ];
    const missing = requiredHeadings.filter(
      (heading) =>
        !headings.includes(heading)
    );

    if (missing.length > 0) {
      setErrorMessage(
        `CSV is missing required columns: ${missing.join(
          ", "
        )}. Export the inventory template first.`
      );
      return;
    }

    const column = (name: string) =>
      headings.indexOf(name);
    let imported: ImportedInventoryRow[];

    try {
      imported = rows.map(
        (values, rowIndex) => {
        const productId =
          values[column("productId")]?.trim();
        const variantId =
          values[column("variantId")]?.trim();
        const sku =
          values[column("sku")]
            ?.trim()
            .toUpperCase();
        const stockOnHand = Number(
          values[column("stockOnHand")]
        );
        const reorderLevel = Number(
          values[column("reorderLevel")]
        );
        const product =
          inventoryProducts.find(
            (item) =>
              item.documentId ===
              productId
          );
        const variant =
          product?.variants.find(
            (item) =>
              item.id === variantId
          );

        if (
          !product ||
          !variant ||
          variant.sku !== sku ||
          !Number.isInteger(stockOnHand) ||
          stockOnHand < 0 ||
          !Number.isInteger(reorderLevel) ||
          reorderLevel < 0
        ) {
          throw new Error(
            `CSV row ${rowIndex + 2} is invalid or no longer matches the live catalogue.`
          );
        }

        if (
          stockOnHand <
          variant.stockReserved
        ) {
          throw new Error(
            `CSV row ${rowIndex + 2} would reduce ${sku} below its reserved stock.`
          );
        }

          return {
            product,
            variant,
            stockOnHand,
            reorderLevel,
          };
        }
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The inventory CSV is invalid."
      );
      return;
    }

    if (isPreview) {
      setNotice(
        `${imported.length} CSV rows validated in preview. No cloud stock was changed.`
      );
      return;
    }

    if (
      !window.confirm(
        `Apply ${imported.length} validated inventory rows? Every quantity change will create an audit movement.`
      )
    ) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      for (const row of imported) {
        const delta =
          row.stockOnHand -
          row.variant.stockOnHand;

        if (delta !== 0) {
          await adjustInventory({
            productId:
              row.product.documentId,
            variantId: row.variant.id,
            quantity: Math.abs(delta),
            type:
              delta > 0
                ? "manual_increase"
                : "manual_decrease",
            reason:
              "Validated inventory CSV import",
            actor,
          });
        }
      }

      for (
        let index = 0;
        index < imported.length;
        index += 25
      ) {
        const chunk = imported.slice(
          index,
          index + 25
        );
        const levels = new Map<
          number,
          typeof chunk
        >();

        chunk.forEach((row) => {
          const grouped =
            levels.get(
              row.reorderLevel
            ) ?? [];
          grouped.push(row);
          levels.set(
            row.reorderLevel,
            grouped
          );
        });

        for (const [
          reorderLevel,
          levelRows,
        ] of levels) {
          await bulkSetReorderLevel({
            targets: levelRows.map(
              (row) => ({
                productId:
                  row.product.documentId,
                variantId:
                  row.variant.id,
              })
            ),
            reorderLevel,
            actor,
          });
        }
      }

      setNotice(
        `${imported.length} inventory rows imported with movement auditing.`
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Inventory CSV import failed."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function initializeCatalogue() {
    if (isPreview) {
      setNotice(
        `${inventoryProducts.length} products are ready for secure inventory initialization. Preview remains read-only.`
      );
      return;
    }

    if (
      !window.confirm(
        `Initialize or synchronize ${inventoryProducts.length} product inventories? Existing quantities will be preserved.`
      )
    ) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await initializeInventoryCatalogue({
        products: inventoryProducts,
        actor,
        onProgress: (completed, total) =>
          setNotice(
            `Synchronizing inventory ${completed}/${total}…`
          ),
      });
      setNotice(
        "Every product variant is now synchronized with the secure inventory engine."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Inventory initialization failed."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-6rem)] bg-[#F5F0EA] px-3 pb-24 pt-4 text-[#1A1715] sm:px-5 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-[1600px]">
        <header className="relative overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_78%_18%,rgba(186,143,79,.24),transparent_28%),linear-gradient(135deg,#151311_0%,#211C19_48%,#30273A_100%)] px-5 py-7 text-white shadow-[0_28px_80px_rgba(34,25,19,.18)] sm:rounded-[38px] sm:px-8 sm:py-10 lg:px-11">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.24em] text-[#EAC88F]">
                <Warehouse size={14} />
                Inventory intelligence
              </div>
              <h1 className="mt-5 max-w-3xl font-[var(--font-heading)] text-[38px] leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Every piece,
                <span className="block text-[#CFA66A]">
                  perfectly accounted for.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-[15px]">
                Variant-level stock, reservations,
                movement history and reorder decisions
                in one private operational atelier.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={initializeCatalogue}
                disabled={isSaving}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/18 bg-white/8 px-5 text-[10px] font-bold uppercase tracking-[0.16em] transition hover:bg-white/14 disabled:opacity-45"
              >
                {isSaving ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <PackageCheck size={15} />
                )}
                Sync catalogue
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadCsv(filteredProducts)
                }
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/18 bg-white/8 px-5 text-[10px] font-bold uppercase tracking-[0.16em] transition hover:bg-white/14"
              >
                <Download size={15} />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() =>
                  importInputRef.current?.click()
                }
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#E2B76F] px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1B1713] shadow-[0_14px_35px_rgba(226,183,111,.22)] transition hover:bg-[#ECC98B]"
              >
                <Upload size={15} />
                Import stock
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={importInventoryCsv}
              />
            </div>
          </div>
        </header>

        <div
          aria-label="Inventory metrics"
          className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5"
        >
          {[
            {
              label: "Available units",
              value: metrics.available.toLocaleString(
                "en-IN"
              ),
              detail: `${metrics.variants} variants`,
              icon: Boxes,
              tone:
                "bg-[#1D1A18] text-white",
            },
            {
              label: "Inventory value",
              value: formatCurrency(
                metrics.value
              ),
              detail: "Available retail value",
              icon: CircleDollarSign,
              tone:
                "bg-[#E7C78F] text-[#251D15]",
            },
            {
              label: "Reserved",
              value: metrics.reserved.toLocaleString(
                "en-IN"
              ),
              detail: "Awaiting fulfilment",
              icon: PackageCheck,
              tone: "bg-white",
            },
            {
              label: "Low stock",
              value: String(metrics.low),
              detail: "Below reorder level",
              icon: AlertTriangle,
              tone: "bg-[#F4EDE3]",
            },
            {
              label: "Out of stock",
              value: String(metrics.out),
              detail: "Immediate attention",
              icon: PackageMinus,
              tone: "bg-[#E7DFFC]",
            },
          ].map((metric) => (
            <article
              key={metric.label}
              className={`min-h-36 rounded-[25px] border border-black/5 p-5 shadow-[0_14px_40px_rgba(48,35,25,.06)] ${metric.tone}`}
            >
              <metric.icon
                size={19}
                className="opacity-70"
              />
              <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.22em] opacity-55">
                {metric.label}
              </p>
              <p className="mt-1 font-[var(--font-heading)] text-3xl leading-none">
                {metric.value}
              </p>
              <p className="mt-2 text-[10px] opacity-55">
                {metric.detail}
              </p>
            </article>
          ))}
        </div>

        {(notice || errorMessage) && (
          <div
            role="status"
            className={`mt-4 flex items-start gap-3 rounded-[20px] border px-4 py-3 text-xs leading-6 ${
              errorMessage
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {errorMessage ? (
              <AlertTriangle size={17} />
            ) : (
              <Check size={17} />
            )}
            <span>
              {errorMessage || notice}
            </span>
            <button
              type="button"
              onClick={() => {
                setNotice("");
                setErrorMessage("");
              }}
              className="ml-auto rounded-full p-1"
              aria-label="Dismiss message"
            >
              <X size={15} />
            </button>
          </div>
        )}

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="overflow-hidden rounded-[30px] border border-[#E2D8CF] bg-[#FCFAF7] shadow-[0_22px_65px_rgba(47,34,25,.07)]">
            <div className="border-b border-[#E7DED5] p-4 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A3733E]">
                    Live stock ledger
                  </p>
                  <h2 className="mt-2 font-[var(--font-heading)] text-3xl">
                    Inventory
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-semibold text-[#776E67]">
                  <ShieldCheck
                    size={15}
                    className="text-emerald-600"
                  />
                  {isPreview
                    ? "Read-only portfolio preview"
                    : "Firestore synchronized"}
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_180px_170px_170px]">
                <label className="relative">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8179]"
                  />
                  <input
                    value={queryText}
                    onChange={(event) => {
                      setQueryText(
                        event.target.value
                      );
                      setPageIndex(0);
                    }}
                    placeholder="Search product, SKU or barcode…"
                    className="h-12 w-full rounded-2xl border border-[#DED4CB] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#A77B47] focus:ring-4 focus:ring-[#A77B47]/10"
                  />
                </label>
                <label className="relative">
                  <Filter
                    size={15}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8179]"
                  />
                  <select
                    value={category}
                    onChange={(event) => {
                      setCategory(
                        event.target.value
                      );
                      setPageIndex(0);
                    }}
                    aria-label="Filter inventory category"
                    className="h-12 w-full appearance-none rounded-2xl border border-[#DED4CB] bg-white pl-10 pr-4 text-xs font-semibold outline-none"
                  >
                    <option value="all">
                      All categories
                    </option>
                    {categories.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="relative">
                  <SlidersHorizontal
                    size={15}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8179]"
                  />
                  <select
                    value={stockFilter}
                    onChange={(event) => {
                      setStockFilter(
                        event.target
                          .value as StockFilter
                      );
                      setPageIndex(0);
                    }}
                    aria-label="Filter inventory state"
                    className="h-12 w-full appearance-none rounded-2xl border border-[#DED4CB] bg-white pl-10 pr-4 text-xs font-semibold outline-none"
                  >
                    <option value="all">
                      All stock states
                    </option>
                    <option value="healthy">
                      Healthy
                    </option>
                    <option value="low">
                      Low stock
                    </option>
                    <option value="out">
                      Out of stock
                    </option>
                  </select>
                </label>
                <label className="relative">
                  <ArrowDownToLine
                    size={15}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8179]"
                  />
                  <select
                    value={sortOrder}
                    onChange={(event) => {
                      setSortOrder(
                        event.target
                          .value as InventorySort
                      );
                      setPageIndex(0);
                    }}
                    aria-label="Sort inventory"
                    className="h-12 w-full appearance-none rounded-2xl border border-[#DED4CB] bg-white pl-10 pr-4 text-xs font-semibold outline-none"
                  >
                    <option value="name">
                      Product name
                    </option>
                    <option value="attention">
                      Needs attention
                    </option>
                    <option value="available_desc">
                      Most available
                    </option>
                    <option value="available_asc">
                      Least available
                    </option>
                    <option value="value_desc">
                      Highest value
                    </option>
                  </select>
                </label>
              </div>
            </div>

            {selectedVariantKeys.size > 0 && (
              <div className="flex flex-col gap-3 border-b border-[#E3D5C6] bg-[#2A2420] px-4 py-4 text-white sm:flex-row sm:items-center sm:px-6">
                <div className="mr-auto">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E0B676]">
                    {selectedVariantKeys.size} variants selected
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    Apply a shared reorder threshold.
                  </p>
                </div>
                <input
                  type="number"
                  min="0"
                  value={reorderDraft}
                  onChange={(event) =>
                    setReorderDraft(
                      event.target.value
                    )
                  }
                  aria-label="Bulk reorder level"
                  className="h-11 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm outline-none sm:w-28"
                />
                <button
                  type="button"
                  onClick={
                    applyBulkReorderLevel
                  }
                  disabled={isSaving}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E2B76F] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1C1713] disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Settings2 size={14} />
                  )}
                  Apply level
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="flex min-h-80 items-center justify-center gap-3 text-sm text-[#776E67]">
                <Loader2
                  className="animate-spin"
                  size={20}
                />
                Synchronizing inventory…
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                <PackageOpen
                  size={34}
                  className="text-[#A67C52]"
                />
                <h3 className="mt-5 font-[var(--font-heading)] text-3xl">
                  No inventory found.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#786F68]">
                  Adjust the filters or add a product
                  from the Products workspace.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[880px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#E8E0D8] text-left text-[8px] font-bold uppercase tracking-[0.2em] text-[#8C8179]">
                        <th className="px-6 py-4">
                          Product
                        </th>
                        <th className="px-4 py-4">
                          Variants
                        </th>
                        <th className="px-4 py-4">
                          Available
                        </th>
                        <th className="px-4 py-4">
                          Reserved
                        </th>
                        <th className="px-4 py-4">
                          Alert
                        </th>
                        <th className="px-6 py-4 text-right">
                          Manage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleProducts.map(
                        (product) => (
                          <tr
                            key={
                              product.documentId
                            }
                            className="border-b border-[#EEE7E0] transition hover:bg-white"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={
                                    product.image
                                  }
                                  alt=""
                                  width={48}
                                  height={56}
                                  className="h-14 w-12 rounded-xl bg-[#EFE8E0] object-cover"
                                />
                                <div>
                                  <p className="max-w-52 truncate text-sm font-semibold">
                                    {
                                      product.name
                                    }
                                  </p>
                                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.17em] text-[#A37643]">
                                    {
                                      product.category
                                    }
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-[var(--font-heading)] text-xl">
                              {
                                product.variants
                                  .length
                              }
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-sm font-bold">
                                {
                                  product
                                    .inventory
                                    .stockAvailable
                                }
                              </p>
                              <p className="mt-1 text-[10px] text-[#8B8179]">
                                {
                                  product
                                    .inventory
                                    .stockOnHand
                                }{" "}
                                on hand
                              </p>
                            </td>
                            <td className="px-4 py-4 text-sm font-semibold">
                              {
                                product
                                  .inventory
                                  .stockReserved
                              }
                            </td>
                            <td className="px-4 py-4">
                              {product
                                .inventory
                                .outOfStockVariants >
                              0 ? (
                                <span className="rounded-full bg-rose-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-rose-700">
                                  {
                                    product
                                      .inventory
                                      .outOfStockVariants
                                  }{" "}
                                  out
                                </span>
                              ) : product
                                  .inventory
                                  .lowStockVariants >
                                0 ? (
                                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-amber-700">
                                  {
                                    product
                                      .inventory
                                      .lowStockVariants
                                  }{" "}
                                  low
                                </span>
                              ) : (
                                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-700">
                                  Healthy
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  openProduct(
                                    product
                                  )
                                }
                                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#DED4CB] bg-white px-4 text-[9px] font-bold uppercase tracking-[0.14em] transition hover:border-[#A77B47]"
                              >
                                Open
                                <ChevronRight
                                  size={14}
                                />
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-3 p-3 lg:hidden">
                  {visibleProducts.map(
                    (product) => (
                      <button
                        type="button"
                        key={product.documentId}
                        onClick={() =>
                          openProduct(product)
                        }
                        className="rounded-[24px] border border-[#E3DAD1] bg-white p-4 text-left shadow-[0_12px_30px_rgba(45,32,22,.05)]"
                      >
                        <div className="flex gap-4">
                          <Image
                            src={product.image}
                            alt=""
                            width={64}
                            height={80}
                            className="h-20 w-16 rounded-2xl bg-[#EFE8E0] object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[8px] font-bold uppercase tracking-[0.19em] text-[#A37643]">
                              {product.category}
                            </p>
                            <h3 className="mt-1 truncate font-[var(--font-heading)] text-xl">
                              {product.name}
                            </h3>
                            <p className="mt-2 text-[10px] text-[#7D746D]">
                              {
                                product.variants
                                  .length
                              }{" "}
                              variants ·{" "}
                              {
                                product.inventory
                                  .stockAvailable
                              }{" "}
                              available
                            </p>
                          </div>
                          <ChevronRight
                            size={18}
                            className="mt-1 text-[#8D837B]"
                          />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <span className="rounded-xl bg-[#F5F1EC] px-3 py-2 text-center text-[9px] font-bold">
                            {
                              product.inventory
                                .stockReserved
                            }{" "}
                            reserved
                          </span>
                          <span className="rounded-xl bg-amber-50 px-3 py-2 text-center text-[9px] font-bold text-amber-700">
                            {
                              product.inventory
                                .lowStockVariants
                            }{" "}
                            low
                          </span>
                          <span className="rounded-xl bg-rose-50 px-3 py-2 text-center text-[9px] font-bold text-rose-700">
                            {
                              product.inventory
                                .outOfStockVariants
                            }{" "}
                            out
                          </span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </>
            )}
            {filteredProducts.length >
              pageSize && (
              <div className="flex items-center justify-between border-t border-[#E8E0D8] px-4 py-4 sm:px-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8B8179]">
                  Page {safePageIndex + 1} of{" "}
                  {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={
                      safePageIndex === 0
                    }
                    onClick={() =>
                      setPageIndex(
                        (current) =>
                          Math.max(
                            0,
                            current - 1
                          )
                      )
                    }
                    className="min-h-11 rounded-full border border-[#DDD3CA] bg-white px-4 text-[9px] font-bold uppercase tracking-[0.14em] disabled:opacity-35"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={
                      safePageIndex >=
                      totalPages - 1
                    }
                    onClick={() =>
                      setPageIndex(
                        (current) =>
                          Math.min(
                            totalPages - 1,
                            current + 1
                          )
                      )
                    }
                    className="min-h-11 rounded-full bg-[#211D1A] px-5 text-[9px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-35"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>

          <aside className="rounded-[30px] bg-[#201C19] p-5 text-white shadow-[0_22px_65px_rgba(31,25,21,.16)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-[#D8AD6B]">
                  Movement journal
                </p>
                <h2 className="mt-2 font-[var(--font-heading)] text-3xl">
                  House pulse
                </h2>
              </div>
              <History
                size={20}
                className="text-[#D8AD6B]"
              />
            </div>
            <div className="mt-6 space-y-3">
              {movements.length === 0 ? (
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-6 text-center">
                  <Clock3
                    size={22}
                    className="mx-auto text-white/45"
                  />
                  <p className="mt-3 text-xs text-white/50">
                    Stock movements will appear
                    here.
                  </p>
                </div>
              ) : (
                movements
                  .slice(0, 8)
                  .map((movement) => (
                    <article
                      key={movement.id}
                      className="rounded-[20px] border border-white/9 bg-white/[0.045] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${movementTone(
                            movement.type
                          )}`}
                        >
                          {movement.type.includes(
                            "increase"
                          ) ||
                          movement.type ===
                            "stock_received" ||
                          movement.type ===
                            "returned" ? (
                            <ArrowDownToLine
                              size={15}
                            />
                          ) : (
                            <ArrowUpFromLine
                              size={15}
                            />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold">
                            {
                              movement.productName
                            }
                          </p>
                          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#D9B378]">
                            {movement.sku} ·{" "}
                            {movement.quantity} units
                          </p>
                          <p className="mt-2 line-clamp-2 text-[10px] leading-5 text-white/46">
                            {movement.reason}
                          </p>
                          <p className="mt-2 text-[9px] text-white/32">
                            {formatDate(
                              movement.createdAt
                            )}{" "}
                            · {movement.actorName}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))
              )}
            </div>
          </aside>
        </div>
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-end bg-black/45 backdrop-blur-sm lg:items-stretch"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedProduct(null);
            }
          }}
        >
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-drawer-title"
            tabIndex={-1}
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-[34px] bg-[#F8F4EF] shadow-[-30px_0_90px_rgba(21,17,14,.24)] outline-none lg:max-h-none lg:max-w-[850px] lg:rounded-none"
          >
            <header className="sticky top-0 z-10 border-b border-[#DED4CB] bg-[#F8F4EF]/95 px-5 py-5 backdrop-blur-xl sm:px-7">
              <div className="flex items-start gap-4">
                <Image
                  src={selectedProduct.image}
                  alt=""
                  width={56}
                  height={64}
                  className="h-16 w-14 rounded-2xl bg-[#E9E1D9] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#A2713B]">
                    Variant atelier
                  </p>
                  <h2
                    id="inventory-drawer-title"
                    className="mt-1 truncate font-[var(--font-heading)] text-2xl sm:text-3xl"
                  >
                    {selectedProduct.name}
                  </h2>
                  <p className="mt-1 text-[10px] text-[#7C736C]">
                    {
                      selectedProduct.variants
                        .length
                    }{" "}
                    variants ·{" "}
                    {
                      selectedProduct
                        .inventory
                        .stockAvailable
                    }{" "}
                    available
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedProduct(null)
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDD3CA] bg-white"
                  aria-label="Close inventory drawer"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="space-y-5 p-4 pb-28 sm:p-7">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  [
                    "On hand",
                    selectedProduct.inventory
                      .stockOnHand,
                  ],
                  [
                    "Reserved",
                    selectedProduct.inventory
                      .stockReserved,
                  ],
                  [
                    "Available",
                    selectedProduct.inventory
                      .stockAvailable,
                  ],
                  [
                    "Sold",
                    selectedProduct.inventory
                      .stockSold,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[20px] border border-[#E2D8CF] bg-white p-4"
                  >
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#8B8179]">
                      {label}
                    </p>
                    <p className="mt-2 font-[var(--font-heading)] text-3xl">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <section className="rounded-[26px] border border-[#DED4CB] bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#A2713B]">
                      Size · colour · SKU
                    </p>
                    <h3 className="mt-2 font-[var(--font-heading)] text-2xl">
                      Variant matrix
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const index =
                        variantDrafts.length + 1;
                      setVariantDrafts(
                        (current) => [
                          ...current,
                          {
                            id: `variant-${Date.now()}`,
                            sku: `${selectedProduct.name
                              .slice(0, 3)
                              .toUpperCase()}-NEW-${index}`,
                            barcode: "",
                            size: "One Size",
                            colorName:
                              "As Shown",
                            colorValue:
                              "#A3A3A3",
                            image:
                              selectedProduct.image,
                            price:
                              selectedProduct.price,
                            stockOnHand: 0,
                            stockReserved: 0,
                            stockSold: 0,
                            stockReturned: 0,
                            stockDamaged: 0,
                            reorderLevel: 5,
                          },
                        ]
                      );
                    }}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#D7CBC0] px-4 text-[9px] font-bold uppercase tracking-[0.14em]"
                  >
                    <Plus size={14} />
                    Add variant
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {variantDrafts.map(
                    (variant, index) => {
                      const original =
                        selectedProduct.variants.find(
                          (item) =>
                            item.id ===
                            variant.id
                        );
                      const key = `${selectedProduct.documentId}::${variant.id}`;

                      return (
                        <article
                          key={variant.id}
                          className="rounded-[20px] border border-[#E5DDD5] bg-[#FAF7F3] p-4"
                        >
                          <div className="flex items-start gap-3">
                            {original && (
                              <input
                                type="checkbox"
                                checked={selectedVariantKeys.has(
                                  key
                                )}
                                onChange={() =>
                                  toggleVariantSelection(
                                    selectedProduct.documentId,
                                    variant.id
                                  )
                                }
                                aria-label={`Select ${variant.sku}`}
                                className="mt-3 h-4 w-4 accent-[#A77B47]"
                              />
                            )}
                            <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                              <label>
                                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#877C74]">
                                  SKU
                                </span>
                                <input
                                  value={
                                    variant.sku
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateVariant(
                                      index,
                                      "sku",
                                      event.target
                                        .value
                                    )
                                  }
                                  className="mt-1.5 h-11 w-full rounded-xl border border-[#DDD3CA] bg-white px-3 text-xs font-semibold uppercase outline-none focus:border-[#A77B47]"
                                />
                              </label>
                              <label>
                                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#877C74]">
                                  Price
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  value={
                                    variant.price
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateVariant(
                                      index,
                                      "price",
                                      Number(
                                        event.target
                                          .value
                                      )
                                    )
                                  }
                                  className="mt-1.5 h-11 w-full rounded-xl border border-[#DDD3CA] bg-white px-3 text-xs font-semibold outline-none focus:border-[#A77B47]"
                                />
                              </label>
                              <label>
                                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#877C74]">
                                  Size
                                </span>
                                <input
                                  value={
                                    variant.size
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateVariant(
                                      index,
                                      "size",
                                      event.target
                                        .value
                                    )
                                  }
                                  className="mt-1.5 h-11 w-full rounded-xl border border-[#DDD3CA] bg-white px-3 text-xs outline-none focus:border-[#A77B47]"
                                />
                              </label>
                              <label>
                                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#877C74]">
                                  Colour
                                </span>
                                <input
                                  value={
                                    variant.colorName
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateVariant(
                                      index,
                                      "colorName",
                                      event.target
                                        .value
                                    )
                                  }
                                  className="mt-1.5 h-11 w-full rounded-xl border border-[#DDD3CA] bg-white px-3 text-xs outline-none focus:border-[#A77B47]"
                                />
                              </label>
                              <label>
                                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#877C74]">
                                  Barcode
                                </span>
                                <div className="relative mt-1.5">
                                  <Barcode
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#938981]"
                                  />
                                  <input
                                    value={
                                      variant.barcode
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateVariant(
                                        index,
                                        "barcode",
                                        event.target
                                          .value
                                      )
                                    }
                                    className="h-11 w-full rounded-xl border border-[#DDD3CA] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#A77B47]"
                                  />
                                </div>
                              </label>
                              <label className="sm:col-span-2 lg:col-span-5">
                                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#877C74]">
                                  Variant image URL
                                </span>
                                <input
                                  value={variant.image}
                                  onChange={(event) =>
                                    updateVariant(
                                      index,
                                      "image",
                                      event.target.value
                                    )
                                  }
                                  placeholder="Optional — falls back to the main product image"
                                  className="mt-1.5 h-11 w-full rounded-xl border border-[#DDD3CA] bg-white px-3 text-xs outline-none focus:border-[#A77B47]"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#E6DED6] pt-3 sm:grid-cols-6">
                            {[
                              [
                                "On hand",
                                variant.stockOnHand,
                              ],
                              [
                                "Reserved",
                                variant.stockReserved,
                              ],
                              [
                                "Sold",
                                variant.stockSold,
                              ],
                              [
                                "Returned",
                                variant.stockReturned,
                              ],
                              [
                                "Damaged",
                                variant.stockDamaged,
                              ],
                            ].map(
                              ([label, value]) => (
                                <div
                                  key={label}
                                >
                                  <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-[#988D85]">
                                    {label}
                                  </p>
                                  <p className="mt-1 text-sm font-bold">
                                    {value}
                                  </p>
                                </div>
                              )
                            )}
                            <label>
                              <span className="text-[7px] font-bold uppercase tracking-[0.13em] text-[#988D85]">
                                Reorder
                              </span>
                              <input
                                type="number"
                                min="0"
                                value={
                                  variant.reorderLevel
                                }
                                onChange={(event) =>
                                  updateVariant(
                                    index,
                                    "reorderLevel",
                                    Number(
                                      event.target
                                        .value
                                    )
                                  )
                                }
                                className="mt-1 h-8 w-full rounded-lg border border-[#DED5CC] bg-white px-2 text-xs font-bold"
                              />
                            </label>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {original && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAdjustmentVariant(
                                    original
                                  );
                                  setAdjustmentReason(
                                    ""
                                  );
                                }}
                                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#211D1A] px-4 text-[9px] font-bold uppercase tracking-[0.13em] text-white"
                              >
                                <RefreshCcw
                                  size={13}
                                />
                                Adjust stock
                              </button>
                            )}
                            {variantDrafts.length >
                              1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setVariantDrafts(
                                    (current) =>
                                      current.filter(
                                        (
                                          _,
                                          variantIndex
                                        ) =>
                                          variantIndex !==
                                          index
                                      )
                                  )
                                }
                                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-rose-200 px-4 text-[9px] font-bold uppercase tracking-[0.13em] text-rose-700"
                              >
                                <X size={13} />
                                Remove
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>

                <button
                  type="button"
                  onClick={saveVariants}
                  disabled={isSaving}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1C1917,#3A2F37)] px-6 text-[10px] font-bold uppercase tracking-[0.17em] text-white shadow-[0_16px_35px_rgba(31,25,22,.18)] disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Sparkles size={15} />
                  )}
                  Save variant matrix
                </button>
              </section>
            </div>
          </div>
        </div>
      )}

      {selectedProduct &&
        adjustmentVariant && (
          <div className="fixed inset-0 z-[140] flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-5">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="adjustment-title"
              className="w-full max-w-lg rounded-t-[32px] bg-[#FBF8F4] p-5 shadow-[0_35px_100px_rgba(0,0,0,.3)] sm:rounded-[32px] sm:p-7"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#A2713B]">
                    Controlled movement
                  </p>
                  <h2
                    id="adjustment-title"
                    className="mt-2 font-[var(--font-heading)] text-3xl"
                  >
                    Adjust inventory
                  </h2>
                  <p className="mt-2 text-xs text-[#776D65]">
                    {adjustmentVariant.sku} ·{" "}
                    {adjustmentVariant.size} ·{" "}
                    {
                      adjustmentVariant.colorName
                    }
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setAdjustmentVariant(null)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD3CA] bg-white"
                  aria-label="Close adjustment"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#837870]">
                    Movement type
                  </span>
                  <select
                    value={adjustmentType}
                    onChange={(event) =>
                      setAdjustmentType(
                        event.target
                          .value as AdjustmentType
                      )
                    }
                    className="mt-2 h-12 w-full rounded-2xl border border-[#DCD2C9] bg-white px-4 text-xs font-semibold outline-none"
                  >
                    {Object.entries(
                      ADJUSTMENT_LABELS
                    ).map(
                      ([value, label]) => (
                        <option
                          key={value}
                          value={value}
                        >
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </label>
                <label>
                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#837870]">
                    Quantity
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={adjustmentQuantity}
                    onChange={(event) =>
                      setAdjustmentQuantity(
                        event.target.value
                      )
                    }
                    className="mt-2 h-12 w-full rounded-2xl border border-[#DCD2C9] bg-white px-4 text-sm font-bold outline-none"
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#837870]">
                  Mandatory reason
                </span>
                <textarea
                  value={adjustmentReason}
                  onChange={(event) =>
                    setAdjustmentReason(
                      event.target.value
                    )
                  }
                  placeholder="New shipment received, damaged during inspection…"
                  className="mt-2 h-24 w-full resize-none rounded-2xl border border-[#DCD2C9] bg-white p-4 text-sm leading-6 outline-none focus:border-[#A77B47]"
                />
              </label>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setAdjustmentVariant(null)
                  }
                  className="min-h-12 flex-1 rounded-2xl border border-[#D9CFC6] text-[9px] font-bold uppercase tracking-[0.15em]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitAdjustment}
                  disabled={isSaving}
                  className="inline-flex min-h-12 flex-[1.5] items-center justify-center gap-2 rounded-2xl bg-[#1D1917] text-[9px] font-bold uppercase tracking-[0.15em] text-white disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <FileSpreadsheet
                      size={14}
                    />
                  )}
                  Record movement
                </button>
              </div>
            </section>
          </div>
        )}
    </section>
  );
}
