import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertaProvider } from "@/context/AlertaContext";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function AppContent() {
  const { tema } = useTheme();
  return (
    <>
      <StatusBar style={tema === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AlertaProvider>
          <AppContent />
        </AlertaProvider>
      </UserProvider>
    </ThemeProvider>
  );
}