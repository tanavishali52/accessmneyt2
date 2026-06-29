"use client";
import { useState } from "react";
import { Eye, Search, X, ShoppingBag } from "lucide-react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/services/ordersService";
import type { Order, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { AdminPageWrapper } from "@/custom-components/layout/PageWrapper";
import { Badge } from "@/custom-components/ui/Badge";
import { Button } from "@/custom-components/ui/Button";
import { EmptyState } from "@/custom-components/ui/EmptyState";

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_VARIANT: Record<OrderStatus, "warning" | "info" | "default" | "success" | "danger"> = {
  pending:    "warning",
  processing: "info",
  shipped:    "default",
  delivered:  "success",
  cancelled:  "danger",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    "Pending",
  processing: "Processing",
  shipped:    "Shipped",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
};

const PAYMENT_VARIANT: Record<Order["paymentStatus"], "success" | "warning" | "danger"> = {
  paid:    "success",
  pending: "warning",
  failed:  "danger",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

// ─── Stat Chips ───────────────────────────────────────────────────────────────

interface StatChipProps {
  label: string;
  count: number;
  variant: "warning" | "info" | "default" | "success" | "danger";
  active: boolean;
  onClick: () => void;
}

function StatChip({ label, count, variant, active, onClick }: StatChipProps) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none";

  const variantStyles: Record<string, string> = {
    warning:  active ? "bg-amber-500  border-amber-500  text-white"  : "bg-amber-50  dark:bg-amber-950/40  border-amber-200  dark:border-amber-800  text-amber-700  dark:text-amber-400",
    info:     active ? "bg-violet-600 border-violet-600 text-white"  : "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400",
    default:  active ? "bg-purple-600 border-purple-600 text-white"  : "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400",
    success:  active ? "bg-green-600  border-green-600  text-white"  : "bg-green-50  dark:bg-green-950/40  border-green-200  dark:border-green-800  text-green-700  dark:text-green-400",
    danger:   active ? "bg-red-600    border-red-600    text-white"  : "bg-red-50    dark:bg-red-950/40    border-red-200    dark:border-red-800    text-red-700    dark:text-red-400",
  };

  return (
    <button className={`${base} ${variantStyles[variant]}`} onClick={onClick}>
      {label}
      <span className={`rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold ${active ? "bg-white/25 text-white" : "bg-zinc-200/60 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"}`}>
        {count}
      </span>
    </button>
  );
}

// ─── Status Select (inline) ───────────────────────────────────────────────────

interface StatusSelectProps {
  value: OrderStatus;
  onChange: (next: OrderStatus) => void;
}

function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      onClick={(e) => e.stopPropagation()}
      className="mt-1.5 block text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
    >
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
      ))}
    </select>
  );
}

// ─── Order Detail Modal ────────────────────────────────────────────────────────

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, next: OrderStatus) => void;
}

