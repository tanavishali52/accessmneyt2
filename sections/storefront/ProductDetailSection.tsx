"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShoppingCart, ChevronLeft, Minus, Plus,
  Package, Star, Share2,
} from "lucide-react";
import { getProductById, getRelatedProducts } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/custom-components/ui/Badge";
import { Button } from "@/custom-components/ui/Button";
import { Heading, Paragraph, Caption } from "@/custom-components/ui/Typography";
import { Divider } from "@/custom-components/ui/Divider";
import { Alert } from "@/custom-components/ui/Alert";
import { ProductGrid } from "@/custom-components/product/ProductGrid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addLocalItem, openCart } from "@/store/slices/cartSlice";

export function ProductDetailSection() {
  const params = useParams();
  const id = params?.id as string;

  const dispatch = useAppDispatch();
  const { role } = useAppSelector((s) => s.auth);

  const product = getProductById(id);
  const related = getRelatedProducts(id, 4);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Heading size="xl" className="mb-3">Product not found</Heading>
        <Paragraph variant="muted" className="mb-6">This product doesn&apos;t exist or has been removed.</Paragraph>
        <Link href="/"><Button variant="primary">Back to shop</Button></Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const maxQty = Math.min(product.stock, 10);

  const handleAddToCart = () => {
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
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
          <ChevronLeft className="h-3.5 w-3.5" /> Shop
        </Link>
        <span>/</span>
        <Link href={`/?category=${product.category}`} className="hover:text-slate-900 transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">

        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <Badge variant="danger" size="md">Out of stock</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <Badge variant="default" size="sm" className="mb-3">{product.category}</Badge>
            <Heading as="h1" size="2xl" className="mb-2 leading-tight">{product.name}</Heading>

            {/* Mock rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
                ))}
              </div>
              <Caption>4.0 (128 reviews)</Caption>
            </div>
          </div>

          <Divider />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">{formatPrice(product.price)}</span>
            {product.price > 50 && (
              <Caption className="line-through text-slate-400">
                {formatPrice(product.price * 1.2)}
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
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex items-center justify-center h-10 w-10 text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(maxQty, qty + 1))}
                    disabled={qty >= maxQty}
                    className="flex items-center justify-center h-10 w-10 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
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
                  leftIcon={<ShoppingCart className="h-5 w-5" />}
                >
                  {added ? "Added!" : "Add to cart"}
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

          {/* Meta info */}
          <Divider />
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Category", value: product.category },
              { label: "SKU", value: `SKU-${product._id.padStart(5, "0")}` },
              { label: "Free shipping", value: product.price >= 50 ? "Yes" : "On orders over £50" },
              { label: "Returns", value: "30-day returns" },
            ].map(({ label, value }) => (
              <div key={label}>
                <Caption className="block mb-0.5">{label}</Caption>
                <span className="font-medium text-slate-700">{value}</span>
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
            <Link href={`/?category=${product.category}`}>
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
