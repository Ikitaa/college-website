import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../lib/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  registerStudent: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// React Context le "prop drilling" bachauxa — matlab `user` data lai
// 10 components tala manually pass garna pardaina. Jasle pani app ko
// kunai pani kunama useAuth() call garyo bhane, tehि bela thaha huncha
// ki kun user login xa.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App pahilo पटक load हुँदा, check garने ki pahile bata login cookie
  // xa ki nai (jasto: hijo login garेर tab band garेको thiyo, aja
  // pheri kholeko xa — ajhai login nai dekhinu parxa).
  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password });
  setUser(data.user);
  return data.user; // ← yo matra thapeko
};

  const registerStudent = async (formData: { name: string; email: string; password: string }) => {
    const { data } = await api.post("/auth/register-student", formData);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, registerStudent, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Yo custom hook le `const { user } = useAuth()` jasto short likhna
// milauxa, `useContext(AuthContext)` बारम्बार nalikhनुपर्ने.
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};