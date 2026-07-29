import {
  arrayUnion,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import {
  products as catalogueProducts,
  type Product,
} from "@/data/products";
import { db } from "@/lib/firebase";
import {
  calculateInventorySummary,
  getInventoryVariantDocumentId,
  getVariantStatus,
  normalizeVariant,
} from "@/lib/inventory";
import {
  subscribeToAdminProducts,
  type AdminProductRecord,
} from "@/services/product.service";
import type {
  InventoryActor,
  InventoryAdjustmentInput,
  InventoryMovement,
  InventoryMovementType,
  InventoryProduct,
  InventoryVariantDraft,
  ProductVariant,
} from "@/types/inventory";

export const INVENTORY_MOVEMENTS_PAGE_SIZE = 40;
export const MAX_INVENTORY_BULK_ACTION = 25;

function getCatalogueProductSeed(
  productId: string
): Product | null {
  return (
    catalogueProducts.find(
      (product) =>
        String(product.id) === productId
    ) ?? null
  );
}

function buildCatalogueProductDocument(
  product: Product,
  actor: InventoryActor
) {
  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    title: product.title,
    category: product.category,
    subcategory: product.subcategory,
    brand: product.brand,
    badge: product.badge ?? "",
    image: product.image,
    images: product.images,
    price: product.price,
    oldPrice: product.oldPrice ?? 0,
    rating: product.rating,
    reviewCount: product.reviewCount,
    featured: product.featured,
    isNew: product.isNew,
    shortDescription:
      product.shortDescription,
    description: product.description,
    sizes: product.sizes,
    colors: product.colors,
    features: product.features,
    specifications:
      product.specifications,
    material: product.material,
    careInstructions:
      product.careInstructions,
    deliveryInformation:
      product.deliveryInformation,
    returnPolicy: product.returnPolicy,
    reviews: product.reviews,
    status: "published",
    createdBy: actor.uid,
    createdAt: serverTimestamp(),
  };
}

function cleanText(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function safeInteger(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.max(0, Math.floor(parsed))
    : 0;
}

function readDate(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }

  return "";
}

function mapInventoryProduct(
  product: AdminProductRecord
): InventoryProduct {
  const variants =
    product.variants ?? [];

  return {
    documentId: product.documentId,
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    subcategory: product.subcategory,
    image: product.image,
    price: product.price,
    status: product.status,
    variants,
    inventory:
      product.inventory ??
      calculateInventorySummary(variants),
  };
}

function normalizeMovement(
  snapshot: QueryDocumentSnapshot<DocumentData>
): InventoryMovement | null {
  const data = snapshot.data();
  const type = cleanText(
    data.type
  ) as InventoryMovementType;
  const productId = cleanText(data.productId);
  const variantId = cleanText(data.variantId);

  if (!type || !productId || !variantId) {
    return null;
  }

  return {
    id: snapshot.id,
    productId,
    productName: cleanText(data.productName),
    variantId,
    sku: cleanText(data.sku),
    type,
    quantity: safeInteger(data.quantity),
    previousOnHand: safeInteger(
      data.previousOnHand
    ),
    nextOnHand: safeInteger(data.nextOnHand),
    previousReserved: safeInteger(
      data.previousReserved
    ),
    nextReserved: safeInteger(
      data.nextReserved
    ),
    reason: cleanText(data.reason),
    orderId: cleanText(data.orderId),
    actorUid: cleanText(data.actorUid),
    actorName: cleanText(data.actorName),
    createdAt: readDate(data.createdAt),
  };
}

function validateActor(actor: InventoryActor) {
  if (!actor.uid.trim()) {
    throw new Error(
      "A verified administrator is required."
    );
  }
}

