import type { Metadata } from "next";
import { getProductById } from "@/lib/mockData";
import { ProductDetailSection } from "@/sections/storefront/ProductDetailSection";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  return {
    title: product ? `${product.name} | ShopHub` : "Product | ShopHub",
    description: product?.description,
  };
}

export default function ProductDetailPage() {
  return <ProductDetailSection />;
}
