import { baseApi } from "./baseApi";
import type { Order, CreateOrderPayload } from "@/types";

export const ordersService = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<Order, CreateOrderPayload>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: ["Order", "Cart"],
    }),

    getOrders: build.query<Order[], void>({
      query: () => "/orders/my",
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Order" as const, id: _id })), { type: "Order", id: "LIST" }]
          : [{ type: "Order", id: "LIST" }],
    }),

    getOrderById: build.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateOrderMutation, useGetOrdersQuery, useGetOrderByIdQuery } = ordersService;
