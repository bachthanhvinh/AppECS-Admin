import axiosClient from "@/lib/axiosClient";

export const paginationApi = {
  pagination: async (page: number, pageSize: number, table: string) => {
    const res = await axiosClient.get(
      `pagination/?page=${page}&pageSize=${pageSize}&table=${table}`,
    );
    return res.data;
  },
};
