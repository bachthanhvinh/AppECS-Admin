  import axios from "axios";

export const getErrorMessage = (err: unknown, fallback = "Có lỗi xảy ra") => {
  if (axios.isAxiosError(err)) return err.response?.data?.message ?? fallback;
  return fallback;
};
