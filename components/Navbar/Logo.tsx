import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex flex-col items-start leading-none select-none"
    >
      {/* Brand */}
      <h1 className="font-[var(--font-heading)] text-[30px] sm:text-[34px] lg:text-[38px] tracking-[0.08em] text-[#1F1F1F]">
        STYLO<span className="text-[#5B3DF5]">V</span>ERSE
      </h1>

      {/* Tagline */}
      <div className="mt-2 flex items-center gap-3">
        <span className="h-px w-8 bg-[#CFC7BE]" />

        <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#666] whitespace-nowrap">
          Elevate Your Style
        </span>

        <span className="h-px w-8 bg-[#CFC7BE]" />
      </div>
    </Link>
  );
}