import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

type LuxuryStateShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  code: string;
  icon: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
};

export default function LuxuryStateShell({
  eyebrow,
  title,
  description,
  code,
  icon,
  actions,
  children,
}: LuxuryStateShellProps) {
  return (
    <main className="relative flex min-h-[100dvh] overflow-hidden bg-[#F3EDE6] px-4 py-5 text-[#171513] sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#7457FF]/12 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-36 h-[480px] w-[480px] rounded-full bg-[#C99659]/20 blur-[120px]" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[30px] border border-white/75 bg-white/55 shadow-[0_35px_110px_rgba(48,34,24,0.16)] backdrop-blur-xl sm:rounded-[42px]">
        <header className="flex items-center justify-between border-b border-[#493D34]/10 px-5 py-5 sm:px-9 sm:py-7">
          <Link
            href="/"
            aria-label="Return to Styloverse home"
            className="font-heading text-[22px] tracking-[0.13em] sm:text-[28px]"
          >
            STYLO<span className="text-[#684BF0]">V</span>ERSE
          </Link>
          <span className="hidden items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#7F7268] sm:inline-flex">
            <Sparkles size={12} className="text-[#B07A42]" />
            Private fashion house
          </span>
        </header>

        <div className="grid flex-1 md:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-[#D8CABC] bg-white/80 text-[#684BF0] shadow-[0_12px_35px_rgba(62,43,30,0.1)]">
              {icon}
            </div>

            <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#A16D39] sm:text-[10px]">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-2xl font-heading text-[43px] leading-[0.94] tracking-[-0.045em] sm:text-[58px] lg:text-[68px]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-[12px] leading-6 text-[#746B64] sm:text-[14px] sm:leading-7">
              {description}
            </p>

            {actions ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {actions}
              </div>
            ) : null}

            {children}
          </div>

          <aside className="relative hidden min-h-[560px] overflow-hidden bg-[linear-gradient(145deg,#171518_0%,#29212E_55%,#493664_100%)] p-10 text-white md:block">
            <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-[#8D72FF]/25 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-28 h-80 w-80 rounded-full bg-[#D4A260]/16 blur-[90px]" />
            <div className="absolute inset-7 rounded-[30px] border border-white/10" />
            <div className="absolute left-14 top-14 text-[9px] font-semibold uppercase tracking-[0.34em] text-white/42">
              Styloverse service
            </div>
            <div className="absolute inset-x-14 top-1/2 -translate-y-1/2">
              <p className="font-heading text-[120px] leading-none tracking-[-0.08em] text-white/[0.055] lg:text-[150px]">
                {code}
              </p>
              <div className="mt-5 h-px w-20 bg-[#D4A260]" />
              <p className="mt-5 max-w-[260px] font-heading text-[28px] leading-tight text-white/88">
                Every detail deserves a considered response.
              </p>
            </div>
            <p className="absolute bottom-14 left-14 text-[9px] uppercase tracking-[0.25em] text-white/32">
              Crafted with distinction · 2026
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
