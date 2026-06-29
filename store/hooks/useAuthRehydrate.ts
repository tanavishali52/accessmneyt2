"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetMeQuery } from "@/services/authService";
import { setCredentials, logout } from "@/store/slices/authSlice";

/**
 * Call once at app root. If a token exists in the persisted store,
 * re-validates it against GET /auth/me and refreshes the user object.
 * On failure (401 / network error) it clears the session.
 */
export function useAuthRehydrate() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);

  const { data, error } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data && token) {
      dispatch(
        setCredentials({ user: data, token })
      );
    }
  }, [data, token, dispatch]);

  useEffect(() => {
    if (error && token) {
      dispatch(logout());
    }
  }, [error, token, dispatch]);
}
