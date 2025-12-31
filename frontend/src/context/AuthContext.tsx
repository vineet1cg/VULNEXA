import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { authApi } from "../api/auth";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (googleIdToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sentinai_token");

    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getCurrentUser()
      .then((res) => {
        if (res.success) {
          setUser(res.user);
        } else {
          localStorage.removeItem("sentinai_token");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (googleIdToken: string) => {
    const res = await authApi.googleLogin(googleIdToken);

    if (res.success) {
      localStorage.setItem("sentinai_token", res.token);
      setUser(res.user);
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("sentinai_token"); // ✅ REQUIRED
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
