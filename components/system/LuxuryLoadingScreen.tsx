import { Gem } from "lucide-react";

import LuxuryStateShell from "@/components/system/LuxuryStateShell";

export default function LuxuryLoadingScreen() {
  return (
    <LuxuryStateShell
      eyebrow="Curating your experience"
      title={
        <>
          Preparing your
          <span className="block italic text-[#684BF0]">private edit.</span>
        </>
      }
      description="Styloverse is arranging every detail of your next view. This moment will only take a little while."
      code="S"
      icon={
        <span className="relative flex h-7 w-7 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#684BF0]/20" />
          <Gem size={23} className="relative animate-pulse" />
        </span>
      }
    >
      <div
        className="mt-9 h-1.5 max-w-sm overflow-hidden rounded-full bg-[#DDD2C7]"
        role="progressbar"
        aria-label="Loading Styloverse"
      >
        <span className="block h-full w-2/5 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,#B9854F,#684BF0)]" />
      </div>
    </LuxuryStateShell>
  );
}
