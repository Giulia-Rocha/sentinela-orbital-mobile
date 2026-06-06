import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { api } from "@/services/api";
import { useUser } from "@/hooks/useRegiao";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useUser();
  const { colors } = useTheme();

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, senha });
      setToken(res.data.token, res.data.name);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Erro no login:", error);
      if (error.response) {
        // O servidor respondeu com um status de erro
        const message = error.response.data?.message || "Credenciais inválidas";
        Alert.alert("Erro de Login", message);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta (erro de rede)
        Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique se o IP em src/constants/config.ts está correto.");
      } else {
        // Algo aconteceu ao montar a requisição
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>🛰️ Sentinela Orbital</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Monitoramento de Ondas de Calor</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} placeholder="Email"
        placeholderTextColor={colors.textMuted}
        value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} placeholder="Senha"
        placeholderTextColor={colors.textMuted}
        value={senha} onChangeText={setSenha} secureTextEntry />
      
      <Button 
        title="Entrar" 
        onPress={handleLogin} 
        loading={loading}
        style={{ marginTop: 8 }}
      />

      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={[styles.link, { color: colors.accent }]}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 40 },
  input: { borderRadius: 8, padding: 14, marginBottom: 12, borderWidth: 1 },
  button: { borderRadius: 8, padding: 14, alignItems: "center", marginTop: 8 },
  buttonText: { fontWeight: "bold", fontSize: 16 },
  link: { textAlign: "center", marginTop: 16 },
});