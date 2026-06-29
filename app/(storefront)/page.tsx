import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogSection } from "@/sections/storefront/CatalogSection";
import { SkeletonCard } from "@/custom-components/ui/Skeleton";

export const metadata: Metadata = { title: "Shop | ShopHub" };

function CatalogFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

export default function StorefrontHome() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogSection />
    </Suspense>
  );
}
