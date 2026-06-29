import { formatPrice } from "@/lib/utils";
import { Divider } from "@/custom-components/ui/Divider";
import { Paragraph } from "@/custom-components/ui/Typography";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const remaining = SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="space-y-3">
      {/* Free shipping progress */}
      {subtotal < SHIPPING_THRESHOLD && (
        <div className="p-3 rounded-lg bg-violet-50 border border-violet-100">
          <Paragraph size="xs" className="text-violet-700 mb-2">
            Add <strong>{formatPrice(remaining)}</strong> more for free shipping
          </Paragraph>
          <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
      {subtotal >= SHIPPING_THRESHOLD && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-100">
          <Paragraph size="xs" className="text-green-700">
            🎉 You qualify for <strong>free shipping!</strong>
          </Paragraph>
        </div>
      )}

      <Divider />

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>
      </div>

      <Divider />

      <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-50">
        <span>Total</span>
        <span className="text-lg">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
