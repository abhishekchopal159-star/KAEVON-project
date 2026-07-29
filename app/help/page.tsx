import type { Metadata } from "next";
import HelpCenter from "@/components/support/HelpCenter";

export const metadata: Metadata = { title: "Client Care | Styloverse", description: "Styloverse shipping, returns, refunds and private client support." };
export default function HelpPage() { return <HelpCenter/>; }
