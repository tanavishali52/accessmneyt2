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
import { useAddToCartMutation } from "@/services/cartService";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((s) => s.auth);
  const [addToCart, { isLoading: cartLoading }] = useAddToCartMutation();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (role === "guest") {
      dispatch(addLocalItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
        stock: product.stock,
      }));
      dispatch(openCart());
    } else {
      try {
        await addToCart({ productId: product._id, quantity: 1 }).unwrap();
        dispatch(openCart());
      } catch {
        // silently fail — user sees cart
      }
    }
  };

  const isLowStock    = product.stock > 0 && product.stock <= 5;
  const isOutOfStock  = product.stock === 0;
  const discountPct   = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link href={`/products/${product._id}`} className={cn("group block", className)}>
      <div className="surface-glass border border-zinc-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {discountPct && (
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                -{discountPct}%
              </span>
            )}
            {isOutOfStock && <Badge variant="danger" size="sm">Out of stock</Badge>}
            {isLowStock && !discountPct && <Badge variant="warning" size="sm">Only {product.stock} left</Badge>}
          </div>
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
              <Eye className="h-3.5 w-3.5" /> Quick view
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2">
          <Badge variant="default" size="sm" className="self-start">{product.category}</Badge>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2 leading-snug flex-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2 mt-auto pt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock || cartLoading}
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
