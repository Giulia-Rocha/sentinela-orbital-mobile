import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs screenOptions={{
      tabBarStyle: { 
        backgroundColor: colors.surface, 
        borderTopColor: colors.border,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarShowLabel: false,
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
    }}>
      <Tabs.Screen 
        name="index"
        options={{ 
          title: "Principal", 
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="alertas"
        options={{ 
          title: "Alertas", 
          tabBarLabel: "Alertas",
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="forecast"
        options={{ 
          title: "Previsão", 
          tabBarLabel: "Previsão",
          tabBarIcon: ({ color, size }) => <Ionicons name="thermometer" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="settings"
        options={{ 
          title: "Configurações", 
          tabBarLabel: "Config",
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />
        }} 
      />
    </Tabs>
  );
}