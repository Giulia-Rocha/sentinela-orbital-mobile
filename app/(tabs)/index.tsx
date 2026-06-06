import { useEffect } from "react";
import { Text, ScrollView, StyleSheet, RefreshControl, View } from "react-native";
import { useAlerta } from "@/hooks/useAlertas";
import { useUser } from "@/hooks/useRegiao";
import { HriIndicator } from "@/components/HriIndicator";
import { AlertaCard } from "@/components/AlertaCard";
import { useTheme } from "@/context/ThemeContext";

export default function Principal() {
  const { alertas, hriAtual, carregarAlertas, loading } = useAlerta();
  const { nome } = useUser();
  const { colors } = useTheme();

  useEffect(() => { carregarAlertas(); }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={carregarAlertas} />}>
      
      <View style={styles.header}>
        <Text style={[styles.saudacao, { color: colors.textMuted }]}>Olá, {nome || "Visitante"}!</Text>
        <Text style={[styles.titulo, { color: colors.text }]}>Monitoramento em Tempo Real</Text>
      </View>

      <HriIndicator valor={hriAtual} />
      <Text style={[styles.secao, { color: colors.text }]}>Alertas Ativos</Text>
      {alertas.slice(0, 3).map(a => <AlertaCard key={a.id} alerta={a} />)}
      {alertas.length === 0 &&
        <Text style={[styles.vazio, { color: colors.textMuted }]}>Nenhum alerta ativo no momento</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 20 },
  saudacao: { fontSize: 16, marginBottom: 4 },
  titulo: { fontSize: 20, fontWeight: "bold" },
  secao: { fontSize: 16, fontWeight: "600", marginVertical: 12 },
  vazio: { textAlign: "center", marginTop: 24 },
});