import { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { api } from "@/services/api";

interface Preferencias { regiao: string; threshold?: number; regiaoId?: number; }
interface UserContextType {
  token: string | null;
  nome: string | null;
  preferencias: Preferencias | null;
  setToken: (t: string, n?: string) => void;
  salvarPreferencias: (p: Preferencias) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [nome, setNomeState] = useState<string | null>(null);
  const [preferencias, setPreferencias] = useState<Preferencias | null>(null);

  useEffect(() => {
    async function loadData() {
      const t = await AsyncStorage.getItem("token");
      const n = await AsyncStorage.getItem("nome");
      const p = await AsyncStorage.getItem("preferencias");

      if (t) {
        setTokenState(t);
        api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
        
        if (n) {
          setNomeState(n);
        }
      }

      if (p) setPreferencias(JSON.parse(p));
    }
    
    loadData();
  }, []);

  function setToken(t: string, n?: string) {
    setTokenState(t);
    AsyncStorage.setItem("token", t);
    api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    if (n) {
      setNomeState(n);
      AsyncStorage.setItem("nome", n);
    }
  }

  function salvarPreferencias(p: Preferencias) {
    setPreferencias(p);
    AsyncStorage.setItem("preferencias", JSON.stringify(p));
  }

  function logout() {
    setTokenState(null);
    setNomeState(null);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("nome");
    delete api.defaults.headers.common["Authorization"];
    router.replace("/auth/login");
  }

  return (
    <UserContext.Provider value={{ token, nome, preferencias, setToken, salvarPreferencias, logout }}>
      {children}
    </UserContext.Provider>
  );
}
