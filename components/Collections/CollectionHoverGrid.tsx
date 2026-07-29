"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export type CollectionPreview = {
  name: string;
  href: string;
  eyebrow: string;
  products: Array<{
    name: string;
    image: string;
  }>;
};

type CollectionHoverGridProps = {
  collections: CollectionPreview[];
};

const IMAGE_CHANGE_INTERVAL = 1250;

function CollectionCard({
  collection,
  position,
}: {
  collection: CollectionPreview;
  position: number;
}) {
  const [activeImage, setActiveImage] =
    useState(0);
  const [isHovered, setIsHovered] =
    useState(false);
  const cardRef =
    useRef<HTMLAnchorElement | null>(null);
  const intervalRef =
    useRef<number | null>(null);

  const stopImageRotation = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(
        intervalRef.current
      );
      intervalRef.current = null;
    }
  }, []);

  const beginImageRotation = useCallback((reset: boolean) => {
    stopImageRotation();
    setIsHovered(true);

    if (reset) {
      setActiveImage(0);
    }

    if (
      collection.products.length < 2 ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    intervalRef.current =
      window.setInterval(() => {
        setActiveImage(
          (currentImage) =>
            (currentImage + 1) %
            collection.products.length
        );
      }, IMAGE_CHANGE_INTERVAL);
  }, [collection.products.length, stopImageRotation]);

  function startImageRotation() {
    if (
      window.matchMedia("(max-width: 767px)")
        .matches
    ) {
      return;
    }

    beginImageRotation(true);
  }

  function resetImageRotation() {
    if (
      window.matchMedia("(max-width: 767px)")
        .matches
    ) {
      return;
    }

    stopImageRotation();
    setIsHovered(false);
    setActiveImage(0);
  }

  useEffect(() => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const observedCard = card;

    const phoneViewport = window.matchMedia(
      "(max-width: 767px)"
    );
    let observer: IntersectionObserver | null =
      null;

    function stopMobilePreview() {
      stopImageRotation();
      setIsHovered(false);
    }

    function configureMobilePreview() {
      observer?.disconnect();
      stopMobilePreview();

      if (!phoneViewport.matches) {
        setActiveImage(0);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (
            entry?.isIntersecting &&
            entry.intersectionRatio >= 0.52
          ) {
            beginImageRotation(false);
            return;
          }

          stopMobilePreview();
        },
        {
          rootMargin: "-8% 0px -12% 0px",
          threshold: [0, 0.35, 0.52, 0.72],
        }
      );
      observer.observe(observedCard);
    }

    configureMobilePreview();
    phoneViewport.addEventListener(
      "change",
      configureMobilePreview
    );

    return () => {
      observer?.disconnect();
      phoneViewport.removeEventListener(
        "change",
        configureMobilePreview
      );
      stopImageRotation();
    };
  }, [beginImageRotation, stopImageRotation]);

  const activeProduct =
    collection.products[activeImage] ??
    collection.products[0];

  if (!activeProduct) {
    return null;
  }

  return (
    <Link
      ref={cardRef}
      href={collection.href}
      onMouseEnter={startImageRotation}
      onMouseLeave={resetImageRotation}
      onFocus={startImageRotation}
      onBlur={resetImageRotation}
      className="group relative isolate min-h-[390px] overflow-hidden rounded-[30px] border border-[#DCD2C7] bg-[#E8DED4] shadow-[0_18px_55px_rgba(40,29,20,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-[#C79A63]/55 hover:shadow-[0_30px_85px_rgba(50,34,20,0.20)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5B3DF5]/25 md:rounded-[34px] md:bg-[#17151A]"
    >
      <div className="absolute inset-0 overflow-hidden">
        {collection.products.map(
          (product, imageIndex) => {
            const isActive =
              imageIndex === activeImage;

            return (
              <Image
                key={`${collection.name}-${product.name}`}
                src={product.image}
                alt={isActive ? product.name : ""}
                fill
                priority={position < 3 && imageIndex === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover object-top transition-[opacity,transform,filter] duration-700 ease-out ${
                  isActive
                    ? "scale-100 opacity-100 blur-0"
                    : "scale-[1.045] opacity-0 blur-[2px]"
                } ${
                  isHovered
                    ? "group-hover:scale-[1.035]"
                    : ""
                }`}
              />
            );
          }
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/80 transition duration-500 group-hover:from-black/10 group-hover:via-transparent group-hover:to-black/90 md:from-black/20 md:via-black/[0.03] md:to-black/85" />
      <div className="absolute inset-0 opacity-0 ring-1 ring-inset ring-white/25 transition duration-500 group-hover:opacity-100" />
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#7457FF]/0 blur-[80px] transition duration-700 group-hover:bg-[#7457FF]/20" />

      <div className="relative z-10 flex min-h-[390px] flex-col justify-between p-7 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="text-[10px] font-semibold tracking-[0.3em] text-white/70">
            {String(position + 1).padStart(
              2,
              "0"
            )}
          </span>

          <span
            className={`flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/75 backdrop-blur-md transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Sparkles
              size={12}
              className="text-[#E1B77F]"
            />
            Live Edit
          </span>
        </div>

        <div>
          <div className="mb-5 flex gap-2">
            {collection.products.map(
              (product, imageIndex) => (
                <span
                  key={`${collection.name}-indicator-${product.name}`}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    imageIndex === activeImage
                      ? "w-8 bg-[#E1B77F]"
                      : "w-2 bg-white/35"
                  }`}
                />
              )
            )}
          </div>

          <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#E1B77F]">
            {collection.eyebrow}
          </p>

          <div className="mt-2 flex items-end justify-between gap-5">
            <div className="min-w-0">
              <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white sm:text-[34px]">
                {collection.name}
              </h2>

              <p className="mt-2 truncate text-xs font-medium text-white/60 transition-all duration-500">
                {activeProduct.name}
              </p>
            </div>

            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:border-[#E1B77F]/70 group-hover:bg-[#E1B77F] group-hover:text-[#17120E]">
              <ArrowUpRight size={19} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CollectionHoverGrid({
  collections,
}: CollectionHoverGridProps) {
  return (
    <div
      id="collection-preview-grid"
      className="mt-14 grid scroll-mt-28 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {collections.map(
        (collection, position) => (
          <CollectionCard
            key={collection.href}
            collection={collection}
            position={position}
          />
        )
      )}
    </div>
  );
}
