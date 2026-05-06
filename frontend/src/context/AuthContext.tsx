import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  type ReactNode 
} from "react";
import apiClient from "../services/apiClient.js";

type User = {
  id: string;
  email: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));

  useEffect(() => {
    function handleLogout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setAccessToken(null);
      setUser(null);
    }

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const isAuthenticated = accessToken !== null;

  async function login(email: string, password: string) {
    const { data } = await apiClient.post("/api/login", { email, password });
    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    setAccessToken(data.token);
    setUser({
      id: data.id,
      email: data.email,
      username: data.username,
    });
  }

  async function logout() {
    await apiClient.post("/api/revoke", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("refreshToken")}` },
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}