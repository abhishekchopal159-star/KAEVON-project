import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import {
  type Product,
  type ProductBadge,
  type ProductCategory,
} from "@/data/products";
import { db, storage } from "@/lib/firebase";
import {
  calculateInventorySummary,
  createDefaultVariants,
  getInventoryVariantDocumentId,
  getVariantStatus,
  normalizeVariant,
} from "@/lib/inventory";

export type ProductPublishingStatus =
  | "draft"
  | "published"
  | "archived";

export type AdminProductRecord = Product & {
  documentId: string;
  status: ProductPublishingStatus;
  createdBy: string;
};

export type CreateAdminProductInput = {
  name: string;
  sku: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  oldPrice?: number;
  stock: number;
  badge?: ProductBadge;
  description: string;
  shortDescription: string;
  material: string;
  videoUrl: string;
  modelHeight: string;
  modelWornSize: string;
  modelMeasurements: string;
  sizes: string[];
  colorName: string;
  colorValue: string;
  featured: boolean;
  status: ProductPublishingStatus;
  imageFiles: File[];
  createdBy: string;
};

export type UpdateAdminProductInput =
  Omit<
    CreateAdminProductInput,
    "createdBy"
  > & {
    documentId: string;
    id: number;
    existingImages: string[];
  };

const PRODUCT_CATEGORIES = new Set<ProductCategory>([
  "MEN",
  "WOMEN",
  "STREETWEAR",
  "FOOTWEAR",
  "ACCESSORIES",
  "WINTER",
]);

const PRODUCT_BADGES = new Set<ProductBadge>([
  "NEW",
  "BESTSELLER",
  "LIMITED",
  "TRENDING",
  "EXCLUSIVE",
]);

const PRODUCT_MEDIA_MODE =
  process.env.NEXT_PUBLIC_PRODUCT_MEDIA_MODE ===
  "storage"
    ? "storage"
    : "firestore";

export const MAX_PRODUCT_IMAGES = 3;

const INLINE_SINGLE_IMAGE_MAX_BYTES =
  280 * 1024;
const INLINE_MULTI_IMAGE_MAX_BYTES =
  150 * 1024;

type StoredProductImage = {
  imageUrl: string;
  imageReference?: ReturnType<typeof ref>;
  mediaMode:
    | "firestore-inline"
    | "firebase-storage";
};

function readString(
  value: unknown,
  fallback = ""
) {
  return typeof value === "string"
    ? value.trim()
    : fallback;
}