function validateVariants(
  variants: InventoryVariantDraft[]
) {
  if (
    variants.length === 0 ||
    variants.length > 40
  ) {
    throw new Error(
      "A product must contain between 1 and 40 variants."
    );
  }

  const skuSet = new Set<string>();
  const idSet = new Set<string>();
  const barcodeSet = new Set<string>();

  const normalized = variants.map(
    (variant) => {
      const nextVariant = normalizeVariant(
        variant
      );

      if (!nextVariant) {
        throw new Error(
          "Every variant requires a valid ID and SKU."
        );
      }

      if (
        skuSet.has(nextVariant.sku) ||
        idSet.has(nextVariant.id)
      ) {
        throw new Error(
          `Duplicate variant detected: ${nextVariant.sku}.`
        );
      }

      if (
        nextVariant.barcode &&
        barcodeSet.has(
          nextVariant.barcode.toLowerCase()
        )
      ) {
        throw new Error(
          `Duplicate barcode detected: ${nextVariant.barcode}.`
        );
      }

      if (
        nextVariant.stockReserved >
        nextVariant.stockOnHand
      ) {
        throw new Error(
          `${nextVariant.sku} has more reserved stock than on-hand stock.`
        );
      }

      skuSet.add(nextVariant.sku);
      idSet.add(nextVariant.id);
      if (nextVariant.barcode) {
        barcodeSet.add(
          nextVariant.barcode.toLowerCase()
        );
      }

      return nextVariant;
    }
  );

  return normalized;
}

