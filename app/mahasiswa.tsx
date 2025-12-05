import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "./services/firebase";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 15,
  },
  card: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    fontSize: 14,
  },
  value: {
    fontSize: 13,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
});

export default function Mahasiswa() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllMahasiswa = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "mahasiswa"));
      const mahasiswaData = querySnapshot.docs.map((doc) => {
        const raw = doc.data() as any;

        const findPhoneInObject = (obj: any): any => {
          if (!obj || typeof obj !== "object") return undefined;
          const keys = Object.keys(obj);
          const phoneRegex =
            /^(no[\s_]?h?p|nohp|handphone|phone|mobile|tel|telephone|hp)$/i;
          for (const k of keys) {
            if (phoneRegex.test(k)) return obj[k];
          }
          for (const k of keys) {
            const normalized = k.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
            if (phoneRegex.test(normalized)) return obj[k];
          }
          for (const k of keys) {
            if (obj[k] && typeof obj[k] === "object") {
              const nested = findPhoneInObject(obj[k]);
              if (nested !== undefined) return nested;
            }
          }
          return undefined;
        };

        let noHp = findPhoneInObject(raw);
        if (noHp === undefined) {
          noHp =
            raw.noHp ??
            raw.no_hp ??
            raw.nohp ??
            raw.phone ??
            raw.no ??
            raw.hp ??
            raw.handphone ??
            undefined;
        }
        if (typeof noHp === "number") noHp = String(noHp);
        if (typeof noHp === "string") noHp = noHp.trim();

        return {
          id: doc.id,
          nama: raw.nama ?? "",
          nim: raw.nim ?? "",
          prodi: raw.prodi ?? "",
          email: raw.email ?? "",
          noHp,
          ...raw,
        } as any;
      });
      return mahasiswaData as any[];
    } catch (error) {
      console.error("Error fetching mahasiswa:", error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      const mahasiswaData = await fetchAllMahasiswa();
      setData(mahasiswaData);
    } catch (error) {
      console.error("Error fetching mahasiswa:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchData();
    }, [])
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Data Mahasiswa</Text>
      <Text style={styles.subHeader}>Jumlah Mahasiswa: {data.length}</Text>

      {data.length === 0 ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "#999", fontSize: 16 }}>
            Tidak ada data mahasiswa
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>Nama</Text>
              <Text style={styles.value}>{item.nama}</Text>
              <Text style={[styles.label, { marginTop: 8 }]}>NIM</Text>
              <Text style={styles.value}>{item.nim}</Text>

              <Text style={[styles.label, { marginTop: 8 }]}>Prodi</Text>
              <Text style={styles.value}>{item.prodi}</Text>

              {item.email && (
                <>
                  <Text style={[styles.label, { marginTop: 8 }]}>Email</Text>
                  <Text style={styles.value}>{item.email}</Text>
                </>
              )}

              {item.noHp && (
                <>
                  <Text style={[styles.label, { marginTop: 8 }]}>No HP</Text>
                  <Text style={styles.value}>{item.noHp}</Text>
                </>
              )}
            </View>
          )}
        />
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
