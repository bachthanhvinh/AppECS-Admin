// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import Providers from "./providers";
import { router } from "./router";
import { ConfigProvider } from "antd";

export default function App() {
  return (
    <ConfigProvider theme={{ token: { motion: false } }}>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ConfigProvider>
  );
}
