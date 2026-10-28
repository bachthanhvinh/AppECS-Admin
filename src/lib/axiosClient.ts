// src/lib/axiosClient.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";

export const AUTH_EXPIRED_EVENT = "auth:expired";

const axiosClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true, // trình duyệt tự gửi cookie
});

// Các route này không refresh khi gặp 401
const SKIP_REFRESH = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];
let refreshPromise: Promise<unknown> | null = null; // nhiều request 401 cùng lúc chỉ refresh 1 lần

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axiosClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;

    const shouldRefresh =
      original &&
      error.response?.status === 401 &&
      !original._retry &&
      !SKIP_REFRESH.some((p) => original.url?.startsWith(p));

    if (!shouldRefresh) return Promise.reject(error);

    original._retry = true;

    if (!refreshPromise) {
      refreshPromise = axiosClient.post("/auth/refresh").finally(() => {
        refreshPromise = null;
      });
    }

    try {
      await refreshPromise;
    } catch (e) {
      // Refresh thất bại: báo cho AuthContext đưa về trang login
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      return Promise.reject(e);
    }

    return axiosClient(original);
  },
);

export default axiosClient;
