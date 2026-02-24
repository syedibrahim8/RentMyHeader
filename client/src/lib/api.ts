import axios from "axios";
import { endpoints } from "./endpoints";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let queue: Array<() => void> = [];
let onUnauthed: (() => void) | null = null;

export const bindAuthRefresh = (callbacks: {
  refresh: () => Promise<void>;
  onUnauthorized: () => void;
}) => {
  onUnauthed = callbacks.onUnauthorized;

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      if (error.response?.status !== 401 || original._retry) throw error;

      if (isRefreshing) {
        await new Promise<void>((resolve) => queue.push(resolve));
      } else {
        isRefreshing = true;
        original._retry = true;
        try {
          await callbacks.refresh();
          queue.forEach((resolve) => resolve());
          queue = [];
        } catch (refreshError) {
          onUnauthed?.();
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }
      return api(original);
    },
  );
};

export const refreshSession = async () => {
  await api.post(endpoints.auth.refresh);
};
