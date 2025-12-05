import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../../components/CustomAlert";
import { loginWithEmail } from "../services/firebase";
import { isLoggedIn } from "../services/mmkv";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // Check if user already logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = isLoggedIn();
      if (loggedIn) {
        router.replace("/screens/HomeScreen");
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertTitle("Validasi");
      setAlertMessage("Email dan password harus diisi");
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      setAlertTitle("Sukses");
      setAlertMessage("Login berhasil!");
      setAlertVisible(true);
      router.replace("/screens/HomeScreen");
    } catch (error: any) {
      setAlertTitle("Error");
      setAlertMessage(error.message || "Terjadi kesalahan");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={localStyles.container}>
      <View style={localStyles.card}>
        <Text style={localStyles.title}>Login</Text>

        <Text style={localStyles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Masukkan email"
          editable={!loading}
          style={localStyles.input}
        />

        <Text style={localStyles.label}>Password</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Masukkan password"
          editable={!loading}
          style={localStyles.input}
        />

        <View style={{ marginTop: 12 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <>
              <TouchableOpacity
                style={localStyles.button}
                onPress={handleLogin}
              >
                <Text style={localStyles.buttonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  localStyles.button,
                  {
                    backgroundColor: "#fff",
                    borderColor: "#999",
                    borderWidth: 1,
                    marginTop: 10,
                  },
                ]}
                onPress={() => router.push("/auth/register")}
              >
                <Text style={[localStyles.buttonText, { color: "#333" }]}>
                  Belum punya akun? Register
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  label: { marginTop: 8, marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
