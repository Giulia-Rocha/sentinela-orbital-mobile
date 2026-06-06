import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch, ActivityIndicator, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useUser } from "@/hooks/useRegiao";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { Regiao } from "@/types/regiao";
import { Button } from "@/components/ui/Button";

import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Settings() {
  const { preferencias, salvarPreferencias, logout } = useUser();
  const { tema, colors, toggleTheme } = useTheme();
  
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [regiaoId, setRegiaoId] = useState<number | undefined>(preferencias?.regiaoId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarRegioes();
  }, []);

  async function carregarRegioes() {
    try {
      const res = await api.get("/regioes");
      setRegioes(res.data);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar as regiões.");
    } finally {
      setLoading(false);
    }
  }

  function handleSalvar() {
    const regiaoSelecionada = regioes.find(r => r.id === regiaoId);
    if (!regiaoSelecionada) {
      Alert.alert("Erro", "Selecione uma região válida.");
      return;
    }
    salvarPreferencias({ 
      regiao: regiaoSelecionada.nome, 
      regiaoId: regiaoSelecionada.id 
    });
    Alert.alert("Sucesso", "Preferências salvas!");
  }

  function handleLogout() {
    Alert.alert(
      "Sair",
      "Tem certeza que quer sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: logout }
      ]
    );
  }

  return (
    <SafeAreaProvider>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Modo Escuro</Text>
          <Switch
            value={tema === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor="#f4f3f4"
          />
        </View>

        <Text style={[styles.label, { color: colors.textMuted }]}>Região monitorada</Text>
        <View style={styles.pickerContainer}>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ padding: 10 }} />
          ) : (
            <View style={[styles.inputGroup, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Picker
                selectedValue={regiaoId}
                onValueChange={(itemValue) => setRegiaoId(itemValue)}
                style={{ flex: 1, color: colors.text }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label="Selecione uma região..." value={undefined} color={colors.textMuted} />
                {regioes.map((r) => (
                  <Picker.Item key={r.id} label={r.nome} value={r.id} color={colors.text} />
                ))}
              </Picker>
            </View>
          )}
        </View>

        <Button 
          title="Salvar" 
          onPress={handleSalvar} 
          style={{ marginTop: 8 }}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logout} onPress={handleLogout}>
            <Text style={[styles.logoutText, { color: colors.danger }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32, paddingVertical: 8 },
  settingLabel: { fontSize: 16, fontWeight: "500" },
  label: { marginBottom: 6 },
  pickerContainer: { marginBottom: 24 },
  inputGroup: { 
    flexDirection: "row", 
    alignItems: "center", 
    borderWidth: 1, 
    borderRadius: 8,
    overflow: "hidden"
  },
  button: { borderRadius: 8, padding: 14, alignItems: "center", marginTop: 8 },
  buttonText: { fontWeight: "bold" },
  footer: { marginTop: 80, marginBottom: 40 },
  logout: { alignItems: "center", padding: 12 },
  logoutText: { fontWeight: "600", fontSize: 16 },
});
