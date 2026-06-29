import type { Metadata } from "next";
import { SaleSection } from "@/sections/storefront/SaleSection";

export const metadata: Metadata = { title: "Sale | ShopHub" };

export default function SalePage() {
  return <SaleSection />;
}
