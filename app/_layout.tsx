import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="screens/HomeScreen" />
        <Stack.Screen name="screens/LoginScreen" />
        <Stack.Screen name="screens/RegisterScreen" />
        <Stack.Screen name="mahasiswa" />
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}
