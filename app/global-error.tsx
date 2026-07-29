"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function GlobalError({
  error,
  unstable_retry,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="m-0 bg-[#171517] text-white antialiased">
        <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#171517,#29212E_58%,#493664)] px-5 py-10">
          <div className="pointer-events-none absolute -right-36 -top-36 h-[500px] w-[500px] rounded-full bg-[#896CFF]/25 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-[#D2A060]/15 blur-[120px]" />

          <section className="relative w-full max-w-xl rounded-[34px] border border-white/12 bg-white/[0.07] p-7 text-center shadow-[0_35px_100px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-12">
            <p className="text-[24px] tracking-[0.16em]">
              STYLO<span className="text-[#B6A6FF]">V</span>ERSE
            </p>
            <div className="mx-auto mt-10 flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/12 bg-white/[0.08] text-[#E1B678]">
              <RefreshCw size={23} />
            </div>
            <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#E1B678]">
              Experience interrupted
            </p>
            <h1 className="mt-3 font-serif text-[42px] leading-[0.96] tracking-[-0.04em] sm:text-[54px]">
              Let us restore
              <span className="block italic text-[#CFC2FF]">the experience.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[12px] leading-6 text-white/55">
              A temporary issue affected the application shell. Your saved
              selections remain protected.
            </p>
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-white px-7 text-[11px] font-semibold !text-[#171517]"
            >
              <span className="!text-[#171517]">Restore Styloverse</span>
              <RefreshCw size={14} className="!text-[#171517]" />
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