function readNumber(
  value: unknown,
  fallback = 0
) {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function readBoolean(
  value: unknown,
  fallback = false
) {
  return typeof value === "boolean"
    ? value
    : fallback;
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .map((item) => readString(item))
        .filter(Boolean)
    : [];
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeProduct(
  snapshot: DocumentSnapshot<DocumentData>
): AdminProductRecord | null {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  const id = readNumber(
    data.id,
    Number(snapshot.id)
  );
  const category = readString(
    data.category
  ) as ProductCategory;
  const status = readString(
    data.status,
    "draft"
  ) as ProductPublishingStatus;

  if (
    !Number.isFinite(id) ||
    !PRODUCT_CATEGORIES.has(category) ||
    (status !== "draft" &&
      status !== "published" &&
      status !== "archived")
  ) {
    return null;
  }

  const name = readString(
    data.name,
    "Untitled product"
  );
  const image = readString(data.image);
  const rawColors = Array.isArray(
    data.colors
  )
    ? data.colors
    : [];
  const colors = rawColors
    .map((color) => {
      if (
        !color ||
        typeof color !== "object"
      ) {
        return null;
      }

      const value = color as Record<
        string,
        unknown
      >;

      return {
        name: readString(
          value.name,
          "As Shown"
        ),
        value: readString(
          value.value,
          "#A3A3A3"
        ),
      };
    })
    .filter(
      (
        color
      ): color is {
        name: string;
        value: string;
      } => Boolean(color)
    );

  const badgeValue = readString(
    data.badge
  ) as ProductBadge;

  const images = Array.from(
    new Set(
      [
        image,
        ...readStringArray(data.images),
      ].filter(Boolean)
    )
  );
  const rawVariants = Array.isArray(
    data.variants
  )
    ? data.variants
    : [];
  const fallbackStock = Math.max(
    0,
    readNumber(data.stock)
  );
  const variants = rawVariants
    .map((variant) =>
      normalizeVariant(variant, {
        image: images[0] ?? "",
        price: Math.max(
          0,
          readNumber(data.price)
        ),
      })
    )
    .filter(
      (
        variant
      ): variant is NonNullable<
        ReturnType<typeof normalizeVariant>
      > => variant !== null
    );
  const normalizedVariants =
    variants.length > 0
      ? variants
      : createDefaultVariants({
          sku: readString(
            data.sku,
            `STY-${String(id).slice(-8)}`
          ),
          sizes:
            readStringArray(data.sizes).length > 0
              ? readStringArray(data.sizes)
              : ["One Size"],
          colorName:
            colors[0]?.name ?? "As Shown",
          colorValue:
            colors[0]?.value ?? "#A3A3A3",
          image: images[0] ?? "",
          price: Math.max(
            0,
            readNumber(data.price)
          ),
          stock: fallbackStock,
        });

  return {
    documentId: snapshot.id,
    status,
    createdBy: readString(data.createdBy),
    id,
    slug: readString(
      data.slug,
      `${slugify(name)}-${id}`
    ),
    sku: readString(
      data.sku,
      `STY-${String(id).slice(-8)}`
    ),
    name,
    title: readString(data.title, name),
    category,
    subcategory: readString(
      data.subcategory,
      "collection"
    ),
    brand: readString(
      data.brand,
      "Styloverse"
    ),
    badge: PRODUCT_BADGES.has(
      badgeValue
    )
      ? badgeValue
      : undefined,
    image,
    images,
    price: Math.max(
      0,
      readNumber(data.price)
    ),
    oldPrice:
      readNumber(data.oldPrice) > 0
        ? readNumber(data.oldPrice)
        : undefined,
    rating: Math.max(
      0,
      Math.min(
        5,
        readNumber(data.rating)
      )
    ),
    reviewCount: Math.max(
      0,
      readNumber(data.reviewCount)
    ),
    stock: calculateInventorySummary(
      normalizedVariants
    ).stockAvailable,
    variants: normalizedVariants,
    inventory: calculateInventorySummary(
      normalizedVariants,
      readString(data.inventoryUpdatedAt)
    ),
    featured: readBoolean(
      data.featured
    ),
    isNew: readBoolean(
      data.isNew,
      true
    ),
    shortDescription: readString(
      data.shortDescription
    ),
    description: readString(
      data.description
    ),
    sizes: readStringArray(
      data.sizes
    ).length
      ? readStringArray(data.sizes)
      : ["One Size"],
    colors: colors.length
      ? colors
      : [
          {
            name: "As Shown",
            value: "#A3A3A3",
          },
        ],
    features: readStringArray(
      data.features
    ),
    specifications: Array.isArray(
      data.specifications
    )
      ? data.specifications
          .map((specification) => {
            if (
              !specification ||
              typeof specification !==
                "object"
            ) {
              return null;
            }

            const value =
              specification as Record<
                string,
                unknown
              >;

            return {
              label: readString(
                value.label
              ),
              value: readString(
                value.value
              ),
            };
          })
          .filter(
            (
              specification
            ): specification is {
              label: string;
              value: string;
            } =>
              Boolean(
                specification?.label
              )
          )
      : [],
    material: readString(
      data.material,
      "Premium-quality materials"
    ),
    videoUrl: readString(data.videoUrl) || undefined,
    modelInformation: data.modelInformation && typeof data.modelInformation === "object" ? {
      height: readString((data.modelInformation as Record<string,unknown>).height),
      wornSize: readString((data.modelInformation as Record<string,unknown>).wornSize),
      measurements: readString((data.modelInformation as Record<string,unknown>).measurements) || undefined,
    } : undefined,
    careInstructions: readStringArray(
      data.careInstructions
    ),
    deliveryInformation: readString(
      data.deliveryInformation,
      "Complimentary standard delivery within 2-4 business days on eligible orders."
    ),
    returnPolicy: readString(
      data.returnPolicy,
      "Easy return or exchange available within 7 days of delivery."
    ),
    reviews: [],
  };
}

function normalizeSnapshotProducts(
  snapshots: Array<
    QueryDocumentSnapshot<DocumentData>
  >
) {
  return snapshots
    .map(normalizeProduct)
    .filter(
      (
        product
      ): product is AdminProductRecord =>
        Boolean(product)
    )
    .sort(
      (first, second) =>
        second.id - first.id
    );
}

export function subscribeToPublishedProducts(
  onProducts: (products: Product[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const publishedProductsQuery = query(
    collection(db, "products"),
    where("status", "==", "published")
  );

  return onSnapshot(
    publishedProductsQuery,
    (snapshot) => {
      onProducts(
        normalizeSnapshotProducts(
          snapshot.docs
        )
      );
    },
    (error) => onError?.(error)
  );
}

export function subscribeToAdminProducts(
  onProducts: (
    products: AdminProductRecord[]
  ) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      onProducts(
        normalizeSnapshotProducts(
          snapshot.docs
        )
      );
    },
    (error) => onError?.(error)
  );
}

export async function getPublishedProduct(
  identifier: string
): Promise<Product | null> {
  const directSnapshot = await getDoc(
    doc(db, "products", identifier)
  );

  if (directSnapshot.exists()) {
    const normalized = normalizeProduct(
      directSnapshot
    );

    return normalized?.status ===
      "published"
      ? normalized
      : null;
  }

  const slugQuery = query(
    collection(db, "products"),
    where("slug", "==", identifier),
    where("status", "==", "published"),
    limit(1)
  );

  const slugSnapshot = await getDocs(
    slugQuery
  );

  return (
    normalizeSnapshotProducts(
      slugSnapshot.docs
    )[0] ?? null
  );
}

function uploadImage(
  file: File,
  productId: number,
  onProgress?: (progress: number) => void
) {
  const safeFileName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const imageReference = ref(
    storage,
    `products/${productId}/${Date.now()}-${safeFileName || "product-image"}`
  );

  return new Promise<{
    imageUrl: string;
    imageReference: ReturnType<typeof ref>;
  }>((resolve, reject) => {
    const uploadTask =
      uploadBytesResumable(
        imageReference,
        file,
        {
          contentType: file.type,
          customMetadata: {
            productId: String(productId),
          },
        }
      );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          snapshot.totalBytes > 0
            ? Math.round(
                (snapshot.bytesTransferred /
                  snapshot.totalBytes) *
                  100
              )
            : 0;
        onProgress?.(progress);
      },
      reject,
      () => {
        void getDownloadURL(
          uploadTask.snapshot.ref
        )
          .then((imageUrl) =>
            resolve({
              imageUrl,
              imageReference,
            })
          )
          .catch(reject);
      }
    );
  });
}

