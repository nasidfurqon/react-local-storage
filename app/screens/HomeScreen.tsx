import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../../components/CustomAlert";
import { auth } from "../services/firebase";
import { getLogin, getUserEmail, isLoggedIn, logout } from "../services/mmkv";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  topArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  section: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
    color: "#666",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  userCard: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  bottomArea: {
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  logoutButtonText: { color: "#fff", fontWeight: "600" },
});

export default function HomeScreen() {
  const [userEmail, setUserEmail] = useState("");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const email = getUserEmail();
    const userId = getLogin();
    setUserEmail(email || "");
    setUid(userId || "");

    if (!isLoggedIn() || !userId) {
      router.replace("/auth/login");
    }
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      logout();
      setAlertTitle("Logout");
      setAlertMessage("Anda telah berhasil logout.");
      setAlertVisible(true);
      router.replace("../auth/login");
    } catch (error: any) {
      setAlertTitle("Error");
      setAlertMessage("Gagal logout: " + (error?.message ?? ""));
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <Text style={styles.header}>Selamat Datang!</Text>

        <View style={styles.userCard}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userEmail || "Loading..."}</Text>

          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>
            {uid ? uid.substring(0, 20) + "..." : "Loading..."}
          </Text>
        </View>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/mahasiswa")}
        >
          <Text style={styles.primaryButtonText}>Lihat Data Mahasiswa</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
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
