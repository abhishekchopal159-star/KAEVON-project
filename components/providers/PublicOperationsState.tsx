"use client";

import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import { subscribeToPublicStoreSettings } from "@/services/settings.service";

export default function PublicOperationsState(){const [maintenance,setMaintenance]=useState(false);useEffect(()=>subscribeToPublicStoreSettings((settings)=>setMaintenance(settings.maintenanceMode),()=>undefined),[]);if(!maintenance)return null;return <div role="status" className="fixed inset-x-0 top-0 z-[300] flex min-h-10 items-center justify-center gap-2 bg-[#1B1816] px-4 text-center text-[8px] font-bold uppercase tracking-[.15em] text-[#E2B879]"><Wrench size={12}/> The house is receiving scheduled care. Browsing remains available; purchasing is temporarily paused.</div>}
