import { useContext } from "react";
import { AlertaContext } from "@/context/AlertaContext";

export function useAlerta() {
  const context = useContext(AlertaContext);
  if (!context) {
    throw new Error("useAlerta deve ser usado dentro de um AlertaProvider");
  }
  return context;
}
