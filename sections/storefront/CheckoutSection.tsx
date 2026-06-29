"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check, ChevronRight, ShoppingBag, MapPin,
  CreditCard, Lock, Package, ArrowLeft,
} from "lucide-react";
import { shippingSchema, paymentSchema, type ShippingFormValues, type PaymentFormValues } from "@/lib/validations";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearLocalCart } from "@/store/slices/cartSlice";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/custom-components/ui/Button";
import { RHFInput } from "@/custom-components/ui/RHF";
import { RHFSelect } from "@/custom-components/ui/RHF";
import { Heading, Paragraph, Caption } from "@/custom-components/ui/Typography";
import { Divider } from "@/custom-components/ui/Divider";
import { Badge } from "@/custom-components/ui/Badge";
import { Alert } from "@/custom-components/ui/Alert";
import { Card } from "@/custom-components/ui/Card";
import type { ShippingAddress, Order, OrderItem } from "@/types";

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Shipping",  icon: MapPin },
  { id: 2, label: "Payment",   icon: CreditCard },
  { id: 3, label: "Confirm",   icon: Check },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8 sm:mb-10">
      {STEPS.map((step, i) => {
        const done    = current > step.id;
        const active  = current === step.id;
        const Icon    = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors
                ${done   ? "bg-green-500 text-white"
                : active ? "bg-blue-600 text-white ring-4 ring-blue-100"
                :          "bg-slate-100 text-slate-400"}`}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? "text-blue-600" : done ? "text-green-600" : "text-slate-400"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-2 mb-4 sm:mb-5 transition-colors ${done ? "bg-green-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Order summary sidebar ────────────────────────────────────────────────────

type CartItemLike = { productId: string; name: string; price: number; imageUrl: string; quantity: number; stock: number };

function OrderSidebar({ items, subtotal }: { items: CartItemLike[]; subtotal: number }) {
  const shipping = subtotal >= 50 ? 0 : 4.99;
  return (
    <Card padding="lg" className="sticky top-20 space-y-4">
      <Heading size="md">Order summary</Heading>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="48px" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-slate-700 text-white text-[9px] font-bold flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800 line-clamp-2">{item.name}</p>
              <p className="text-xs text-slate-500">{formatPrice(item.price)} each</p>
            </div>
            <span className="text-xs font-semibold text-slate-900 shrink-0">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <Divider />
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-slate-600">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
      </div>
      <Divider />
      <div className="flex justify-between font-bold text-slate-900">
        <span>Total</span>
        <span className="text-lg">{formatPrice(subtotal + shipping)}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        Secure checkout — 256-bit SSL
      </div>
    </Card>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function CheckoutSection() {
  const dispatch  = useAppDispatch();
  const localItems = useAppSelector((s) => s.cart.localItems);
  const { user, role } = useAppSelector((s) => s.auth);

  const [step, setStep]               = useState(1);
  const [shipping, setShipping]       = useState<ShippingAddress | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [placing, setPlacing]         = useState(false);

  const subtotal = localItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = subtotal >= 50 ? 0 : 4.99;

  // Step 1 — Shipping form
  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { fullName: user?.name ?? "", address: "", city: "", postcode: "", country: "GB" },
  });

  // Step 2 — Payment form
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { cardNumber: "4242 4242 4242 4242", expiry: "12/26", cvv: "123", nameOnCard: user?.name ?? "" },
  });

  const COUNTRY_OPTIONS = [
    { label: "United Kingdom", value: "GB" },
    { label: "United States",  value: "US" },
    { label: "Ireland",        value: "IE" },
    { label: "Germany",        value: "DE" },
    { label: "France",         value: "FR" },
  ];

  // Empty cart guard
  if (localItems.length === 0 && !placedOrder) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <Heading size="xl" className="mb-2">Your cart is empty</Heading>
        <Paragraph variant="muted" className="mb-6">Add some products before checking out.</Paragraph>
        <Link href="/"><Button variant="primary">Continue shopping</Button></Link>
      </div>
    );
  }

  // Step 3 — Confirmation (mock order placed)
  if (step === 3 && placedOrder) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <Heading as="h1" size="2xl" className="mb-2">Order confirmed!</Heading>
        <Paragraph variant="muted" className="mb-6">
          Thank you{user ? `, ${user.name.split(" ")[0]}` : ""}! Your order has been placed successfully.
        </Paragraph>

        <Card padding="md" className="text-left mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Order ID</span>
            <span className="font-mono font-semibold text-slate-900">{placedOrder._id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Status</span>
            <Badge variant="warning" dot>Pending</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Total</span>
            <span className="font-bold text-slate-900">{formatPrice(placedOrder.total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Delivering to</span>
            <span className="text-slate-700 text-right">{placedOrder.shippingAddress.address}, {placedOrder.shippingAddress.city}</span>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {role !== "guest" && (
            <Link href="/orders">
              <Button variant="primary" leftIcon={<Package className="h-4 w-4" />}>View my orders</Button>
            </Link>
          )}
          <Link href="/"><Button variant="secondary">Continue shopping</Button></Link>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (values: ShippingFormValues) => {
    setShipping(values);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSubmit = async () => {
    setPlacing(true);
    // Mock: create order object locally (backend wired in Phase 6)
    await new Promise((r) => setTimeout(r, 1200));
    const mockOrder: Order = {
      _id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      userId: user?._id ?? "guest",
      items: localItems.map((i): OrderItem => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.imageUrl,
      })),
      shippingAddress: shipping!,
      total: subtotal + shippingCost,
      status: "pending",
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPlacedOrder(mockOrder);
    dispatch(clearLocalCart());
    setStep(3);
    setPlacing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <StepIndicator current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Left — form area */}
        <div className="lg:col-span-3 space-y-6">

          {/* ── Step 1: Shipping ── */}
          {step === 1 && (
            <Card padding="lg">
              <div className="flex items-center gap-2.5 mb-6">
                <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
                <Heading size="lg">Shipping address</Heading>
              </div>
              <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-4">
                <RHFInput name="fullName" control={shippingForm.control} label="Full name" placeholder="Jane Smith" required />
                <RHFInput name="address"  control={shippingForm.control} label="Street address" placeholder="123 High Street" required />
                <div className="grid grid-cols-2 gap-3">
                  <RHFInput name="city"     control={shippingForm.control} label="City"     placeholder="London"  required />
                  <RHFInput name="postcode" control={shippingForm.control} label="Postcode" placeholder="SW1A 1AA" required />
                </div>
                <RHFSelect name="country" control={shippingForm.control} label="Country" options={COUNTRY_OPTIONS} required />
                <Button type="submit" variant="primary" size="lg" fullWidth rightIcon={<ChevronRight className="h-4 w-4" />}>
                  Continue to payment
                </Button>
              </form>
            </Card>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 2 && (
            <Card padding="lg">
              <div className="flex items-center gap-2.5 mb-2">
                <CreditCard className="h-5 w-5 text-blue-600 shrink-0" />
                <Heading size="lg">Payment details</Heading>
              </div>

              <Alert variant="info" className="mb-5">
                <strong>Test mode.</strong> Use card <span className="font-mono">4242 4242 4242 4242</span>, any future expiry, any CVV.
              </Alert>

              <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
                <RHFInput
                  name="cardNumber"
                  control={paymentForm.control}
                  label="Card number"
                  placeholder="4242 4242 4242 4242"
                  required
                  leftIcon={<CreditCard className="h-4 w-4" />}
                />
                <div className="grid grid-cols-2 gap-3">
                  <RHFInput name="expiry"      control={paymentForm.control} label="Expiry (MM/YY)" placeholder="12/26" required />
                  <RHFInput name="cvv"         control={paymentForm.control} label="CVV"            placeholder="123"   required />
                </div>
                <RHFInput name="nameOnCard" control={paymentForm.control} label="Name on card" placeholder="Jane Smith" required />

                <Divider />

                {/* Shipping summary */}
                {shipping && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-600">
                      <p className="font-medium text-slate-900">{shipping.fullName}</p>
                      <p>{shipping.address}, {shipping.city}, {shipping.postcode}</p>
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-blue-600 hover:underline shrink-0">Edit</button>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" size="lg" fullWidth loading={placing} leftIcon={<Lock className="h-4 w-4" />}>
                    Pay {formatPrice(subtotal + shippingCost)}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Right — order summary */}
        <div className="lg:col-span-2">
          <OrderSidebar items={localItems} subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
