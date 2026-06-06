import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/hooks/useRegiao";
import { api } from "@/services/api";

const screenWidth = Dimensions.get("window").width;

interface PrevisaoDia {
  data: string;
  tempMax: number;
  tempMin: number;
  iuv: number;
}

interface PrevisaoData {
  nomeRegiao: string;
  fonte: string;
  riscoCalor: string;
  previsoes: PrevisaoDia[];
}

function parseDia(diaStr: string): Date {
  const partes = diaStr.split("-");
  return new Date(
    parseInt(partes[0]),
    parseInt(partes[1]) - 1,
    parseInt(partes[2])
  );
}

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Forecast() {
  const { colors } = useTheme();
  const { preferencias } = useUser();
  const [loading, setLoading] = useState(false);
  const [previsaoData, setPrevisaoData] = useState<PrevisaoData | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  } | null>(null);

  useEffect(() => {
    if (preferencias?.regiaoId) carregarPrevisao();
  }, [preferencias?.regiaoId]);

  async function carregarPrevisao() {
    setLoading(true);
    try {
      const res = await api.get(`/previsao/regiao/${preferencias?.regiaoId}`);
      const data: PrevisaoData = res.data;
      setPrevisaoData(data);

      if (data.previsoes && data.previsoes.length > 0) {
        const labels = data.previsoes.map((p) => DIAS[parseDia(p.data).getDay()]);
        setChartData({
          labels,
          datasets: [{ data: data.previsoes.map((p) => p.tempMax) }],
        });
      }
    } catch (err) {
      console.error("Erro ao carregar previsão:", err);
    } finally {
      setLoading(false);
    }
  }

  function getRiscoColor(risco: string) {
    switch (risco) {
      case "EXTREMO": return colors.danger;
      case "ALTO": return colors.warning;
      case "MODERADO": return "#f59e0b";
      default: return colors.success;
    }
  }

  function getRiscoMensagem(risco: string) {
    switch (risco) {
      case "EXTREMO": return "Risco extremo de onda de calor previsto";
      case "ALTO": return "Condições de calor intenso nos próximos dias";
      case "MODERADO": return "Condições de atenção nos próximos dias";
      default: return "Sem risco de onda de calor previsto";
    }
  }

  function getIuvLabel(iuv: number) {
    if (iuv >= 11) return "Extremo";
    if (iuv >= 8) return "Muito Alto";
    if (iuv >= 6) return "Alto";
    if (iuv >= 3) return "Moderado";
    return "Baixo";
  }

  if (!preferencias?.regiaoId) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted, textAlign: "center" }}>
          Configure sua região nas configurações para ver a previsão.
        </Text>
      </View>
    );
  }

  const tempMaxSemana = previsaoData
    ? Math.max(...previsaoData.previsoes.map((p) => p.tempMax))
    : null;
  const tempMinSemana = previsaoData
    ? Math.min(...previsaoData.previsoes.map((p) => p.tempMin))
    : null;
  const iuvMax = previsaoData
    ? Math.max(...previsaoData.previsoes.map((p) => p.iuv))
    : null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

      <Text style={[styles.titulo, { color: colors.text }]}>
        Previsão de Temperatura — {preferencias.regiao}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          {chartData && (
            <LineChart
              data={chartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
                labelColor: () => colors.textMuted,
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          )}

          <Text style={[styles.legenda, { color: colors.textMuted }]}>
            Fonte: {previsaoData?.fonte ?? "CPTEC/INPE"}
          </Text>

          {previsaoData && (
            <>
              <View style={[styles.riscoCard, {
                backgroundColor: colors.surface,
                borderLeftColor: getRiscoColor(previsaoData.riscoCalor),
              }]}>
                <Text style={[styles.riscoLabel, { color: getRiscoColor(previsaoData.riscoCalor) }]}>
                  {previsaoData.riscoCalor}
                </Text>
                <Text style={[styles.riscoMensagem, { color: colors.text }]}>
                  {getRiscoMensagem(previsaoData.riscoCalor)}
                </Text>
              </View>

              <View style={styles.resumoRow}>
                <View style={[styles.resumoCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.resumoValor, { color: colors.danger }]}>
                    {tempMaxSemana}°C
                  </Text>
                  <Text style={[styles.resumoLabel, { color: colors.textMuted }]}>
                    Máx. semana
                  </Text>
                </View>
                <View style={[styles.resumoCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.resumoValor, { color: colors.primary }]}>
                    {tempMinSemana}°C
                  </Text>
                  <Text style={[styles.resumoLabel, { color: colors.textMuted }]}>
                    Mín. semana
                  </Text>
                </View>
                <View style={[styles.resumoCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.resumoValor, { color: colors.warning }]}>
                    {iuvMax}
                  </Text>
                  <Text style={[styles.resumoLabel, { color: colors.textMuted }]}>
                    IUV máx.
                  </Text>
                </View>
              </View>

              <Text style={[styles.secao, { color: colors.text }]}>
                Previsão por dia
              </Text>

              {previsaoData.previsoes.map((p, index) => {
                const nomeDia = DIAS[parseDia(p.data).getDay()];
                const riscoIuv = getIuvLabel(p.iuv);
                const corIuv = p.iuv >= 8 ? colors.danger
                  : p.iuv >= 6 ? colors.warning
                  : colors.success;

                return (
                  <View key={index} style={[styles.diaRow, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.diaNome, { color: colors.text }]}>{nomeDia}</Text>
                    <View style={styles.diaTemps}>
                      <Text style={[styles.diaMax, { color: colors.danger }]}>
                        {p.tempMax}°
                      </Text>
                      <Text style={[styles.diaMin, { color: colors.textMuted }]}>
                        {p.tempMin}°
                      </Text>
                    </View>
                    <View style={[styles.iuvBadge, { backgroundColor: corIuv + "33" }]}>
                      <Text style={[styles.iuvText, { color: corIuv }]}>
                        IUV {riscoIuv}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  titulo: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  legenda: { fontSize: 12, textAlign: "center", marginTop: 8, marginBottom: 16 },
  riscoCard: { borderRadius: 10, padding: 16, marginBottom: 16, borderLeftWidth: 4 },
  riscoLabel: { fontSize: 13, fontWeight: "bold", marginBottom: 4 },
  riscoMensagem: { fontSize: 14 },
  resumoRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  resumoCard: { flex: 1, borderRadius: 10, padding: 12, alignItems: "center" },
  resumoValor: { fontSize: 22, fontWeight: "bold" },
  resumoLabel: { fontSize: 11, marginTop: 2 },
  secao: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  diaRow: {
    flexDirection: "row", alignItems: "center", borderRadius: 8,
    padding: 12, marginBottom: 6,
  },
  diaNome: { fontSize: 14, fontWeight: "600", width: 40 },
  diaTemps: { flexDirection: "row", gap: 6, flex: 1, marginLeft: 8 },
  diaMax: { fontSize: 15, fontWeight: "bold" },
  diaMin: { fontSize: 15 },
  iuvBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  iuvText: { fontSize: 11, fontWeight: "600" },
});