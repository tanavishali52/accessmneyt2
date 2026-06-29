import { baseApi } from "./baseApi";
import type { AuthResponse, LoginPayload, SignupPayload, User } from "@/types";

export const authService = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["User", "Cart"],
    }),

    signup: build.mutation<AuthResponse, SignupPayload>({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
      invalidatesTags: ["User"],
    }),

    getMe: build.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useSignupMutation, useGetMeQuery } = authService;
