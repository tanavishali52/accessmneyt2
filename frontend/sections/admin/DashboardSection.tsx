"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Package,
  Users,
} from "lucide-react";
import {
  SALES_BY_DAY,
  ORDERS_BY_STATUS_DATA,
  TOP_PRODUCTS_DATA,
} from "@/lib/adminMockData";
import { useGetAllOrdersQuery } from "@/services/ordersService";
import { useGetProductsQuery } from "@/services/productsService";
import { formatPrice } from "@/lib/utils";
import { AdminPageWrapper } from "@/custom-components/layout/PageWrapper";
import { Badge } from "@/custom-components/ui/Badge";
import Image from "next/image";
import Link from "next/link";

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  iconBg: string;
  trendLabel: string;
}

function StatCard({ title, value, change, icon, iconBg, trendLabel }: StatCardProps) {
  const isPositive = change === undefined || change >= 0;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</span>
        </div>
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? "+" : ""}
            {change.toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{trendLabel}</p>
      </div>
    </div>
  );
}

// ─── Custom Tooltip for Bar Chart ─────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-medium text-zinc-700 dark:text-zinc-200 mb-1">{label}</p>
      <p className="text-violet-600 dark:text-violet-400 font-semibold">
        {formatPrice(payload[0].value)}
      </p>
    </div>
  );
}

// ─── Custom Donut Legend ──────────────────────────────────────────────────────

function DonutLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
      {ORDERS_BY_STATUS_DATA.map((entry) => (
        <div key={entry.status} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span>{entry.status}</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{entry.count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Status badge variant map ─────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, "warning" | "info" | "default" | "success" | "danger"> = {
  pending:    "warning",
  processing: "info",
  shipped:    "default",
  delivered:  "success",
  cancelled:  "danger",
};

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function DashboardSection() {
  const { data: allOrders = [] } = useGetAllOrdersQuery();
  const { data: productsData } = useGetProductsQuery({ limit: 1 });
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const activeProducts = productsData?.total ?? 0;
  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AdminPageWrapper
      title="Dashboard"
      description="Overview of your store's performance"
    >
      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          icon={<DollarSign className="w-4 h-4 text-white" />}
          iconBg="bg-violet-600"
          trendLabel="all time"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={<ShoppingBag className="w-4 h-4 text-white" />}
          iconBg="bg-blue-600"
          trendLabel="all time"
        />
        <StatCard
          title="Active Products"
          value={activeProducts.toLocaleString()}
          icon={<Package className="w-4 h-4 text-white" />}
          iconBg="bg-emerald-600"
          trendLabel="in catalogue"
        />
        <StatCard
          title="New Customers"
          value="87"
          icon={<Users className="w-4 h-4 text-white" />}
          iconBg="bg-amber-500"
          trendLabel="this month"
        />
      </div>

      {/* ── Charts row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4">
            Revenue — Last 7 Days
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={SALES_BY_DAY} barSize={28}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                width={38}
              />
              <Tooltip content={<RevenueTooltip />} cursor={{ fill: "rgba(124,58,237,0.08)" }} />
              <Bar
                dataKey="revenue"
                fill="#7C3AED"
                radius={[4, 4, 0, 0]}
                activeBar={{ fill: "#6D28D9" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Donut Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
            Orders by Status
          </h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <PieChart width={200} height={220}>
              <Pie
                data={ORDERS_BY_STATUS_DATA}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                stroke="none"
              >
                {ORDERS_BY_STATUS_DATA.map((entry) => (
                  <Cell key={entry.status} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <DonutLegend />
          </div>
        </div>
      </div>

      {/* ── Top Products + Recent Orders ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Top Products Table */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Top Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                  <th className="px-5 py-3 w-8">#</th>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3 text-right">Sold</th>
                  <th className="px-5 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS_DATA.map((product, idx) => (
                  <tr
                    key={product.productId}
                    className={idx % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50/60 dark:bg-zinc-800/40"}
                  >
                    <td className="px-5 py-3 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-zinc-800 dark:text-zinc-200 font-medium line-clamp-1 max-w-[180px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-zinc-600 dark:text-zinc-400">
                      {product.totalSold}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-zinc-800 dark:text-zinc-200">
                      {formatPrice(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Mini-Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={idx % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50/60 dark:bg-zinc-800/40"}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {order._id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-zinc-800 dark:text-zinc-200 font-medium text-xs line-clamp-1">
                        {order.shippingAddress?.fullName ?? "User"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[order.status]} dot>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
}
