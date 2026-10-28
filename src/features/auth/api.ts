import axiosClient from "@/lib/axiosClient";
import type { User } from "./type";
import type { ApiResponse } from "@/types/api";

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const res = await axiosClient.post<ApiResponse<{ user: User }>>(
      `auth/login`,
      data,
    );
    return res.data.data.user;
  },
  logout: async () => {
    const res = await axiosClient.post(`auth/logout`);
    return res.data;
  },
  me: async () => {
    const res = await axiosClient.get<ApiResponse<User>>(`auth/me`);
    return res.data.data;
  },
};
