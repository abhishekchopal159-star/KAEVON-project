import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import LuxuryStateShell from "@/components/system/LuxuryStateShell";

export default function NotFound() {
  return (
    <LuxuryStateShell
      eyebrow="The page has moved"
      title={
        <>
          This piece is
          <span className="block italic text-[#A56F38]">no longer here.</span>
        </>
      }
      description="The destination may have been renamed or removed from this edit. Return home or continue discovering the collection."
      code="404"
      icon={<Search size={23} />}
      actions={
        <>
          <Link
            href="/"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#171517] px-6 text-[11px] font-semibold !text-white shadow-[0_14px_35px_rgba(23,21,23,0.2)]"
          >
            <ArrowLeft size={14} className="!text-white" />
            <span className="!text-white">Return home</span>
          </Link>
          <Link
            href="/shop"
            className="inline-flex min-h-13 items-center justify-center rounded-full border border-[#CFC1B4] bg-white/65 px-6 text-[11px] font-semibold text-[#171513]"
          >
            Explore the collection
          </Link>
        </>
      }
    />
  );
}
