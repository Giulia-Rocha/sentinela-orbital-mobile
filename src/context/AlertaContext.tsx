import { createContext, useState, ReactNode } from "react";
import { api } from "@/services/api";
import { Alerta } from "@/types/alerta";

interface AlertaContextType {
  alertas: Alerta[];
  hriAtual: number;
  loading: boolean;
  carregarAlertas: () => Promise<void>;
}

export const AlertaContext = createContext<AlertaContextType>({} as AlertaContextType);

export function AlertaProvider({ children }: { children: ReactNode }) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [hriAtual, setHriAtual] = useState(0);
  const [loading, setLoading] = useState(false);

  async function carregarAlertas() {
    setLoading(true);
    try {
      const res = await api.get("/alertas");
      setAlertas(res.data);
      if (res.data.length > 0) setHriAtual(res.data[0].hri ?? 7.2);
    } catch {
      // mantém estado anterior
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertaContext.Provider value={{ alertas, hriAtual, loading, carregarAlertas }}>
      {children}
    </AlertaContext.Provider>
  );
}
