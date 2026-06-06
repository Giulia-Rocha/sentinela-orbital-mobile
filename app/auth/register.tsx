import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { api } from "@/services/api";
import { useUser } from "@/hooks/useRegiao";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useUser();
  const { colors } = useTheme();

  async function handleRegister() {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("Erro", "Senha deve ter no mínimo 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { nome, email, senha });
      setToken(res.data.token, nome);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      if (error.response) {
        const message = error.response.data?.message || "Não foi possível criar a conta";
        Alert.alert("Erro de Cadastro", message);
      } else if (error.request) {
        Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique o IP em src/constants/config.ts");
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Criar Conta</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} placeholder="Nome"
        placeholderTextColor={colors.textMuted}
        value={nome} onChangeText={setNome} />
      <TextInput style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} placeholder="Email"
        placeholderTextColor={colors.textMuted}
        value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} placeholder="Senha (mín. 6 caracteres)"
        placeholderTextColor={colors.textMuted}
        value={senha} onChangeText={setSenha} secureTextEntry />
      
      <Button 
        title="Cadastrar" 
        onPress={handleRegister} 
        loading={loading}
        style={{ marginTop: 8 }}
      />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.link, { color: colors.accent }]}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 32 },
  input: { borderRadius: 8, padding: 14, marginBottom: 12, borderWidth: 1 },
  button: { borderRadius: 8, padding: 14, alignItems: "center", marginTop: 8 },
  buttonText: { fontWeight: "bold", fontSize: 16 },
  link: { textAlign: "center", marginTop: 16 },
});