function OrderDetailModal({ order, onClose, onStatusChange }: OrderDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5">Order</p>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono">{order._id}</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{formatOrderDate(order.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Customer */}
          <section>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-2">Customer</p>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{order.shippingAddress?.fullName ?? "—"}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{"User " + order.userId.slice(-6)}</p>
            </div>
          </section>

          {/* Items */}
          <section>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-2">
              Items ({order.items.length})
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{item.name}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 shrink-0 ml-4">
                    {formatPrice(item.quantity * item.price)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Payment & Total */}
          <section>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-2">Payment</p>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={PAYMENT_VARIANT[order.paymentStatus]} dot>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </Badge>
              </div>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">{formatPrice(order.total)}</p>
            </div>
          </section>

          {/* Status */}
          <section>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-2">Order Status</p>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-3 flex items-center gap-3">
              <Badge variant={STATUS_VARIANT[order.status]} dot>
                {STATUS_LABEL[order.status]}
              </Badge>
              <StatusSelect
                value={order.status as OrderStatus}
                onChange={(next) => onStatusChange(order._id, next)}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function OrdersSection() {
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [openOrder, setOpenOrder] = useState<Order | null>(null);

  // Status counts from current orders state
  const statusCounts = ALL_STATUSES.reduce<Record<OrderStatus, number>>(
    (acc, s) => {
      acc[s] = orders.filter((o) => o.status === s).length;
      return acc;
    },
    { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
  );

  // Filtered list
  const filtered = orders.filter((o) => {
    const matchesStatus = activeStatus === "all" || o.status === activeStatus;
    const q = search.trim().toLowerCase();
    const customerName = o.shippingAddress?.fullName ?? "";
    const customerDisplay = "user " + o.userId.slice(-6);
    const matchesSearch =
      !q ||
      o._id.toLowerCase().includes(q) ||
      customerName.toLowerCase().includes(q) ||
      customerDisplay.includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus({ id: orderId, data: { status } }).unwrap();
      if (openOrder?._id === orderId) {
        setOpenOrder((prev) => prev ? { ...prev, status: status as OrderStatus } : null);
      }
    } catch {
      // ignore
    }
  };

  const tabLabels: Array<OrderStatus | "all"> = ["all", ...ALL_STATUSES];

  return (
    <AdminPageWrapper title="Orders" description="Manage and update order statuses">
      {/* ── Stat Chips ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map((s) => (
          <StatChip
            key={s}
            label={STATUS_LABEL[s]}
            count={statusCounts[s]}
            variant={STATUS_VARIANT[s]}
            active={activeStatus === s}
            onClick={() => setActiveStatus(activeStatus === s ? "all" : s)}
          />
        ))}
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Filter tab strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabLabels.map((t) => {
            const isActive = activeStatus === t;
            return (
              <button
                key={t}
                onClick={() => setActiveStatus(t)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-violet-600 border-violet-600 text-white shadow-sm shadow-violet-600/25"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400"
                }`}
              >
                {t === "all" ? "All" : STATUS_LABEL[t]}
              </button>
            );
          })}
        </div>

        {/* Search + count row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search order ID or customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-8 pr-8 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </p>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-left text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                  <th className="px-5 py-3 whitespace-nowrap">Order ID</th>
                  <th className="px-5 py-3 whitespace-nowrap">Customer</th>
                  <th className="px-5 py-3 whitespace-nowrap">Items</th>
                  <th className="px-5 py-3 whitespace-nowrap">Total</th>
                  <th className="px-5 py-3 whitespace-nowrap">Payment</th>
                  <th className="px-5 py-3 whitespace-nowrap">Status</th>
                  <th className="px-5 py-3 whitespace-nowrap">Date</th>
                  <th className="px-5 py-3 whitespace-nowrap sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-zinc-400 dark:text-zinc-500">
                    Loading orders…
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-6 h-6" />}
          title="No orders found"
          description={
            search
              ? `No orders match "${search}". Try a different search term.`
              : "No orders match the selected filter."
          }
          action={
            search || activeStatus !== "all"
              ? {
                  label: "Clear filters",
                  onClick: () => {
                    setSearch("");
                    setActiveStatus("all");
                  },
                }
              : undefined
          }
        />
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-left text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                  <th className="px-5 py-3 whitespace-nowrap">Order ID</th>
                  <th className="px-5 py-3 whitespace-nowrap">Customer</th>
                  <th className="px-5 py-3 whitespace-nowrap">Items</th>
                  <th className="px-5 py-3 whitespace-nowrap">Total</th>
                  <th className="px-5 py-3 whitespace-nowrap">Payment</th>
                  <th className="px-5 py-3 whitespace-nowrap">Status</th>
                  <th className="px-5 py-3 whitespace-nowrap">Date</th>
                  <th className="px-5 py-3 whitespace-nowrap sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filtered.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-violet-600 dark:text-violet-400">
                        {order._id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                        {order.shippingAddress?.fullName ?? "—"}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                        {"User " + order.userId.slice(-6)}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-3">
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[130px] truncate">
                        {order.items[0].name}
                      </p>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        {formatPrice(order.total)}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <Badge variant={PAYMENT_VARIANT[order.paymentStatus]} dot>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                    </td>

                    {/* Status — inline editable */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <Badge variant={STATUS_VARIANT[order.status as OrderStatus]} dot>
                        {STATUS_LABEL[order.status as OrderStatus]}
                      </Badge>
                      <StatusSelect
                        value={order.status as OrderStatus}
                        onChange={(next) => handleStatusChange(order._id, next)}
                      />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">
                      {formatOrderDate(order.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setOpenOrder(order)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                        aria-label={`View order ${order._id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Order Detail Modal ─────────────────────────────────────────────── */}
      {openOrder && (
        <OrderDetailModal
          order={openOrder}
          onClose={() => setOpenOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </AdminPageWrapper>
  );
}
