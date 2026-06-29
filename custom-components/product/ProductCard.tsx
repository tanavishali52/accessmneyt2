"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { Badge } from "@/custom-components/ui/Badge";
import { Button } from "@/custom-components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addLocalItem, openCart } from "@/store/slices/cartSlice";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((s) => s.auth);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (role === "guest") {
      dispatch(
        addLocalItem({
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
          stock: product.stock,
        })
      );
      dispatch(openCart());
    }
    // user/admin: handled by cartService in ProductDetailSection
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/products/${product._id}`} className={cn("group block", className)}>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {isOutOfStock && <Badge variant="danger" size="sm">Out of stock</Badge>}
            {isLowStock && <Badge variant="warning" size="sm">Only {product.stock} left</Badge>}
          </div>
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 bg-white text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
              <Eye className="h-3.5 w-3.5" /> Quick view
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2">
          <Badge variant="default" size="sm" className="self-start">{product.category}</Badge>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug flex-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2 mt-auto pt-2">
            <span className="text-base font-bold text-slate-900">{formatPrice(product.price)}</span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              leftIcon={<ShoppingCart className="h-3.5 w-3.5" />}
              className="shrink-0"
            >
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
