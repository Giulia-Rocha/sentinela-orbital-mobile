import { View, Text, StyleSheet } from "react-native";
import { Alerta } from "@/types/alerta";
import { useTheme } from "@/context/ThemeContext";
import { Card } from "@/components/ui/Card";

interface Props { alerta: Alerta; }

export function AlertaCard({ alerta }: Props) {
  const { colors } = useTheme();
  const cor = alerta.nivel === "CRITICO" ? colors.danger
    : alerta.nivel === "ALERTA" ? colors.warning : colors.accent;

  return (
    <Card style={[styles.card, { borderLeftColor: cor, backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.nivel, { color: cor }]}>{alerta.nivel}</Text>
        <Text style={[styles.regiao, { color: colors.textMuted }]}>{alerta.nomeRegiao}</Text>
      </View>
      <Text style={[styles.mensagem, { color: colors.text }]}>{alerta.mensagem}</Text>
      <Text style={[styles.data, { color: colors.textMuted }]}>
        {new Date(alerta.createdAt).toLocaleDateString("pt-BR")}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8, padding: 14, marginBottom: 10, borderLeftWidth: 4 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  nivel: { fontWeight: "bold", fontSize: 13 },
  regiao: { fontSize: 12 },
  mensagem: { fontSize: 13, marginBottom: 6 },
  data: { fontSize: 11 },
});