import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../../components/CustomAlert";
import { registerWithEmail } from "../services/firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setAlertTitle("Validasi");
      setAlertMessage("Semua field harus diisi");
      setAlertVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertTitle("Validasi");
      setAlertMessage("Password tidak cocok");
      setAlertVisible(true);
      return;
    }

    if (password.length < 6) {
      setAlertTitle("Validasi");
      setAlertMessage("Password minimal 6 karakter");
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password);
      setAlertTitle("Sukses");
      setAlertMessage("Akun berhasil dibuat");
      setAlertVisible(true);
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Register error:", error);
      setAlertTitle("Gagal");
      setAlertMessage(error.message || "Terjadi kesalahan");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={localStyles.container}>
      <View style={localStyles.card}>
        <Text style={localStyles.title}>Register</Text>

        <Text style={localStyles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Masukkan email"
          editable={!loading}
          keyboardType="email-address"
          style={localStyles.input}
        />

        <Text style={localStyles.label}>Password</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Masukkan password (minimal 6 karakter)"
          editable={!loading}
          style={localStyles.input}
        />

        <Text style={localStyles.label}>Konfirmasi Password</Text>
        <TextInput
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Masukkan password lagi"
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
                onPress={handleRegister}
              >
                <Text style={localStyles.buttonText}>Register</Text>
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
                onPress={() => router.push("/auth/login")}
              >
                <Text style={[localStyles.buttonText, { color: "#333" }]}>
                  Sudah punya akun? Login
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
