// src/app/router.tsx
import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Spin } from "antd";
import { ROUTES } from "@/config/routes";

import AdminLayout from "./layouts/AdminLayout";
import { LoginPage, ProtectedRoute } from "@/features/auth";

const CategoryPage = lazy(() => import("@/features/categories/CategoryPage"));
const ArticleListPage = lazy(
  () => import("@/features/articles/ArticleListPage"),
);
// const ArticleFormPage = lazy(
//   () => import("@/features/articles/ArticleFromPage"),
// );

const withSuspense = (el: ReactNode) => (
  <Suspense fallback={<Spin />}>{el}</Suspense>
);

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: ROUTES.HOME,
            element: <Navigate to={ROUTES.CATEGORIES} replace />,
          },
          { path: ROUTES.CATEGORIES, element: withSuspense(<CategoryPage />) },
          { path: ROUTES.ARTICLES, element: withSuspense(<ArticleListPage />) },
          // {
          //   path: ROUTES.ARTICLE_NEW,
          //   element: withSuspense(<ArticleFormPage />),
          // },
          // {
          //   path: ROUTES.ARTICLE_EDIT,
          //   element: withSuspense(<ArticleFormPage />),
          // },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to={ROUTES.HOME} replace /> },
]);
