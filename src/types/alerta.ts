export interface Alerta {
  id: number;
  nivel: "ATENCAO" | "ALERTA" | "CRITICO";
  mensagem: string;
  ativo: boolean;
  createdAt: string;
  nomeRegiao: string;
  hri?: number;
}