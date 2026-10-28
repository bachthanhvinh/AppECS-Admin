import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/api";
import type { Category, CategoryPayload, CRUDCategory } from "./type";

export const categoryApi = {
  getAll: async () => {
    const res = await axiosClient.get<ApiResponse<Category[]>>(`categories/`);
    return res.data;
  },
  create: async (data: CategoryPayload) => {
    const res = await axiosClient.post<ApiResponse<CRUDCategory>>(
      `categories/`,
      data,
    );
    return res.data.data;
  },
  update: (id: string, data: CategoryPayload) =>
    axiosClient.put(`/categories/${id}`, data),
  remove: async (id: string) => {
    const res = await axiosClient.delete<ApiResponse<CRUDCategory>>(
      `categories/${id}`,
    );
    return res.data;
  },
};
