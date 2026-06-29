"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, CreditCard, Check, Clock, Truck, Home, X } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { Order, OrderStatus } from "@/types";
import { Badge } from "@/custom-components/ui/Badge";
import { Card, CardHeader, CardBody } from "@/custom-components/ui/Card";
import { Heading, Paragraph, Caption } from "@/custom-components/ui/Typography";
import { Divider } from "@/custom-components/ui/Divider";
import { Button } from "@/custom-components/ui/Button";

// Same mock orders as history — Phase 6 replaces with API
const MOCK_ORDERS: Order[] = [
  {
    _id: "ORD-MOCK001", userId: "user1",
    items: [
      { productId: "1", name: "Wireless Noise-Cancelling Headphones", price: 249.99, quantity: 1, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
      { productId: "7", name: "Atomic Habits — James Clear",          price: 14.99,  quantity: 2, imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop" },
    ],
    shippingAddress: { fullName: "Jane Smith", address: "123 High St", city: "London", postcode: "SW1A 1AA", country: "GB" },
    total: 279.97, status: "delivered", paymentStatus: "paid",
    createdAt: "2024-10-20T14:00:00Z", updatedAt: "2024-10-24T10:00:00Z",
  },
  {
    _id: "ORD-MOCK002", userId: "user1",
    items: [{ productId: "6", name: "Running Trainers Pro", price: 144.99, quantity: 1, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" }],
    shippingAddress: { fullName: "Jane Smith", address: "123 High St", city: "London", postcode: "SW1A 1AA", country: "GB" },
    total: 149.98, status: "shipped", paymentStatus: "paid",
    createdAt: "2024-11-01T09:30:00Z", updatedAt: "2024-11-03T08:00:00Z",
  },
  {
    _id: "ORD-MOCK003", userId: "user1",
    items: [{ productId: "9", name: "Ceramic Pour-Over Coffee Set", price: 64.99, quantity: 1, imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop" }],
    shippingAddress: { fullName: "Jane Smith", address: "123 High St", city: "London", postcode: "SW1A 1AA", country: "GB" },
    total: 64.99, status: "processing", paymentStatus: "paid",
    createdAt: "2024-11-05T11:00:00Z", updatedAt: "2024-11-05T11:00:00Z",
  },
];

// ─── Status timeline ──────────────────────────────────────────────────────────

const TIMELINE: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "pending",    label: "Order placed",   icon: Clock  },
  { status: "processing", label: "Processing",     icon: Package },
  { status: "shipped",    label: "Shipped",        icon: Truck  },
  { status: "delivered",  label: "Delivered",      icon: Home   },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1,
};

const STATUS_BADGE: Record<OrderStatus, "warning" | "info" | "default" | "success" | "danger"> = {
  pending: "warning", processing: "info", shipped: "default", delivered: "success", cancelled: "danger",
};

function StatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
        <X className="h-5 w-5 text-red-500 shrink-0" />
        <Paragraph size="sm" className="text-red-700 font-medium">This order has been cancelled.</Paragraph>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER[status];
  return (
    <div className="flex items-start gap-0">
      {TIMELINE.map((step, i) => {
        const done   = STATUS_ORDER[step.status] < currentIdx;
        const active = step.status === status;
        const Icon   = step.icon;
        return (
          <div key={step.status} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {i > 0 && <div className={`flex-1 h-0.5 ${done || active ? "bg-violet-500" : "bg-slate-200"}`} />}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                ${done   ? "bg-green-500 text-white"
                : active ? "bg-violet-600 text-white ring-3 ring-violet-100"
                :          "bg-slate-100 text-slate-400"}`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </div>
              {i < TIMELINE.length - 1 && <div className={`flex-1 h-0.5 ${done ? "bg-violet-500" : "bg-slate-200"}`} />}
            </div>
            <Caption className={`mt-1.5 text-center text-[10px] sm:text-xs ${active ? "text-violet-600 font-semibold" : done ? "text-green-600" : "text-slate-400"}`}>
              {step.label}
            </Caption>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function OrderDetailSection() {
  const params  = useParams();
  const orderId = params?.id as string;
  const order   = MOCK_ORDERS.find((o) => o._id === orderId);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Heading size="xl" className="mb-3">Order not found</Heading>
        <Link href="/orders"><Button variant="primary">Back to orders</Button></Link>
      </div>
    );
  }

  const shippingCost = order.total - order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Back */}
      <Link href="/orders" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Heading as="h1" size="xl" className="mb-1">{order._id}</Heading>
          <Caption>Placed on {formatDate(order.createdAt)}</Caption>
        </div>
        <Badge variant={STATUS_BADGE[order.status]} size="md" dot>
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      {/* Status timeline */}
      <Card padding="md">
        <StatusTimeline status={order.status} />
      </Card>

      {/* Items */}
      <Card padding="none">
        <CardHeader className="px-4 py-3">
          <Heading size="sm">Items ordered</Heading>
          <Caption>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</Caption>
        </CardHeader>
        <CardBody className="py-0">
          {order.items.map((item, i) => (
            <div key={item.productId}>
              <div className="flex gap-3 px-4 py-3.5">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <Paragraph size="sm" className="font-semibold text-slate-900 line-clamp-2">{item.name}</Paragraph>
                  <Caption>Qty: {item.quantity} · {formatPrice(item.price)} each</Caption>
                </div>
                <span className="text-sm font-bold text-slate-900 shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
              {i < order.items.length - 1 && <Divider className="mx-4" />}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Summary + Addresses grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Order total */}
        <Card padding="md" className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-slate-400" />
            <Heading size="sm">Payment summary</Heading>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.total - Math.max(0, shippingCost))}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className={shippingCost <= 0 ? "text-green-600" : ""}>{shippingCost <= 0 ? "Free" : formatPrice(shippingCost)}</span>
            </div>
            <Divider />
            <div className="flex justify-between font-bold text-slate-900">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Payment</span>
              <Badge variant="success" size="sm">{order.paymentStatus === "paid" ? "Paid" : "Pending"}</Badge>
            </div>
          </div>
        </Card>

        {/* Shipping address */}
        <Card padding="md">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-slate-400" />
            <Heading size="sm">Shipping address</Heading>
          </div>
          <div className="text-sm text-slate-600 space-y-0.5">
            <p className="font-semibold text-slate-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </Card>
      </div>

      <Link href="/">
        <Button variant="secondary" leftIcon={<Package className="h-4 w-4" />}>Continue shopping</Button>
      </Link>
    </div>
  );
}
