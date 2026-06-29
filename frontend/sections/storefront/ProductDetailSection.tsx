"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShoppingCart, ChevronLeft, Minus, Plus,
  Package, Star, Share2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/custom-components/ui/Badge";
import { Button } from "@/custom-components/ui/Button";
import { Heading, Paragraph, Caption } from "@/custom-components/ui/Typography";
import { Divider } from "@/custom-components/ui/Divider";
import { Alert } from "@/custom-components/ui/Alert";
import { ProductGrid } from "@/custom-components/product/ProductGrid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addLocalItem, openCart } from "@/store/slices/cartSlice";
import { useGetProductByIdQuery, useGetRelatedProductsQuery } from "@/services/productsService";
import { useAddToCartMutation } from "@/services/cartService";

export function ProductDetailSection() {
  const params = useParams();
  const id = params?.id as string;

  const dispatch = useAppDispatch();
  const { role } = useAppSelector((s) => s.auth);

  const { data: product, isLoading, isError } = useGetProductByIdQuery(id, { skip: !id });
  const { data: related = [] } = useGetRelatedProductsQuery({ productId: id }, { skip: !id });
  const [addToCart, { isLoading: cartLoading }] = useAddToCartMutation();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Heading size="xl" className="mb-3">Product not found</Heading>
        <Paragraph variant="muted" className="mb-6">This product doesn&apos;t exist or has been removed.</Paragraph>
        <Link href="/shop"><Button variant="primary">Back to shop</Button></Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const maxQty = Math.min(product.stock, 10);

  const handleAddToCart = async () => {
    if (role === "guest") {
      dispatch(addLocalItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: qty,
        stock: product.stock,
      }));
      dispatch(openCart());
    } else {
      try {
        await addToCart({ productId: product._id, quantity: qty }).unwrap();
        dispatch(openCart());
      } catch {
        // ignore
      }
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        <Link href="/shop" className="hover:text-zinc-900 dark:text-zinc-50 transition-colors flex items-center gap-1">
          <ChevronLeft className="h-3.5 w-3.5" /> Shop
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-zinc-900 dark:text-zinc-50 transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-50 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">

        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {product.originalPrice && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 dark:bg-zinc-900/60 flex items-center justify-center">
              <Badge variant="danger" size="md">Out of stock</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <Badge variant="default" size="sm" className="mb-3">{product.category}</Badge>
            <Heading as="h1" size="2xl" className="mb-2 leading-tight">{product.name}</Heading>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-zinc-200 dark:text-zinc-700 fill-zinc-200"}`} />
                ))}
              </div>
              <Caption>4.0 (128 reviews)</Caption>
            </div>
          </div>

          <Divider />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <Caption className="line-through text-zinc-400 dark:text-zinc-500">
                {formatPrice(product.originalPrice)}
              </Caption>
            )}
          </div>

          {/* Stock status */}
          {isLowStock && (
            <Alert variant="warning">
              Only <strong>{product.stock} units</strong> left in stock — order soon.
            </Alert>
          )}
          {isOutOfStock && (
            <Alert variant="danger">This item is currently out of stock.</Alert>
          )}
          {!isOutOfStock && !isLowStock && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <Package className="h-4 w-4" />
              In stock ({product.stock} available)
            </div>
          )}

          <Divider />

          {/* Description */}
          <div>
            <Heading size="sm" className="mb-2">Description</Heading>
            <Paragraph variant="muted" size="sm">{product.description}</Paragraph>
          </div>

          {/* Qty + Add to cart */}
          {!isOutOfStock && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Heading size="sm">Quantity</Heading>
                <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex items-center justify-center h-10 w-10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-zinc-900 dark:text-zinc-50">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(maxQty, qty + 1))}
                    disabled={qty >= maxQty}
                    className="flex items-center justify-center h-10 w-10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Caption>Max {maxQty} per order</Caption>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  leftIcon={<ShoppingCart className="h-5 w-5" />}
                >
                  {added ? "Added!" : cartLoading ? "Adding..." : "Add to cart"}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  aria-label="Share product"
                  onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          <Divider />
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Category", value: product.category },
              { label: "SKU", value: `SKU-${product._id.slice(-6).toUpperCase()}` },
              { label: "Free shipping", value: product.price >= 50 ? "Yes" : "On orders over £50" },
              { label: "Returns", value: "30-day returns" },
            ].map(({ label, value }) => (
              <div key={label}>
                <Caption className="block mb-0.5">{label}</Caption>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <Heading size="xl">You might also like</Heading>
            <Link href={`/shop?category=${product.category}`}>
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
