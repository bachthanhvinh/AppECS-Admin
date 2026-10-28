// src/app/providers.tsx
import type { ReactNode } from "react";
import { App as AntApp, ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { AuthProvider } from "@/features/auth/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StyleProvider layer>
      <ConfigProvider>
        <AntApp>
          <AuthProvider>{children}</AuthProvider>
        </AntApp>
      </ConfigProvider>
    </StyleProvider>
  );
}
