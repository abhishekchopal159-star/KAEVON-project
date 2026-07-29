"use client";

import {
  useEffect,
  useState,
  type MouseEvent,
} from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Images,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { Product } from "@/data/products";

type ProductGalleryProps = {
  product: Product;
};

type ZoomPosition = {
  x: number;
  y: number;
};

export default function ProductGallery({
  product,
}: ProductGalleryProps) {
  const galleryImages = Array.from(
    new Set(
      [product.image, ...product.images].filter(
        (image): image is string => Boolean(image)
      )
    )
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] =
    useState<ZoomPosition>({
      x: 50,
      y: 50,
    });

  const activeImage =
    galleryImages[activeIndex] ?? product.image;

  useEffect(() => {
    const resetTimer =
      window.setTimeout(() => {
        setActiveIndex(0);
        setIsZoomed(false);
        setZoomPosition({
          x: 50,
          y: 50,
        });
      }, 0);

    return () => {
      window.clearTimeout(
        resetTimer
      );
    };
  }, [product.id]);

  const selectImage = (index: number) => {
    setActiveIndex(index);
    setIsZoomed(false);
    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  const showPreviousImage = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === 0) {
        return galleryImages.length - 1;
      }

      return currentIndex - 1;
    });

    setIsZoomed(false);
  };

  const showNextImage = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === galleryImages.length - 1) {
        return 0;
      }

      return currentIndex + 1;
    });

    setIsZoomed(false);
  };

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (!isZoomed) {
      return;
    }

    const bounds =
      event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - bounds.left) / bounds.width) *
      100;

    const y =
      ((event.clientY - bounds.top) / bounds.height) *
      100;

    setZoomPosition({
      x,
      y,
    });
  };

  const resetZoomPosition = () => {
    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  return (
    <div className="w-full">
      {/* Gallery Heading */}

      <div className="mb-4 flex items-end justify-between gap-4 md:mb-6 md:gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#A67C52]">
            <Sparkles size={16} />

            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] md:text-xs md:tracking-[0.3em]">
              Product Gallery
            </p>
          </div>

          <h2 className="mt-2 text-xl font-semibold text-[#171717] md:text-2xl">
            Explore every detail
          </h2>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-[#E8E1D8] bg-white px-4 py-2 text-sm text-gray-500 shadow-sm sm:flex">
          <Images size={16} />

          {galleryImages.length}{" "}
          {galleryImages.length === 1
            ? "Image"
            : "Images"}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[96px_minmax(0,1fr)]">
        {/* Thumbnail Images */}

        <div className="order-2 flex gap-3 overflow-x-auto pb-2 xl:order-1 xl:flex-col xl:overflow-visible xl:pb-0">
          {galleryImages.map((image, index) => {
            const isSelected = activeIndex === index;

            return (
              <button
                key={`${product.id}-${image}-${index}`}
                type="button"
                onClick={() => selectImage(index)}
                aria-label={`View ${product.title} image ${
                  index + 1
                }`}
                aria-pressed={isSelected}
                className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isSelected
                    ? "border-[#5B3DF5] shadow-[0_10px_30px_rgba(91,61,245,0.18)] ring-2 ring-[#5B3DF5]/15"
                    : "border-[#E8E1D8] hover:-translate-y-1 hover:border-[#5B3DF5]/50 hover:shadow-lg"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} thumbnail ${
                    index + 1
                  }`}
                  fill
                  unoptimized={image.startsWith("data:")}
                  sizes="96px"
                  className="object-contain p-2"
                />

                {isSelected && (
                  <span className="absolute inset-x-3 bottom-1 h-1 rounded-full bg-[#5B3DF5]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Product Image */}

        <div className="order-1 xl:order-2">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={resetZoomPosition}
            className={`relative h-[430px] overflow-hidden rounded-[28px] border border-[#E8E1D8] bg-gradient-to-br from-white via-[#FBF8F4] to-[#F2ECE5] shadow-[0_22px_58px_rgba(41,30,20,0.10)] md:h-[620px] md:rounded-[36px] md:shadow-[0_30px_80px_rgba(41,30,20,0.10)] ${
              isZoomed
                ? "cursor-zoom-out"
                : "cursor-zoom-in"
            }`}
          >
            {/* Decorative Background */}

            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#5B3DF5]/5 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#A67C52]/10 blur-3xl" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7),transparent_65%)]" />

            {/* Badges */}

            <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2 md:left-6 md:top-6 md:gap-3">
              {product.badge && (
                <span className="rounded-full bg-[#171717] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg md:px-4 md:py-2 md:text-xs md:tracking-[0.2em]">
                  {product.badge}
                </span>
              )}

              {product.isNew && (
                <span className="rounded-full bg-[#5B3DF5] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg md:px-4 md:py-2 md:text-xs md:tracking-[0.2em]">
                  New Arrival
                </span>
              )}
            </div>

            {/* Zoom Button */}

            <button
              type="button"
              onClick={() =>
                setIsZoomed(
                  (currentValue) => !currentValue
                )
              }
              aria-label={
                isZoomed
                  ? "Zoom out product image"
                  : "Zoom in product image"
              }
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#171717] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#171717] hover:text-white md:right-6 md:top-6 md:h-12 md:w-12"
            >
              {isZoomed ? (
                <ZoomOut size={20} />
              ) : (
                <ZoomIn size={20} />
              )}
            </button>

            {/* Main Image */}

            <Image
              src={activeImage}
              alt={`${product.title} product image`}
              fill
              priority
              unoptimized={activeImage.startsWith("data:")}
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
              className={`z-10 object-contain p-6 transition-transform duration-500 ease-out md:p-10 ${
                isZoomed
                  ? "scale-[1.65]"
                  : "scale-100"
              }`}
            />

            {/* Previous and Next Buttons */}

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  aria-label="View previous product image"
                  className="absolute left-6 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#171717] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#171717] hover:text-white"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={showNextImage}
                  aria-label="View next product image"
                  className="absolute right-6 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#171717] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#171717] hover:text-white"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Bottom Information */}

            <div className="absolute inset-x-4 bottom-4 z-30 flex items-center justify-between gap-3 md:inset-x-6 md:bottom-6 md:gap-4">
              <div className="rounded-full border border-white/70 bg-white/90 px-3 py-2 text-[10px] font-medium text-[#171717] shadow-lg backdrop-blur-md md:px-4 md:text-sm">
                Image {activeIndex + 1} of{" "}
                {galleryImages.length}
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsZoomed(
                    (currentValue) => !currentValue
                  )
                }
                className="flex items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-[10px] font-medium text-[#171717] shadow-lg backdrop-blur-md transition hover:bg-[#171717] hover:text-white md:gap-2 md:px-4 md:text-sm"
              >
                <Expand size={16} />

                {isZoomed
                  ? "Reset view"
                  : "Inspect details"}
              </button>
            </div>
          </div>

          {/* Gallery Help */}

          <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#E8E1D8] bg-white px-4 py-3 text-[10px] leading-4 text-gray-500 shadow-sm md:mt-4 md:px-5 md:py-4 md:text-sm">
            <p>
              Move your cursor after zooming to inspect
              product details.
            </p>

            <span className="hidden font-semibold text-[#171717] sm:inline">
              SKU: {product.sku}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
