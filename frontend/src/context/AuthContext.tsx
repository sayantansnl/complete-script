import { 
  createContext, 
  useState, 
  type ReactNode 
} from "react";

type User = {
  id: string;
  email: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  accesToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const[accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));

  const isAuthenticated = !accessToken;

  async function login(email: string, password: string) {

  }
}