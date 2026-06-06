import { useEffect, useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAlerta } from "@/hooks/useAlertas";
import { AlertaCard } from "@/components/AlertaCard";
import { useTheme } from "@/context/ThemeContext";

const NIVEIS = [
  { label: "Todos", value: "TODOS" },
  { label: "Atenção", value: "ATENCAO" },
  { label: "Alerta", value: "ALERTA" },
  { label: "Crítico", value: "CRITICO" },
];

export default function Alertas() {
  const { alertas, carregarAlertas } = useAlerta();
  const { colors } = useTheme();

  const [filtroNivel, setFiltroNivel] = useState<string>("TODOS");
  const [ordemData, setOrdemData] = useState<"desc" | "asc">("desc");

  useEffect(() => { carregarAlertas(); }, []);

  const alertasFiltrados = useMemo(() => {
    let result = [...alertas];

    if (filtroNivel !== "TODOS") {
      result = result.filter(a => a.nivel === filtroNivel);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return ordemData === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [alertas, filtroNivel, ordemData]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerFilters, { borderBottomColor: colors.border }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.chipsContainer}
        >
          {NIVEIS.map((nivel) => {
            const isSelected = filtroNivel === nivel.value;
            return (
              <TouchableOpacity
                key={nivel.value}
                onPress={() => setFiltroNivel(nivel.value)}
                style={[
                  styles.chip,
                  { 
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: colors.border
                  }
                ]}
              >
                <Text style={[
                  styles.chipText, 
                  { color: isSelected ? "#FFF" : colors.text }
                ]}>
                  {nivel.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity 
          onPress={() => setOrdemData(prev => prev === "desc" ? "asc" : "desc")}
          style={[styles.sortButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons 
            name={ordemData === "desc" ? "arrow-down" : "arrow-up"} 
            size={18} 
            color={colors.primary} 
          />
          <Text style={[styles.sortText, { color: colors.text }]}>Data</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alertasFiltrados}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <AlertaCard alerta={item} />}
        ListEmptyComponent={
          <Text style={[styles.vazio, { color: colors.textMuted }]}>Nenhum alerta encontrado</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerFilters: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  chipsContainer: {
    paddingRight: 16,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: "auto",
  },
  sortText: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: "500",
  },
  vazio: { textAlign: "center", marginTop: 40 },
});