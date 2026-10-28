const apiUrl = import.meta.env.VITE_API_ROOT as string | undefined;

if (!apiUrl) {
  throw new Error("Thiếu biến VITE_API_URL trong file .env");
}

export const env = { apiUrl };
  