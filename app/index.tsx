import { Redirect } from "expo-router";
import { useUser } from "@/hooks/useRegiao";

export default function Index() {
  const { token } = useUser();
  return <Redirect href={token ? "/(tabs)" : "/auth/login"} />;
}