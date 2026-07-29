import type { Metadata } from "next";

import AccountLayout from "@/components/account/AccountLayout";
import PersonalizationStudio from "@/components/personalization/PersonalizationStudio";

export const metadata:Metadata={title:"Private Style Atelier",robots:{index:false,follow:false}};
export default function StyleAtelierPage(){return <AccountLayout pageTitle="Private Style Atelier"><PersonalizationStudio/></AccountLayout>}
