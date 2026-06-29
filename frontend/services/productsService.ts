import { baseApi } from "./baseApi";
import type { Product, PaginatedResponse, ProductQueryParams } from "@/types";

export const productsService = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<PaginatedResponse<Product>, ProductQueryParams>({
      query: (params) => ({
        url: "/products",
        params: {
          ...params,
          page: params.page ?? 1,
          limit: params.limit ?? 12,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Product" as const, id: _id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Product", id }],
    }),

    getRelatedProducts: build.query<Product[], { productId: string; userId?: string }>({
      query: ({ productId, userId }) => ({
        url: `/products/${productId}/related`,
        params: userId ? { userId } : undefined,
      }),
      providesTags: [{ type: "Product", id: "RELATED" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} = productsService;
