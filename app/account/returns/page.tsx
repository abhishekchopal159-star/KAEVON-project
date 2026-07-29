import type { Metadata } from "next";
import AccountLayout from "@/components/account/AccountLayout";
import ReturnCenter from "@/components/account/ReturnCenter";
export const metadata: Metadata = { title:"Returns & Exchanges" };
export default function ReturnsPage(){return <AccountLayout pageTitle="Aftercare"><ReturnCenter/></AccountLayout>;}

