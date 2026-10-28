// src/config/routes.ts
export const ROUTES = {
  LOGIN: "/login",
  HOME: "/",
  CATEGORIES: "/categories",
  ARTICLES: "/articles",
  ARTICLE_NEW: "/articles/new",
  ARTICLE_EDIT: "/articles/:id/edit", // dùng cho định nghĩa route
  articleEdit: (id: string) => `/articles/${id}/edit`, // dùng khi điều hướng
} as const;
