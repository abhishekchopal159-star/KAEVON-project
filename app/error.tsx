"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

import LuxuryStateShell from "@/components/system/LuxuryStateShell";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({
  error,
  unstable_retry,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <LuxuryStateShell
      eyebrow="A temporary interruption"
      title={
        <>
          The experience needs
          <span className="block italic text-[#684BF0]">one more moment.</span>
        </>
      }
      description="Something unexpected interrupted this page. Your account and shopping selections remain safe—please try the experience again."
      code={error.digest ? "ERR" : "01"}
      icon={<RefreshCw size={23} />}
      actions={
        <>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#171517] px-6 text-[11px] font-semibold !text-white shadow-[0_14px_35px_rgba(23,21,23,0.2)]"
          >
            <span className="!text-white">Try again</span>
            <RefreshCw size={14} className="!text-white" />
          </button>
          <Link
            href="/"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[#CFC1B4] bg-white/65 px-6 text-[11px] font-semibold text-[#171513]"
          >
            Return home <ArrowRight size={14} />
          </Link>
        </>
      }
    />
  );
}
