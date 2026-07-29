"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Archive,
  ArrowRight,
  Boxes,
  Check,
  ChevronDown,
  CircleMinus,
  CirclePlus,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  PackagePlus,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  products as staticProducts,
  type ProductBadge,
  type ProductCategory,
} from "@/data/products";
import { useAdminAccess } from "@/contexts/AdminContext";
import {
  createAdminProduct,
  deleteAdminProduct,
  MAX_PRODUCT_IMAGES,
  subscribeToAdminProducts,
  updateAdminProduct,
  updateAdminProductStatus,
  updateAdminProductStock,
  type AdminProductRecord,
  type ProductPublishingStatus,
} from "@/services/product.service";

const CATEGORIES: ProductCategory[] = [
  "MEN",
  "WOMEN",
  "STREETWEAR",
  "FOOTWEAR",
  "ACCESSORIES",
  "WINTER",
];

const BADGES: Array<
  ProductBadge | ""
> = [
  "",
  "NEW",
  "BESTSELLER",
  "LIMITED",
  "TRENDING",
  "EXCLUSIVE",
];

type ProductFormState = {
  name: string;
  sku: string;
  category: ProductCategory;
  subcategory: string;
  price: string;
  oldPrice: string;
  stock: string;
  badge: ProductBadge | "";
  shortDescription: string;
  description: string;
  material: string;
  videoUrl: string;
  modelHeight: string;
  modelWornSize: string;
  modelMeasurements: string;
  sizes: string;
  colorName: string;
  colorValue: string;
  featured: boolean;
  status: Exclude<
    ProductPublishingStatus,
    "archived"
  >;
};

type ProductStatusFilter =
  | "all"
  | ProductPublishingStatus;

const INITIAL_FORM: ProductFormState = {
  name: "",
  sku: "",
  category: "MEN",
  subcategory: "",
  price: "",
  oldPrice: "",
  stock: "",
  badge: "NEW",
  shortDescription: "",
  description: "",
  material: "",
  videoUrl: "",
  modelHeight: "",
  modelWornSize: "",
  modelMeasurements: "",
  sizes: "S, M, L, XL",
  colorName: "As Shown",
  colorValue: "#A3A3A3",
  featured: false,
  status: "published",
};

const inputClassName =
  "mt-2 h-12 w-full rounded-2xl border border-[#D9CEC3] bg-white px-4 text-sm text-[#211D1A] outline-none transition placeholder:text-[#A79D94] focus:border-[#A77B47] focus:ring-4 focus:ring-[#A77B47]/10";

const labelClassName =
  "text-[9px] font-semibold uppercase tracking-[0.23em] text-[#796D63]";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function parsePositiveNumber(
  value: string,
  fieldName: string,
  allowZero = false
) {
  const parsed = Number(value);

  if (
    !Number.isFinite(parsed) ||
    (allowZero ? parsed < 0 : parsed <= 0)
  ) {
    throw new Error(
      `Please enter a valid ${fieldName}.`
    );
  }

  return parsed;
}

function getProductErrorMessage(
  error: unknown
) {
  if (!(error instanceof Error)) {
    return "The product could not be saved. Please try again.";
  }

  if (
    error.message.includes(
      "storage/unauthorized"
    ) ||
    error.message.includes(
      "storage/object-not-found"
    )
  ) {
    return "Firebase Storage is not enabled for admin image uploads yet. Publish the Styloverse Storage rules and try again.";
  }

  if (
    error.message.includes(
      "Missing or insufficient permissions"
    )
  ) {
    return "Your Firebase rules do not allow this product write. Confirm this account still has the admin role.";
  }

  return error.message;
}