export function subscribeToInventoryProducts(
  onProducts: (products: InventoryProduct[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  let products: AdminProductRecord[] = [];
  let variantDocuments =
    new Map<string, ProductVariant[]>();

  const emit = () => {
    onProducts(
      products
        .map((product) => {
          const base =
            mapInventoryProduct(product);
          const liveVariants =
            variantDocuments.get(
              product.documentId
            );
          const variants =
            liveVariants?.length
              ? liveVariants
              : base.variants;

          return {
            ...base,
            variants,
            inventory:
              calculateInventorySummary(
                variants
              ),
          };
        })
        .sort((first, second) =>
          first.name.localeCompare(second.name)
        )
    );
  };

  const unsubscribeProducts =
    subscribeToAdminProducts(
      (nextProducts) => {
        products = nextProducts;
        emit();
      },
      onError
    );
  const unsubscribeVariants = onSnapshot(
    collection(db, "inventoryVariants"),
    (snapshot) => {
      const next = new Map<
        string,
        ProductVariant[]
      >();

      snapshot.docs.forEach((document) => {
        const data = document.data();
        const productId =
          cleanText(data.productId);
        const variant = normalizeVariant(
          data
        );

        if (!productId || !variant) {
          return;
        }

        const variants =
          next.get(productId) ?? [];
        variants.push(variant);
        next.set(productId, variants);
      });

      variantDocuments = next;
      emit();
    },
    (error) => onError?.(error)
  );

  return () => {
    unsubscribeProducts();
    unsubscribeVariants();
  };
}

export function subscribeToInventoryMovements(
  onMovements: (
    movements: InventoryMovement[]
  ) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const movementQuery = query(
    collection(db, "inventoryMovements"),
    orderBy("createdAt", "desc"),
    limit(INVENTORY_MOVEMENTS_PAGE_SIZE)
  );

  return onSnapshot(
    movementQuery,
    (snapshot) => {
      onMovements(
        snapshot.docs
          .map(normalizeMovement)
          .filter(
            (
              movement
            ): movement is InventoryMovement =>
              movement !== null
          )
      );
    },
    (error) => onError?.(error)
  );
}

export async function saveProductVariants({
  productId,
  variants,
  actor,
}: {
  productId: string;
  variants: InventoryVariantDraft[];
  actor: InventoryActor;
}) {
  validateActor(actor);
  const normalized =
    validateVariants(variants);
  const productReference = doc(
    db,
    "products",
    productId
  );

  await runTransaction(
    db,
    async (transaction) => {
      const productSnapshot =
        await transaction.get(
          productReference
        );

      const catalogueSeed =
        getCatalogueProductSeed(productId);

      if (
        !productSnapshot.exists() &&
        !catalogueSeed
      ) {
        throw new Error(
          "This product no longer exists."
        );
      }

      const productData =
        productSnapshot.exists()
          ? productSnapshot.data()
          : catalogueSeed!;
      const currentVariants = Array.isArray(
        productData.variants
      )
        ? productData.variants
            .map((variant) =>
              normalizeVariant(variant)
            )
            .filter(
              (
                variant
              ): variant is ProductVariant =>
                variant !== null
            )
        : [];
      const nextSkuKeys = new Set(
        normalized.map((variant) =>
          variant.sku.toLowerCase()
        )
      );
      const removedSkuKeys =
        currentVariants
          .map((variant) =>
            variant.sku.toLowerCase()
          )
          .filter(
            (sku) => !nextSkuKeys.has(sku)
          );
      const nextBarcodeKeys = new Set(
        normalized
          .map((variant) =>
            variant.barcode.toLowerCase()
          )
          .filter(Boolean)
      );
      const removedBarcodeKeys =
        currentVariants
          .map((variant) =>
            variant.barcode.toLowerCase()
          )
          .filter(
            (barcode) =>
              barcode &&
              !nextBarcodeKeys.has(barcode)
          );
      const skuReferences =
        normalized.map((variant) => ({
          variant,
          reference: doc(
            db,
            "inventorySkus",
            variant.sku.toLowerCase()
          ),
        }));
      const skuSnapshots =
        await Promise.all(
          skuReferences.map(({ reference }) =>
            transaction.get(reference)
          )
        );
      const barcodeReferences =
        normalized
          .filter(
            (variant) =>
              variant.barcode.length > 0
          )
          .map((variant) => ({
            variant,
            reference: doc(
              db,
              "inventoryBarcodes",
              variant.barcode.toLowerCase()
            ),
          }));
      const barcodeSnapshots =
        await Promise.all(
          barcodeReferences.map(
            ({ reference }) =>
              transaction.get(reference)
          )
        );

      skuSnapshots.forEach(
        (snapshot, index) => {
          if (
            snapshot.exists() &&
            cleanText(
              snapshot.data().productId
            ) !== productId
          ) {
            throw new Error(
              `SKU ${skuReferences[index].variant.sku} already belongs to another product.`
            );
          }
        }
      );
      barcodeSnapshots.forEach(
        (snapshot, index) => {
          if (
            snapshot.exists() &&
            cleanText(
              snapshot.data().productId
            ) !== productId
          ) {
            throw new Error(
              `Barcode ${barcodeReferences[index].variant.barcode} already belongs to another product.`
            );
          }
        }
      );

      const summary =
        calculateInventorySummary(
          normalized
        );

      const inventoryAuditEntry = {
        id: `inventory-${Date.now()}-variants`,
        action:
          "variant_configuration_updated",
        detail: `${normalized.length} inventory variants saved.`,
        actorUid: actor.uid,
        actorName: actor.displayName,
        createdAt:
          new Date().toISOString(),
      };
      const inventoryUpdate = {
          variants: normalized,
          inventory: {
            ...summary,
            updatedAt: serverTimestamp(),
          },
          inventoryUpdatedAt:
            serverTimestamp(),
          stock: summary.stockAvailable,
          updatedAt: serverTimestamp(),
          lastInventoryAction: {
            action:
              "variant_configuration_updated",
            actorUid: actor.uid,
            actorName: actor.displayName,
            createdAt:
              new Date().toISOString(),
          },
        };

      if (productSnapshot.exists()) {
        transaction.update(
          productReference,
          {
            ...inventoryUpdate,
            auditTrail: arrayUnion(
              inventoryAuditEntry
            ),
          }
        );
      } else {
        transaction.set(
          productReference,
          {
            ...buildCatalogueProductDocument(
              catalogueSeed!,
              actor
            ),
            ...inventoryUpdate,
            auditTrail: [
              inventoryAuditEntry,
            ],
          }
        );
      }

      skuReferences.forEach(
        ({ variant, reference }) => {
          transaction.set(reference, {
            sku: variant.sku,
            productId,
            variantId: variant.id,
            updatedAt: serverTimestamp(),
          });
        }
      );

      removedSkuKeys.forEach((sku) => {
        transaction.delete(
          doc(db, "inventorySkus", sku)
        );
      });
      barcodeReferences.forEach(
        ({ variant, reference }) => {
          transaction.set(reference, {
            barcode: variant.barcode,
            productId,
            variantId: variant.id,
            updatedAt: serverTimestamp(),
          });
        }
      );
      removedBarcodeKeys.forEach(
        (barcode) => {
          transaction.delete(
            doc(
              db,
              "inventoryBarcodes",
              barcode
            )
          );
        }
      );

      normalized.forEach((variant) => {
        transaction.set(
          doc(
            db,
            "inventoryVariants",
            getInventoryVariantDocumentId(
              productId,
              variant.id
            )
          ),
          {
            productId,
            productName: cleanText(
              productData.name ??
                productData.title
            ),
            variantId: variant.id,
            sku: variant.sku,
            barcode: variant.barcode,
            size: variant.size,
            colorName: variant.colorName,
            colorValue: variant.colorValue,
            image: variant.image,
            price: variant.price,
            stockOnHand:
              variant.stockOnHand,
            stockReserved:
              variant.stockReserved,
            stockSold: variant.stockSold,
            stockReturned:
              variant.stockReturned,
            stockDamaged:
              variant.stockDamaged,
            reorderLevel:
              variant.reorderLevel,
            status: variant.status,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      currentVariants
        .filter(
          (variant) =>
            !normalized.some(
              (nextVariant) =>
                nextVariant.id ===
                variant.id
            )
        )
        .forEach((variant) => {
          transaction.delete(
            doc(
              db,
              "inventoryVariants",
              getInventoryVariantDocumentId(
                productId,
                variant.id
              )
            )
          );
        });
    }
  );
}

export async function adjustInventory({
  movementId,
  productId,
  variantId,
  quantity,
  type,
  reason,
  actor,
}: InventoryAdjustmentInput) {
  validateActor(actor);

  if (
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    throw new Error(
      "Adjustment quantity must be greater than zero."
    );
  }

  if (reason.trim().length < 3) {
    throw new Error(
      "Add a clear reason for this stock adjustment."
    );
  }

  const productReference = doc(
    db,
    "products",
    productId
  );
  const movementReference = movementId
    ? doc(db, "inventoryMovements", movementId.replace(/[^a-zA-Z0-9_-]/g, "_"))
    : doc(collection(db, "inventoryMovements"));

  await runTransaction(
    db,
    async (transaction) => {
      const movementSnapshot = await transaction.get(movementReference);
      const snapshot = await transaction.get(productReference);

      if (movementSnapshot.exists()) return;

      if (!snapshot.exists()) {
        throw new Error(
          "This product no longer exists."
        );
      }

      const data = snapshot.data();
      const variants = Array.isArray(
        data.variants
      )
        ? data.variants
            .map((variant) =>
              normalizeVariant(variant)
            )
            .filter(
              (
                variant
              ): variant is ProductVariant =>
                variant !== null
            )
        : [];
      const index = variants.findIndex(
        (variant) =>
          variant.id === variantId
      );

      if (index < 0) {
        throw new Error(
          "This inventory variant no longer exists."
        );
      }

      const current = variants[index];
      const next = { ...current };
      const safeQuantity = Math.floor(
        quantity
      );
      const increasesStock =
        type === "stock_received" ||
        type === "manual_increase" ||
        type === "returned";

      if (increasesStock) {
        next.stockOnHand += safeQuantity;
      } else {
        const available =
          current.stockOnHand -
          current.stockReserved;

        if (available < safeQuantity) {
          throw new Error(
            `Only ${Math.max(0, available)} units are available for this adjustment.`
          );
        }

        next.stockOnHand -= safeQuantity;
      }

      if (type === "returned") {
        next.stockReturned += safeQuantity;
      }

      if (type === "damaged") {
        next.stockDamaged += safeQuantity;
      }

      next.status = getVariantStatus(
        next,
        current.status === "archived"
      );
      variants[index] = next;
      const summary =
        calculateInventorySummary(variants);
      const now = new Date().toISOString();

      transaction.update(
        productReference,
        {
          variants,
          inventory: {
            ...summary,
            updatedAt: serverTimestamp(),
          },
          inventoryUpdatedAt:
            serverTimestamp(),
          stock: summary.stockAvailable,
          updatedAt: serverTimestamp(),
          lastInventoryAction: {
            action: type,
            actorUid: actor.uid,
            actorName: actor.displayName,
            createdAt: now,
          },
          auditTrail: arrayUnion({
            id: movementReference.id,
            action: `inventory_${type}`,
            detail: `${safeQuantity} unit(s): ${reason.trim()}`,
            actorUid: actor.uid,
            actorName: actor.displayName,
            createdAt: now,
          }),
        }
      );

      transaction.set(
        movementReference,
        {
          productId,
          productName: cleanText(
            data.name ?? data.title
          ),
          variantId,
          sku: current.sku,
          type,
          quantity: safeQuantity,
          previousOnHand:
            current.stockOnHand,
          nextOnHand: next.stockOnHand,
          previousReserved:
            current.stockReserved,
          nextReserved: next.stockReserved,
          reason: reason.trim(),
          orderId: "",
          actorUid: actor.uid,
          actorName: actor.displayName,
          createdAt: serverTimestamp(),
        }
      );

      transaction.set(
        doc(
          db,
          "inventoryVariants",
          getInventoryVariantDocumentId(
            productId,
            variantId
          )
        ),
        {
          productId,
          productName: cleanText(
            data.name ?? data.title
          ),
          variantId,
          sku: next.sku,
          barcode: next.barcode,
          size: next.size,
          colorName: next.colorName,
          colorValue: next.colorValue,
          image: next.image,
          price: next.price,
          stockOnHand: next.stockOnHand,
          stockReserved:
            next.stockReserved,
          stockSold: next.stockSold,
          stockReturned:
            next.stockReturned,
          stockDamaged:
            next.stockDamaged,
          reorderLevel:
            next.reorderLevel,
          status: next.status,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  );
}

export async function bulkSetReorderLevel({
  targets,
  reorderLevel,
  actor,
}: {
  targets: {
    productId: string;
    variantId: string;
  }[];
  reorderLevel: number;
  actor: InventoryActor;
}) {
  validateActor(actor);

  if (
    targets.length === 0 ||
    targets.length >
      MAX_INVENTORY_BULK_ACTION
  ) {
    throw new Error(
      `Select between 1 and ${MAX_INVENTORY_BULK_ACTION} variants.`
    );
  }

  const nextLevel = safeInteger(
    reorderLevel
  );
  const grouped = new Map<
    string,
    Set<string>
  >();

  targets.forEach(
    ({ productId, variantId }) => {
      const ids =
        grouped.get(productId) ??
        new Set<string>();
      ids.add(variantId);
      grouped.set(productId, ids);
    }
  );

  for (const [
    productId,
    variantIds,
  ] of grouped) {
    const productReference = doc(
      db,
      "products",
      productId
    );

    await runTransaction(
      db,
      async (transaction) => {
        const snapshot =
          await transaction.get(
            productReference
          );

        if (!snapshot.exists()) {
          throw new Error(
            "A selected product no longer exists."
          );
        }

        const variants = Array.isArray(
          snapshot.data().variants
        )
          ? snapshot
              .data()
              .variants.map(
                (variant: unknown) =>
                  normalizeVariant(variant)
              )
              .filter(
                (
                  variant: ProductVariant | null
                ): variant is ProductVariant =>
                  variant !== null
              )
          : [];

        variants.forEach(
          (variant: ProductVariant) => {
          if (
            variantIds.has(variant.id)
          ) {
            variant.reorderLevel =
              nextLevel;
            variant.status =
              getVariantStatus(
                variant,
                variant.status ===
                  "archived"
              );
          }
          }
        );

        const summary =
          calculateInventorySummary(
            variants
          );

        transaction.update(
          productReference,
          {
            variants,
            inventory: {
              ...summary,
              updatedAt:
                serverTimestamp(),
            },
            inventoryUpdatedAt:
              serverTimestamp(),
            stock:
              summary.stockAvailable,
            updatedAt: serverTimestamp(),
            auditTrail: arrayUnion({
              id: `inventory-${Date.now()}-reorder`,
              action:
                "inventory_reorder_level_updated",
              detail: `Reorder level set to ${nextLevel}.`,
              actorUid: actor.uid,
              actorName:
                actor.displayName,
              createdAt:
                new Date().toISOString(),
            }),
          }
        );
      }
    );
  }
}

export async function initializeInventoryCatalogue({
  products,
  actor,
  onProgress,
}: {
  products: InventoryProduct[];
  actor: InventoryActor;
  onProgress?: (
    completed: number,
    total: number
  ) => void;
}) {
  validateActor(actor);

  for (
    let index = 0;
    index < products.length;
    index += 1
  ) {
    const product = products[index];

    await saveProductVariants({
      productId: product.documentId,
      variants: product.variants.map(
        (variant) => ({
          id: variant.id,
          sku: variant.sku,
          barcode: variant.barcode,
          size: variant.size,
          colorName: variant.colorName,
          colorValue: variant.colorValue,
          image: variant.image,
          price: variant.price,
          stockOnHand:
            variant.stockOnHand,
          stockReserved:
            variant.stockReserved,
          stockSold: variant.stockSold,
          stockReturned:
            variant.stockReturned,
          stockDamaged:
            variant.stockDamaged,
          reorderLevel:
            variant.reorderLevel,
        })
      ),
      actor,
    });
    onProgress?.(
      index + 1,
      products.length
    );
  }
}
