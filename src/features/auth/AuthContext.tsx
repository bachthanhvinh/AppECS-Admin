import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "./type";
import { authApi } from "./api";
import { AUTH_EXPIRED_EVENT } from "@/lib/axiosClient";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
   
    const onExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const login = async (email: string, password: string) => {
    setUser(await authApi.login({ email, password }));
  };
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
);
}

export const useAuth =  () => {
  const context = useContext(AuthContext);
  if(!context) {
    throw new Error("useAuth must be used  within  an AuthProvider")
  }
  return context;
}