export default function AdminProductsManager() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { profile, isPreview } =
    useAdminAccess();
  const [products, setProducts] =
    useState<AdminProductRecord[]>([]);
  const [form, setForm] =
    useState<ProductFormState>(
      INITIAL_FORM
    );
  const [imageFiles, setImageFiles] =
    useState<File[]>([]);
  const [imagePreviews, setImagePreviews] =
    useState<string[]>([]);
  const imagePreviewsRef =
    useRef<string[]>([]);
  const [existingImages, setExistingImages] =
    useState<string[]>([]);
  const [editingProduct, setEditingProduct] =
    useState<AdminProductRecord | null>(null);
  const [isEditorOpen, setIsEditorOpen] =
    useState(false);
  const [isSaving, setIsSaving] =
    useState(false);
  const [uploadProgress, setUploadProgress] =
    useState(0);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");
  const searchQuery =
    searchParams.get("search")?.trim() ?? "";
  const [statusFilter, setStatusFilter] =
    useState<ProductStatusFilter>("all");
  const [busyProductId, setBusyProductId] =
    useState("");
  const [deleteTarget, setDeleteTarget] =
    useState<AdminProductRecord | null>(null);

  useEffect(() => {
    if (isPreview) {
      return;
    }

    return subscribeToAdminProducts(
      setProducts,
      (error) => {
        console.warn(
          "Unable to load admin products:",
          error
        );
        setErrorMessage(
          "Live catalogue records could not be loaded."
        );
      }
    );
  }, [isPreview]);

  useEffect(() => {
    imagePreviewsRef.current =
      imagePreviews;
  }, [imagePreviews]);

  useEffect(() => {
    return () => {
      imagePreviewsRef.current.forEach(
        (preview) =>
          URL.revokeObjectURL(preview)
      );
    };
  }, []);

  function updateSearchQuery(value: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );
    const query = value.trimStart();

    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }

    const queryString = params.toString();
    router.replace(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
      { scroll: false }
    );
  }

  const summary = useMemo(() => {
    const published = products.filter(
      (product) =>
        product.status === "published"
    ).length;
    const drafts = products.filter(
      (product) => product.status === "draft"
    ).length;
    const archived = products.filter(
      (product) => product.status === "archived"
    ).length;
    const inventory = products.reduce(
      (total, product) =>
        total + product.stock,
      0
    );

    return {
      published,
      drafts,
      archived,
      inventory,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const matchesStatus =
        statusFilter === "all" ||
        product.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        [
          product.name,
          product.sku,
          product.category,
          product.subcategory,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [products, searchQuery, statusFilter]);

  function updateField<
    Key extends keyof ProductFormState,
  >(
    key: Key,
    value: ProductFormState[Key]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    setErrorMessage("");
    setSuccessMessage("");
  }

  function revokeImagePreviews() {
    imagePreviewsRef.current.forEach(
      (preview) =>
        URL.revokeObjectURL(preview)
    );
    imagePreviewsRef.current = [];
  }

  function chooseImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );
    event.target.value = "";

    if (!files.length) {
      return;
    }

    if (
      files.some(
        (file) =>
          !file.type.startsWith("image/")
      )
    ) {
      setErrorMessage(
        "Please select PNG, JPG or WebP product images only."
      );
      return;
    }

    if (
      files.some(
        (file) =>
          file.size > 8 * 1024 * 1024
      )
    ) {
      setErrorMessage(
        "Each product image must be smaller than 8 MB."
      );
      return;
    }

    const availableSlots =
      MAX_PRODUCT_IMAGES -
      existingImages.length -
      imageFiles.length;

    if (availableSlots <= 0) {
      setErrorMessage(
        `A product can have up to ${MAX_PRODUCT_IMAGES} images.`
      );
      return;
    }

    const acceptedFiles = files.slice(
      0,
      availableSlots
    );
    const previews = acceptedFiles.map(
      (file) => URL.createObjectURL(file)
    );

    setImageFiles((current) => [
      ...current,
      ...acceptedFiles,
    ]);
    setImagePreviews((current) => [
      ...current,
      ...previews,
    ]);
    setErrorMessage("");

    if (acceptedFiles.length < files.length) {
      setErrorMessage(
        `Only ${MAX_PRODUCT_IMAGES} images are allowed; the extra selections were ignored.`
      );
    }
  }

  function resetEditor() {
    revokeImagePreviews();
    setForm(INITIAL_FORM);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setEditingProduct(null);
    setUploadProgress(0);
    setErrorMessage("");
  }

  function openCreateEditor() {
    resetEditor();
    setSuccessMessage("");
    setIsEditorOpen(true);
  }

  function openEditEditor(
    product: AdminProductRecord
  ) {
    resetEditor();
    const primaryColor = product.colors[0];

    setEditingProduct(product);
    setExistingImages(
      product.images.length
        ? product.images.slice(
            0,
            MAX_PRODUCT_IMAGES
          )
        : [product.image]
    );
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      subcategory: product.subcategory,
      price: String(product.price),
      oldPrice: product.oldPrice
        ? String(product.oldPrice)
        : "",
      stock: String(product.stock),
      badge: product.badge ?? "",
      shortDescription:
        product.shortDescription,
      description: product.description,
      material: product.material,
      videoUrl: product.videoUrl ?? "",
      modelHeight: product.modelInformation?.height ?? "",
      modelWornSize: product.modelInformation?.wornSize ?? "",
      modelMeasurements: product.modelInformation?.measurements ?? "",
      sizes: product.sizes.join(", "),
      colorName:
        primaryColor?.name ?? "As Shown",
      colorValue:
        primaryColor?.value ?? "#A3A3A3",
      featured: product.featured,
      status:
        product.status === "published"
          ? "published"
          : "draft",
    });
    setSuccessMessage("");
    setIsEditorOpen(true);
  }

  function closeEditor() {
    if (isSaving) {
      return;
    }

    setIsEditorOpen(false);
    resetEditor();
  }

  function removeExistingImage(index: number) {
    setExistingImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
    setErrorMessage("");
  }

  function removeNewImage(index: number) {
    const preview = imagePreviews[index];
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImageFiles((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
    setImagePreviews((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
    setErrorMessage("");
  }

  async function saveProduct(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (isPreview) {
      setErrorMessage(
        "Portfolio preview is read-only. Sign in with the real administrator account to publish products."
      );
      return;
    }

    try {
      if (form.name.trim().length < 3) {
        throw new Error(
          "Product name must contain at least 3 characters."
        );
      }

      if (!form.subcategory.trim()) {
        throw new Error(
          "Please enter a subcategory such as kurtas, sarees or boots."
        );
      }

      if (
        existingImages.length +
          imageFiles.length <
        1
      ) {
        throw new Error(
          "Please upload at least one product image."
        );
      }

      const price = parsePositiveNumber(
        form.price,
        "selling price"
      );
      const oldPrice = form.oldPrice.trim()
        ? parsePositiveNumber(
            form.oldPrice,
            "compare-at price"
          )
        : undefined;
      const stock = parsePositiveNumber(
        form.stock,
        "stock quantity",
        true
      );

      if (
        oldPrice &&
        oldPrice <= price
      ) {
        throw new Error(
          "Compare-at price must be higher than the selling price."
        );
      }

      setIsSaving(true);
      setUploadProgress(0);

      const productInput = {
        name: form.name,
        sku: form.sku,
        category: form.category,
        subcategory: form.subcategory,
        price,
        oldPrice,
        stock,
        badge: form.badge || undefined,
        shortDescription:
          form.shortDescription ||
          `${form.name} from the Styloverse ${form.category.toLowerCase()} collection.`,
        description:
          form.description ||
          `${form.name} combines premium construction, refined finishing and versatile styling for the modern Styloverse wardrobe.`,
        material: form.material,
        videoUrl: form.videoUrl,
        modelHeight: form.modelHeight,
        modelWornSize: form.modelWornSize,
        modelMeasurements: form.modelMeasurements,
        sizes: form.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),
        colorName: form.colorName,
        colorValue: form.colorValue,
        featured: form.featured,
        status: form.status,
        imageFiles,
      };

      const product = editingProduct
        ? await updateAdminProduct(
            {
              ...productInput,
              documentId:
                editingProduct.documentId,
              id: editingProduct.id,
              existingImages,
            },
            setUploadProgress
          )
        : await createAdminProduct(
            {
              ...productInput,
              createdBy: profile.uid,
            },
            setUploadProgress
          );

      const wasEditing = Boolean(
        editingProduct
      );
      resetEditor();
      setIsEditorOpen(false);
      setSuccessMessage(
        `${product.name} has been ${
          wasEditing
            ? "updated and "
            : ""
        }${
          form.status === "published"
            ? "published to the storefront"
            : "saved as a draft"
        }.`
      );
    } catch (error) {
      setErrorMessage(
        getProductErrorMessage(error)
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function changeProductStatus(
    product: AdminProductRecord,
    status: ProductPublishingStatus
  ) {
    if (isPreview) {
      return;
    }

    setBusyProductId(product.documentId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateAdminProductStatus(
        product.documentId,
        status
      );
      setSuccessMessage(
        status === "published"
          ? `${product.name} is now live on the storefront.`
          : status === "archived"
            ? `${product.name} has been archived safely.`
            : `${product.name} has been restored as a private draft.`
      );
    } catch (error) {
      setErrorMessage(
        getProductErrorMessage(error)
      );
    } finally {
      setBusyProductId("");
    }
  }

  async function adjustProductStock(
    product: AdminProductRecord,
    difference: number
  ) {
    if (isPreview) {
      return;
    }

    const nextStock = Math.max(
      0,
      product.stock + difference
    );

    if (nextStock === product.stock) {
      return;
    }

    setBusyProductId(product.documentId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateAdminProductStock(
        product.documentId,
        nextStock
      );
      setSuccessMessage(
        `${product.name} stock updated to ${nextStock}.`
      );
    } catch (error) {
      setErrorMessage(
        getProductErrorMessage(error)
      );
    } finally {
      setBusyProductId("");
    }
  }

  async function confirmDeleteProduct() {
    if (!deleteTarget || isPreview) {
      return;
    }

    setBusyProductId(
      deleteTarget.documentId
    );
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteAdminProduct(
        deleteTarget.documentId
      );
      setSuccessMessage(
        `${deleteTarget.name} was permanently removed from the cloud catalogue.`
      );
      setDeleteTarget(null);
    } catch (error) {
      setErrorMessage(
        getProductErrorMessage(error)
      );
    } finally {
      setBusyProductId("");
    }
  }

  const mainImage =
    existingImages[0] ??
    imagePreviews[0] ??
    "";

  return (
    <section className="admin-panel-enter space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border border-[#2F2927] bg-[linear-gradient(130deg,#171513_0%,#201B19_55%,#2C2236_100%)] p-6 text-white shadow-[0_28px_80px_rgba(35,27,22,.18)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#8266F0]/20 blur-[90px]" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#E1B873]">
              <Sparkles size={14} />
              <p className="text-[9px] font-semibold uppercase tracking-[0.32em]">
                Catalogue studio
              </p>
            </div>
            <h1 className="mt-4 font-[var(--font-heading)] text-4xl leading-none sm:text-5xl lg:text-6xl">
              Products
              <span className="text-[#D5A85F]">.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
              Build, merchandise and publish every Styloverse piece from one private workspace.
            </p>
          </div>

          <button
            type="button"
            disabled={isPreview}
            onClick={openCreateEditor}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#E6BE7A,#BC8649)] px-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#21170F] shadow-[0_14px_34px_rgba(201,151,82,.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <PackagePlus size={16} />
            Add new product
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {
            label: "Core catalogue",
            value: staticProducts.length,
            note: "Original products",
          },
          {
            label: "Cloud published",
            value: summary.published,
            note: "Live additions",
          },
          {
            label: "Private drafts",
            value: summary.drafts,
            note: "Not visible publicly",
          },
          {
            label: "Archived",
            value: summary.archived,
            note: "Safely off sale",
          },
          {
            label: "Cloud inventory",
            value: summary.inventory,
            note: "Available units",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[24px] border border-white/80 bg-white/75 p-5 shadow-[0_16px_45px_rgba(54,39,28,.07)] backdrop-blur-xl"
          >
            <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#9B7044]">
              {item.label}
            </p>
            <p className="mt-3 font-[var(--font-heading)] text-3xl text-[#1C1917]">
              {item.value.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[10px] text-[#887E75]">
              {item.note}
            </p>
          </article>
        ))}
      </div>

      {successMessage ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800"
        >
          <Check
            size={18}
            className="mt-0.5 shrink-0"
          />
          {successMessage}
        </div>
      ) : null}

      {errorMessage && !isEditorOpen ? (
        <div
          role="alert"
          className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-3 rounded-[24px] border border-white/80 bg-white/70 p-3 shadow-[0_16px_45px_rgba(54,39,28,.06)] backdrop-blur-xl sm:grid-cols-[minmax(0,1fr)_210px] sm:p-4">
        <label className="relative block">
          <span className="sr-only">
            Search cloud products
          </span>
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9B7044]"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              updateSearchQuery(event.target.value)
            }
            placeholder="Search product, SKU or category..."
            className="h-12 w-full rounded-2xl border border-[#DDD3C9] bg-white pl-11 pr-10 text-sm outline-none transition placeholder:text-[#A79D94] focus:border-[#A77B47] focus:ring-4 focus:ring-[#A77B47]/10"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => updateSearchQuery("")}
              aria-label="Clear product search"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#746A62] transition hover:bg-[#F0E9E2]"
            >
              <X size={14} />
            </button>
          ) : null}
        </label>

        <label className="relative block">
          <span className="sr-only">
            Filter by product status
          </span>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target
                  .value as ProductStatusFilter
              )
            }
            className="h-12 w-full appearance-none rounded-2xl border border-[#DDD3C9] bg-white px-4 pr-10 text-xs font-semibold uppercase tracking-[0.12em] text-[#5F554D] outline-none focus:border-[#A77B47]"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#887B71]"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#DFD5CB] bg-white/75 shadow-[0_22px_65px_rgba(48,35,26,.08)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 border-b border-[#E8DFD7] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A27342]">
              Live additions
            </p>
            <h2 className="mt-1 font-[var(--font-heading)] text-2xl text-[#1C1917]">
              Cloud catalogue
            </h2>
            <p className="mt-1 text-[9px] text-[#8C8178]">
              {filteredProducts.length} of {products.length} cloud pieces
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6A51D7]"
          >
            View storefront <ArrowRight size={13} />
          </Link>
        </div>

        {filteredProducts.length ? (
          <div className="divide-y divide-[#EAE2DA]">
            {filteredProducts.map((product) => (
              <article
                key={product.documentId}
                className="grid gap-4 p-5 sm:grid-cols-[82px_minmax(0,1fr)] sm:items-center sm:px-7 lg:grid-cols-[82px_minmax(0,1fr)_150px_250px]"
              >
                <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[#F0EAE4]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized={product.image.startsWith("data:")}
                    sizes="82px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.14em] ${
                        product.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : product.status === "archived"
                            ? "bg-stone-100 text-stone-600"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {product.status}
                    </span>
                    <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#A47A50]">
                      {product.category} · {product.subcategory}
                    </span>
                  </div>
                  <h3 className="mt-2 truncate font-[var(--font-heading)] text-xl text-[#211D1A]">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-[10px] text-[#8A8179]">
                    {product.sku} · {product.images.length} {product.images.length === 1 ? "image" : "images"}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:col-span-2 lg:col-span-1 lg:block lg:text-right">
                  <div>
                    <p className="font-semibold text-[#211D1A]">
                      {formatPrice(product.price)}
                    </p>
                    {product.status === "published" ? (
                      <Link
                        href={`/product/${product.id}`}
                        className="mt-2 inline-flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#6A51D7]"
                      >
                        Open <ArrowRight size={11} />
                      </Link>
                    ) : null}
                  </div>

                  <div className="flex items-center rounded-full border border-[#DED4CB] bg-[#F8F4EF] p-1 lg:mt-3 lg:ml-auto lg:w-fit">
                    <button
                      type="button"
                      disabled={busyProductId === product.documentId || product.stock <= 0}
                      onClick={() => void adjustProductStock(product, -1)}
                      aria-label={`Reduce ${product.name} stock`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#786D64] transition hover:bg-white disabled:opacity-35"
                    >
                      <CircleMinus size={15} />
                    </button>
                    <span className="min-w-9 text-center text-[10px] font-bold text-[#342E29]">
                      {product.stock}
                    </span>
                    <button
                      type="button"
                      disabled={busyProductId === product.documentId}
                      onClick={() => void adjustProductStock(product, 1)}
                      aria-label={`Increase ${product.name} stock`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#786D64] transition hover:bg-white disabled:opacity-35"
                    >
                      <CirclePlus size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:col-span-2 lg:col-span-1">
                  <button
                    type="button"
                    disabled={busyProductId === product.documentId || isPreview}
                    onClick={() => openEditEditor(product)}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#DCD2C8] bg-white text-[8px] font-semibold uppercase tracking-[0.11em] text-[#524941] transition hover:border-[#A77B47] disabled:opacity-40"
                  >
                    <Edit3 size={13} />
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busyProductId === product.documentId || isPreview}
                    onClick={() =>
                      void changeProductStatus(
                        product,
                        product.status === "published"
                          ? "archived"
                          : product.status === "archived"
                            ? "draft"
                            : "published"
                      )
                    }
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#DCD2C8] bg-[#F8F4EF] text-[8px] font-semibold uppercase tracking-[0.11em] text-[#524941] transition hover:border-[#A77B47] disabled:opacity-40"
                  >
                    {product.status === "published" ? (
                      <Archive size={13} />
                    ) : product.status === "archived" ? (
                      <EyeOff size={13} />
                    ) : (
                      <Eye size={13} />
                    )}
                    {product.status === "published"
                      ? "Archive"
                      : product.status === "archived"
                        ? "Restore"
                        : "Publish"}
                  </button>
                  <button
                    type="button"
                    disabled={busyProductId === product.documentId || isPreview}
                    onClick={() => setDeleteTarget(product)}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50/70 text-[8px] font-semibold uppercase tracking-[0.11em] text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            {products.length ? (
              <Search
                size={28}
                className="mx-auto text-[#B98B57]"
              />
            ) : (
              <ImagePlus
                size={28}
                className="mx-auto text-[#B98B57]"
              />
            )}
            <h3 className="mt-4 font-[var(--font-heading)] text-2xl text-[#211D1A]">
              {products.length
                ? "No product matches this edit."
                : "Your first private listing awaits."}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#80766E]">
              {products.length
                ? "Clear the search or choose another status to reveal more cloud products."
                : "Add a product to test the complete administrator-to-storefront publishing flow."}
            </p>
          </div>
        )}
      </div>

      {isEditorOpen ? (
        <div
          className="fixed inset-0 z-[260] flex items-end justify-center bg-[#110F0E]/70 backdrop-blur-md sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-product-editor-title"
        >
          <button
            type="button"
            aria-label="Close product editor"
            onClick={closeEditor}
            className="absolute inset-0"
          />

          <form
            onSubmit={saveProduct}
            className="relative max-h-[94dvh] w-full max-w-5xl overflow-y-auto rounded-t-[34px] border border-white/70 bg-[#F7F2EC] shadow-[0_40px_120px_rgba(0,0,0,.34)] sm:rounded-[34px]"
          >
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#DED4CB] bg-[#F7F2EC]/95 px-5 py-4 backdrop-blur-xl sm:px-7">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.27em] text-[#A5723D]">
                  Product atelier
                </p>
                <h2
                  id="admin-product-editor-title"
                  className="mt-1 font-[var(--font-heading)] text-2xl text-[#1B1816]"
                >
                  {editingProduct
                    ? "Refine this piece"
                    : "Add a new piece"}
                </h2>
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={closeEditor}
                aria-label="Close editor"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D7CDC3] bg-white text-[#332D29] disabled:opacity-40"
              >
                <X size={17} />
              </button>
            </div>

            <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[310px_minmax(0,1fr)]">
              <div>
                <label className="group relative flex aspect-[4/5] cursor-pointer items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-[#BDAA97] bg-[#EEE6DE] text-center transition hover:border-[#8D653B]">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt="Main product preview"
                      fill
                      unoptimized={
                        mainImage.startsWith("data:") ||
                        mainImage.startsWith("blob:")
                      }
                      sizes="310px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="px-8">
                      <UploadCloud
                        size={30}
                        className="mx-auto text-[#A17343]"
                      />
                      <span className="mt-4 block text-sm font-semibold text-[#342E29]">
                        Upload product images
                      </span>
                      <span className="mt-2 block text-[10px] leading-5 text-[#84786F]">
                        Up to {MAX_PRODUCT_IMAGES} images · 8 MB each
                      </span>
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={chooseImages}
                    className="sr-only"
                  />
                  {mainImage &&
                  existingImages.length + imageFiles.length <
                    MAX_PRODUCT_IMAGES ? (
                    <span className="absolute inset-x-4 bottom-4 rounded-full bg-black/65 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur">
                      Add another image
                    </span>
                  ) : null}
                </label>

                {existingImages.length || imagePreviews.length ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {existingImages.map((image, index) => (
                      <div
                        key={`existing-${index}-${image.slice(-24)}`}
                        className="group relative aspect-square overflow-hidden rounded-[16px] border border-[#DDD2C8] bg-white"
                      >
                        <Image
                          src={image}
                          alt={`Saved product image ${index + 1}`}
                          fill
                          unoptimized={image.startsWith("data:")}
                          sizes="90px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          aria-label={`Remove saved image ${index + 1}`}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-100 backdrop-blur transition sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                        {index === 0 ? (
                          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-2 py-1 text-[6px] font-bold uppercase tracking-[0.12em] text-[#5B4A3D]">
                            Main
                          </span>
                        ) : null}
                      </div>
                    ))}
                    {imagePreviews.map((image, index) => (
                      <div
                        key={`new-${image}`}
                        className="group relative aspect-square overflow-hidden rounded-[16px] border border-[#BFA67E] bg-white"
                      >
                        <Image
                          src={image}
                          alt={`New product image ${index + 1}`}
                          fill
                          unoptimized
                          sizes="90px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          aria-label={`Remove new image ${index + 1}`}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-100 backdrop-blur transition sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-[#E4BF7A] px-2 py-1 text-[6px] font-bold uppercase tracking-[0.12em] text-[#392617]">
                          New
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 flex items-start gap-2 rounded-[18px] border border-[#DAD0C6] bg-white/70 px-4 py-3">
                  <Boxes
                    size={14}
                    className="mt-0.5 shrink-0 text-[#A17343]"
                  />
                  <p className="text-[10px] leading-5 text-[#74695F]">
                    Free project mode optimises every image to premium WebP. The first image becomes the storefront cover.
                  </p>
                </div>

                <div className="mt-4 rounded-[20px] border border-[#DAD0C6] bg-white/70 p-4">
                  <label className="flex items-center justify-between gap-4">
                    <span>
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6E6259]">
                        Feature product
                      </span>
                      <span className="mt-1 block text-[10px] leading-5 text-[#948A82]">
                        Prioritise in curated sorting.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) =>
                        updateField(
                          "featured",
                          event.target.checked
                        )
                      }
                      className="h-5 w-5 accent-[#9B7040]"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className={labelClassName}>Product name</span>
                    <input
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Ivory Hand-Embroidered Saree"
                      className={inputClassName}
                    />
                  </label>

                  <label>
                    <span className={labelClassName}>Category</span>
                    <span className="relative block">
                      <select
                        value={form.category}
                        onChange={(event) => updateField("category", event.target.value as ProductCategory)}
                        className={`${inputClassName} appearance-none pr-10`}
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={15} className="pointer-events-none absolute right-4 top-[26px] text-[#887B71]" />
                    </span>
                  </label>

                  <label>
                    <span className={labelClassName}>Subcategory</span>
                    <input
                      value={form.subcategory}
                      onChange={(event) => updateField("subcategory", event.target.value)}
                      placeholder="sarees"
                      className={inputClassName}
                    />
                  </label>

                  <label>
                    <span className={labelClassName}>Selling price (₹)</span>
                    <input
                      inputMode="decimal"
                      value={form.price}
                      onChange={(event) => updateField("price", event.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder="4999"
                      className={inputClassName}
                    />
                  </label>

                  <label>
                    <span className={labelClassName}>Compare-at price (₹)</span>
                    <input
                      inputMode="decimal"
                      value={form.oldPrice}
                      onChange={(event) => updateField("oldPrice", event.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder="6499"
                      className={inputClassName}
                    />
                  </label>

                  <label>
                    <span className={labelClassName}>Stock quantity</span>
                    <input
                      inputMode="numeric"
                      value={form.stock}
                      onChange={(event) => updateField("stock", event.target.value.replace(/\D/g, ""))}
                      placeholder="24"
                      className={inputClassName}
                    />
                  </label>

                  <label>
                    <span className={labelClassName}>Badge</span>
                    <span className="relative block">
                      <select
                        value={form.badge}
                        onChange={(event) => updateField("badge", event.target.value as ProductBadge | "")}
                        className={`${inputClassName} appearance-none pr-10`}
                      >
                        {BADGES.map((badge) => (
                          <option key={badge || "none"} value={badge}>
                            {badge || "No badge"}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={15} className="pointer-events-none absolute right-4 top-[26px] text-[#887B71]" />
                    </span>
                  </label>

                  <label>
                    <span className={labelClassName}>SKU (optional)</span>
                    <input
                      value={form.sku}
                      onChange={(event) => updateField("sku", event.target.value.toUpperCase())}
                      placeholder="Auto-generated"
                      className={inputClassName}
                    />
                  </label>

                  <label>
                    <span className={labelClassName}>Sizes, comma separated</span>
                    <input
                      value={form.sizes}
                      onChange={(event) => updateField("sizes", event.target.value)}
                      placeholder="S, M, L, XL"
                      className={inputClassName}
                    />
                  </label>

                  <label>
                    <span className={labelClassName}>Colour name</span>
                    <input
                      value={form.colorName}
                      onChange={(event) => updateField("colorName", event.target.value)}
                      placeholder="Ivory"
                      className={inputClassName}
                    />
                  </label>

                  <label>
                    <span className={labelClassName}>Colour swatch</span>
                    <span className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-[#D9CEC3] bg-white px-3">
                      <input
                        type="color"
                        value={form.colorValue}
                        onChange={(event) => updateField("colorValue", event.target.value)}
                        className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
                      />
                      <span className="text-xs font-medium uppercase text-[#6F655D]">
                        {form.colorValue}
                      </span>
                    </span>
                  </label>

                  <label className="sm:col-span-2">
                    <span className={labelClassName}>Material</span>
                    <input
                      value={form.material}
                      onChange={(event) => updateField("material", event.target.value)}
                      placeholder="Premium silk blend"
                      className={inputClassName}
                    />
                  </label>

                  <label className="sm:col-span-2"><span className={labelClassName}>Product video URL (optional)</span><input value={form.videoUrl} onChange={(event)=>updateField("videoUrl",event.target.value)} placeholder="https://… or /videos/product.mp4" className={inputClassName}/></label>
                  <label><span className={labelClassName}>Model height</span><input value={form.modelHeight} onChange={(event)=>updateField("modelHeight",event.target.value)} placeholder="175 cm" className={inputClassName}/></label>
                  <label><span className={labelClassName}>Model worn size</span><input value={form.modelWornSize} onChange={(event)=>updateField("modelWornSize",event.target.value)} placeholder="S" className={inputClassName}/></label>
                  <label className="sm:col-span-2"><span className={labelClassName}>Model measurements</span><input value={form.modelMeasurements} onChange={(event)=>updateField("modelMeasurements",event.target.value)} placeholder="Bust 86 cm · Waist 64 cm · Hip 91 cm" className={inputClassName}/></label>

                  <label className="sm:col-span-2">
                    <span className={labelClassName}>Short description</span>
                    <textarea
                      value={form.shortDescription}
                      onChange={(event) => updateField("shortDescription", event.target.value)}
                      placeholder="One refined sentence for product cards and search."
                      className={`${inputClassName} h-24 resize-none py-3 leading-6`}
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className={labelClassName}>Full description</span>
                    <textarea
                      value={form.description}
                      onChange={(event) => updateField("description", event.target.value)}
                      placeholder="Describe the design, finish and styling intent."
                      className={`${inputClassName} h-28 resize-none py-3 leading-6`}
                    />
                  </label>
                </div>

                {errorMessage ? (
                  <div role="alert" className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-xs leading-6 text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                {isSaving ? (
                  <div className="rounded-[18px] border border-[#DED2C5] bg-white/75 p-4">
                    <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.17em] text-[#74685E]">
                      <span>
                        {imageFiles.length
                          ? `Optimising ${imageFiles.length} ${imageFiles.length === 1 ? "image" : "images"}`
                          : "Saving catalogue changes"}
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E6DDD4]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#B4824B,#6D54D8)] transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="sticky bottom-0 z-20 flex flex-col gap-3 border-t border-[#DED4CB] bg-[#F7F2EC]/95 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex rounded-full border border-[#D7CCC1] bg-white p-1">
                {(["published", "draft"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateField("status", status)}
                    className={`rounded-full px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.14em] transition ${
                      form.status === status
                        ? "bg-[#1C1917] text-white"
                        : "text-[#776C63]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#1C1917,#382D35)] px-7 text-[9px] font-bold uppercase tracking-[0.17em] text-white shadow-[0_14px_30px_rgba(25,21,19,.2)] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isSaving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : editingProduct ? (
                  <Edit3 size={15} />
                ) : (
                  <PackagePlus size={15} />
                )}
                {isSaving
                  ? editingProduct
                    ? "Updating product"
                    : "Creating product"
                  : editingProduct
                    ? form.status === "published"
                      ? "Update & publish"
                      : "Update private draft"
                  : form.status === "published"
                    ? "Publish product"
                    : "Save private draft"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {deleteTarget ? (
        <div
          className="fixed inset-0 z-[280] flex items-end justify-center bg-[#110F0E]/70 p-0 backdrop-blur-md sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-product-title"
        >
          <button
            type="button"
            aria-label="Cancel product deletion"
            onClick={() =>
              busyProductId
                ? undefined
                : setDeleteTarget(null)
            }
            className="absolute inset-0"
          />
          <section className="relative w-full max-w-md rounded-t-[32px] border border-white/80 bg-[#FBF8F4] p-6 shadow-[0_36px_110px_rgba(0,0,0,.38)] sm:rounded-[32px] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>
            <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#A4723D]">
              Permanent removal
            </p>
            <h2
              id="delete-product-title"
              className="mt-2 font-[var(--font-heading)] text-3xl leading-tight text-[#1D1917]"
            >
              Delete {deleteTarget.name}?
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#756B63]">
              This removes the cloud product and its uploaded images. Archive it instead if you may sell it again later.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={Boolean(busyProductId)}
                onClick={() => setDeleteTarget(null)}
                className="h-12 rounded-full border border-[#D8CEC4] bg-white text-[9px] font-semibold uppercase tracking-[0.14em] text-[#514941] disabled:opacity-40"
              >
                Keep product
              </button>
              <button
                type="button"
                disabled={Boolean(busyProductId)}
                onClick={() => void confirmDeleteProduct()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red-600 text-[9px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_rgba(220,38,38,.2)] disabled:opacity-50"
              >
                {busyProductId ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete forever
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
