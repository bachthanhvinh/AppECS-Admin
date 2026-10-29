import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/api";
import type { Article, ArticlePayload } from "./type";

export const articleApi = {
  getAll: async () => {
    const res = await axiosClient.get<ApiResponse<Article[]>>(`articles/`);
    return res.data.data;
  },
  getById: async (id: string) => {
    const res = await axiosClient.get<ApiResponse<Article>>(`articles/${id}`);
    return res.data.data;
  },
  create: async (data: ArticlePayload) => {
    const res = await axiosClient.post<ApiResponse<Article>>(`articles/`, data);
    return res.data.data;
  },
  update: async (id: string, data: ArticlePayload) => {
    const res = await axiosClient.put<ApiResponse<Article>>(
      `articles/${id}`,
      data,
    );
    return res.data.data;
  },
  remove: async (id: string) => {
    await axiosClient.delete(`articles/${id}`);
  },
};
