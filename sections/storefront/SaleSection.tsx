"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tag, X } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { CATEGORIES } from "@/lib/constants";
import { ProductCard } from "@/custom-components/product/ProductCard";
import { EmptyState } from "@/custom-components/ui/EmptyState";

// Only show products that have a sale price
const SALE_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.originalPrice !== undefined);

// Categories present in sale products
const SALE_CATEGORIES = ["All", ...Array.from(new Set(SALE_PRODUCTS.map((p) => p.category)))];

export function SaleSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? SALE_PRODUCTS
    : SALE_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full">

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-zinc-950 dark:bg-black py-20 lg:py-28">
        {/* Decorative red glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <span className="inline-flex items-center gap-2 border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5">
            <Tag className="h-3.5 w-3.5" /> Limited Time
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[0.95] mb-5">
            SALE<br />
            <span className="text-red-500">UP TO 50% OFF</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Shop our best deals on premium products. Limited stock — grab yours before it&apos;s gone.
          </p>

          {/* Stat chips */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full">
              {SALE_PRODUCTS.length} deals live
            </span>
            <span className="bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-semibold px-4 py-2 rounded-full">
              Ends soon
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── FILTER + GRID ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-red-500 uppercase mb-1">Sale picks</p>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
              {filtered.length} Product{filtered.length !== 1 ? "s" : ""} on Sale
            </h2>
          </div>
          {activeCategory !== "All" && (
            <button
              onClick={() => setActiveCategory("All")}
              className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <X className="h-3 w-3" /> Clear filter
            </button>
          )}
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SALE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-sm border transition-all ${
                activeCategory === cat
                  ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
                  : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Tag className="h-8 w-8" />}
            title="No sale items in this category"
            description="Try a different category or check back soon for new deals."
            action={{ label: "View all deals", onClick: () => setActiveCategory("All") }}
          />
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center border-t border-zinc-100 dark:border-zinc-800 pt-10">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">Looking for more?</p>
          <Link href="/shop">
            <span className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-bold px-6 py-3 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
              BROWSE ALL PRODUCTS →
            </span>
          </Link>
        </div>
      </div>

    </div>
  );
}
