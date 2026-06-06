import { Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Props { valor: number; }

export function HriIndicator({ valor }: Props) {
  const { colors } = useTheme();
  const cor = valor >= 8 ? colors.danger : valor >= 6 ? colors.warning : colors.success;
  const label = valor >= 8 ? "CRÍTICO" : valor >= 6 ? "ALERTA" : "NORMAL";

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.titulo, { color: colors.textMuted }]}>Índice de Risco de Calor (HRI)</Text>
      <Text style={[styles.valor, { color: cor }]}>{valor.toFixed(1)}</Text>
      <Badge label={label} color={cor} style={{ marginTop: 8 }} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12,
    padding: 20, alignItems: "center", marginBottom: 16 },
  titulo: { fontSize: 13, marginBottom: 8 },
  valor: { fontSize: 56, fontWeight: "bold" },
  badge: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, marginTop: 8 },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
});