function canvasToWebp(
  canvas: HTMLCanvasElement,
  quality: number
) {
  return new Promise<Blob>(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
            return;
          }

          reject(
            new Error(
              "This browser could not optimise the selected image."
            )
          );
        },
        "image/webp",
        quality
      );
    }
  );
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>(
    (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result === "string"
        ) {
          resolve(reader.result);
          return;
        }

        reject(
          new Error(
            "The optimised image could not be prepared."
          )
        );
      };
      reader.onerror = () =>
        reject(
          new Error(
            "The selected image could not be read."
          )
        );
      reader.readAsDataURL(blob);
    }
  );
}

function loadImage(file: File) {
  return new Promise<{
    image: HTMLImageElement;
    objectUrl: string;
  }>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () =>
      resolve({ image, objectUrl });
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new Error(
          "The selected product image is damaged or unsupported."
        )
      );
    };
    image.src = objectUrl;
  });
}

async function optimiseInlineImage(
  file: File,
  maxBytes: number,
  onProgress?: (progress: number) => void
): Promise<StoredProductImage> {
  onProgress?.(8);

  const { image, objectUrl } =
    await loadImage(file);

  try {
    const longestSide = Math.max(
      image.naturalWidth,
      image.naturalHeight
    );

    if (longestSide <= 0) {
      throw new Error(
        "The selected image has invalid dimensions."
      );
    }

    let bestBlob: Blob | null = null;

    for (
      let attempt = 0;
      attempt < 8;
      attempt += 1
    ) {
      const targetLongestSide =
        1600 * Math.pow(0.88, attempt);
      const scale = Math.min(
        1,
        targetLongestSide / longestSide
      );
      const width = Math.max(
        1,
        Math.round(
          image.naturalWidth * scale
        )
      );
      const height = Math.max(
        1,
        Math.round(
          image.naturalHeight * scale
        )
      );
      const canvas =
        document.createElement("canvas");
      const context =
        canvas.getContext("2d", {
          alpha: true,
        });

      if (!context) {
        throw new Error(
          "Image optimisation is unavailable in this browser."
        );
      }

      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(
        image,
        0,
        0,
        width,
        height
      );

      const quality = Math.max(
        0.54,
        0.86 - attempt * 0.045
      );
      const blob = await canvasToWebp(
        canvas,
        quality
      );

      bestBlob = blob;
      onProgress?.(
        18 + Math.round((attempt / 8) * 60)
      );

      if (
        blob.size <= maxBytes
      ) {
        break;
      }
    }

    if (
      !bestBlob ||
      bestBlob.size > maxBytes
    ) {
      throw new Error(
        "This image is too detailed to optimise safely. Please use a simpler JPG or WebP image."
      );
    }

    const imageUrl = await blobToDataUrl(
      bestBlob
    );

    onProgress?.(82);

    return {
      imageUrl,
      mediaMode: "firestore-inline",
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function storeProductImage(
  file: File,
  productId: number,
  maxInlineBytes: number,
  onProgress?: (progress: number) => void
): Promise<StoredProductImage> {
  if (PRODUCT_MEDIA_MODE === "storage") {
    const upload = await uploadImage(
      file,
      productId,
      onProgress
    );

    return {
      ...upload,
      mediaMode: "firebase-storage",
    };
  }

  return optimiseInlineImage(
    file,
    maxInlineBytes,
    onProgress
  );
}

function validateProductImages(
  files: File[],
  existingImageCount = 0
) {
  const totalImages =
    files.length + existingImageCount;

  if (totalImages < 1) {
    throw new Error(
      "Please upload at least one product image."
    );
  }

  if (totalImages > MAX_PRODUCT_IMAGES) {
    throw new Error(
      `A product can have up to ${MAX_PRODUCT_IMAGES} images.`
    );
  }

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error(
        "Please select valid PNG, JPG or WebP product images."
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      throw new Error(
        "Each product image must be smaller than 8 MB."
      );
    }
  });
}

async function storeProductImages(
  files: File[],
  productId: number,
  totalImageCount: number,
  onProgress?: (progress: number) => void
) {
  const uploads: StoredProductImage[] = [];
  const maxInlineBytes =
    totalImageCount > 1
      ? INLINE_MULTI_IMAGE_MAX_BYTES
      : INLINE_SINGLE_IMAGE_MAX_BYTES;

  for (
    let index = 0;
    index < files.length;
    index += 1
  ) {
    const upload = await storeProductImage(
      files[index],
      productId,
      maxInlineBytes,
      (imageProgress) => {
        const overallProgress =
          ((index + imageProgress / 100) /
            Math.max(1, files.length)) *
          92;
        onProgress?.(
          Math.round(overallProgress)
        );
      }
    );
    uploads.push(upload);
  }

  return uploads;
}

function uniqueImages(images: string[]) {
  return Array.from(
    new Set(
      images
        .map((image) => image.trim())
        .filter(Boolean)
    )
  ).slice(0, MAX_PRODUCT_IMAGES);
}

function isStorageImage(imageUrl: string) {
  return (
    imageUrl.startsWith("gs://") ||
    imageUrl.includes(
      "firebasestorage.googleapis.com"
    )
  );
}

async function deleteStorageImages(
  imageUrls: string[]
) {
  await Promise.all(
    uniqueImages(imageUrls)
      .filter(isStorageImage)
      .map((imageUrl) =>
        deleteObject(ref(storage, imageUrl)).catch(
          () => undefined
        )
      )
  );
}

function buildProduct(
  input: Omit<
    CreateAdminProductInput,
    "imageFiles" | "createdBy"
  >,
  id: number,
  images: string[],
  existing?: AdminProductRecord
): Product {
  const name = input.name.trim();
  const subcategory =
    slugify(input.subcategory) ||
    "collection";

  const baseSku =
    input.sku.trim() ||
    existing?.sku ||
    `STY-${input.category.slice(
      0,
      3
    )}-${String(id).slice(-6)}`;
  const variants =
    existing?.variants?.length
      ? existing.variants
      : createDefaultVariants({
          sku: baseSku,
          sizes:
            input.sizes.length > 0
              ? input.sizes
              : ["One Size"],
          colorName:
            input.colorName.trim() ||
            "As Shown",
          colorValue:
            input.colorValue || "#A3A3A3",
          image: images[0],
          price: input.price,
          stock: input.stock,
        });
  const inventory =
    calculateInventorySummary(variants);

  return {
    id,
    slug: `${slugify(name)}-${String(
      id
    ).slice(-8)}`,
    sku: baseSku,
    name,
    title: name,
    category: input.category,
    subcategory,
    brand: "Styloverse",
    badge: input.badge,
    image: images[0],
    images,
    videoUrl: input.videoUrl.trim() || undefined,
    modelInformation: input.modelHeight.trim() || input.modelWornSize.trim() ? { height: input.modelHeight.trim(), wornSize: input.modelWornSize.trim(), measurements: input.modelMeasurements.trim() || undefined } : undefined,
    price: input.price,
    oldPrice: input.oldPrice,
    rating: existing?.rating ?? 0,
    reviewCount: existing?.reviewCount ?? 0,
    stock: inventory.stockAvailable,
    variants,
    inventory,
    featured: input.featured,
    isNew: existing?.isNew ?? true,
    shortDescription:
      input.shortDescription.trim(),
    description: input.description.trim(),
    sizes: input.sizes.length
      ? input.sizes
      : ["One Size"],
    colors: [
      {
        name:
          input.colorName.trim() ||
          "As Shown",
        value:
          input.colorValue || "#A3A3A3",
      },
    ],
    features:
      existing?.features.length
        ? existing.features
        : [
            `Premium ${subcategory.replace(
              /-/g,
              " "
            )} construction`,
            "Refined Styloverse finish",
            "Designed for versatile styling",
          ],
    specifications: [
      {
        label: "Category",
        value: input.category,
      },
      {
        label: "Subcategory",
        value: subcategory.replace(/-/g, " "),
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
    material:
      input.material.trim() ||
      "Premium-quality materials",
    careInstructions:
      existing?.careInstructions.length
        ? existing.careInstructions
        : [
            "Clean gently according to the product care label",
            "Keep away from excess moisture",
            "Store separately when not in use",
          ],
    deliveryInformation:
      existing?.deliveryInformation ||
      "Complimentary standard delivery within 2-4 business days on eligible orders.",
    returnPolicy:
      existing?.returnPolicy ||
      "Easy return or exchange available within 7 days of delivery.",
    reviews: existing?.reviews ?? [],
  };
}

function productDocument(
  product: Product
) {
  return Object.fromEntries(
    Object.entries(product).filter(
      ([, value]) => value !== undefined
    )
  );
}

export async function createAdminProduct(
  input: CreateAdminProductInput,
  onProgress?: (progress: number) => void
) {
  validateProductImages(input.imageFiles);

  const id = Date.now();
  const uploads = await storeProductImages(
    input.imageFiles,
    id,
    input.imageFiles.length,
    onProgress
  );
  const images = uploads.map(
    (upload) => upload.imageUrl
  );

  try {
    const product = buildProduct(
      input,
      id,
      images
    );

    const productId = String(id);
    const batch = writeBatch(db);

    batch.set(
      doc(db, "products", productId),
      {
        ...productDocument(product),
        images: product.images.slice(1),
        status: input.status,
        createdBy: input.createdBy,
        mediaMode:
          uploads[0]?.mediaMode ??
          "firestore-inline",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    (product.variants ?? []).forEach(
      (variant) => {
        batch.set(
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
            productName: product.name,
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
          }
        );
        batch.set(
          doc(
            db,
            "inventorySkus",
            variant.sku.toLowerCase()
          ),
          {
            sku: variant.sku,
            productId,
            variantId: variant.id,
            updatedAt: serverTimestamp(),
          }
        );
        if (variant.barcode) {
          batch.set(
            doc(
              db,
              "inventoryBarcodes",
              variant.barcode.toLowerCase()
            ),
            {
              barcode: variant.barcode,
              productId,
              variantId: variant.id,
              updatedAt:
                serverTimestamp(),
            }
          );
        }
      }
    );

    await batch.commit();

    onProgress?.(100);

    return product;
  } catch (error) {
    await Promise.all(
      uploads.map((upload) =>
        upload.imageReference
          ? deleteObject(
              upload.imageReference
            ).catch(() => undefined)
          : Promise.resolve()
      )
    );
    throw error;
  }
}

export async function updateAdminProduct(
  input: UpdateAdminProductInput,
  onProgress?: (progress: number) => void
) {
  validateProductImages(
    input.imageFiles,
    input.existingImages.length
  );

  const productReference = doc(
    db,
    "products",
    input.documentId
  );
  const snapshot = await getDoc(
    productReference
  );
  const existingProduct =
    normalizeProduct(snapshot);

  if (!existingProduct) {
    throw new Error(
      "This product no longer exists. Refresh the catalogue and try again."
    );
  }

  const existingImages = uniqueImages(
    input.existingImages
  );
  const uploads = await storeProductImages(
    input.imageFiles,
    input.id,
    existingImages.length +
      input.imageFiles.length,
    onProgress
  );
  const nextImages = uniqueImages([
    ...existingImages,
    ...uploads.map(
      (upload) => upload.imageUrl
    ),
  ]);
  const product = buildProduct(
    input,
    input.id,
    nextImages,
    existingProduct
  );

  try {
    await setDoc(
      productReference,
      {
        ...productDocument(product),
        images: product.images.slice(1),
        status: input.status,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const removedImages =
      existingProduct.images.filter(
        (image) =>
          !nextImages.includes(image)
      );
    await deleteStorageImages(
      removedImages
    );
    onProgress?.(100);
    return product;
  } catch (error) {
    await Promise.all(
      uploads.map((upload) =>
        upload.imageReference
          ? deleteObject(
              upload.imageReference
            ).catch(() => undefined)
          : Promise.resolve()
      )
    );
    throw error;
  }
}

export async function updateAdminProductStatus(
  documentId: string,
  status: ProductPublishingStatus
) {
  await setDoc(
    doc(db, "products", documentId),
    {
      status,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateAdminProductStock(
  documentId: string,
  stock: number
) {
  if (
    !Number.isFinite(stock) ||
    stock < 0
  ) {
    throw new Error(
      "Stock cannot be below zero."
    );
  }

  const productReference = doc(
    db,
    "products",
    documentId
  );

  await runTransaction(
    db,
    async (transaction) => {
      const snapshot = await transaction.get(
        productReference
      );

      if (!snapshot.exists()) {
        throw new Error(
          "This product no longer exists."
        );
      }

      const product = normalizeProduct(
        snapshot
      );

      if (!product) {
        throw new Error(
          "This product inventory could not be read."
        );
      }

      const variants = (
        product.variants ?? []
      ).map((variant) => ({ ...variant }));
      const currentAvailable =
        calculateInventorySummary(
          variants
        ).stockAvailable;
      const delta =
        Math.floor(stock) -
        currentAvailable;
      const target = variants[0];

      if (!target) {
        throw new Error(
          "This product has no inventory variant."
        );
      }

      if (
        target.stockOnHand + delta <
        target.stockReserved
      ) {
        throw new Error(
          "Stock cannot be reduced below reserved units."
        );
      }

      target.stockOnHand += delta;
      target.status = getVariantStatus(
        target,
        target.status === "archived"
      );
      const inventory =
        calculateInventorySummary(variants);

      transaction.update(
        productReference,
        {
          variants,
          inventory: {
            ...inventory,
            updatedAt:
              serverTimestamp(),
          },
          inventoryUpdatedAt:
            serverTimestamp(),
          stock:
            inventory.stockAvailable,
          updatedAt: serverTimestamp(),
        }
      );
    }
  );
}

export async function deleteAdminProduct(
  documentId: string
) {
  const productReference = doc(
    db,
    "products",
    documentId
  );
  const snapshot = await getDoc(
    productReference
  );
  const product = normalizeProduct(snapshot);

  if (!product) {
    return;
  }

  if (
    (product.inventory?.stockReserved ??
      0) > 0
  ) {
    throw new Error(
      "This product has reserved order stock and cannot be deleted. Archive it instead."
    );
  }

  const batch = writeBatch(db);
  batch.delete(productReference);

  (product.variants ?? []).forEach(
    (variant) => {
      batch.delete(
        doc(
          db,
          "inventoryVariants",
          getInventoryVariantDocumentId(
            documentId,
            variant.id
          )
        )
      );
      batch.delete(
        doc(
          db,
          "inventorySkus",
          variant.sku.toLowerCase()
        )
      );
      if (variant.barcode) {
        batch.delete(
          doc(
            db,
            "inventoryBarcodes",
            variant.barcode.toLowerCase()
          )
        );
      }
    }
  );

  await batch.commit();
  await deleteStorageImages(product.images);
}
