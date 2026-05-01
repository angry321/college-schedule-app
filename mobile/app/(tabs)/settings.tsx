import { View, Text, Button, StyleSheet } from "react-native";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { TouchableOpacity } from "react-native";

import { API_URL } from "../../src/config/api";

export default function SettingsScreen() {
  const [status, setStatus] = useState("Файл не выбран");

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});

    if (result.canceled) return;

    const file = result.assets[0];

    console.log("FILE:", file);

    setStatus("Загрузка...");

    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/vnd.ms-excel",
    } as any);

    fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    })
      .then(res => res.json())
      .then(data => {
        console.log("UPLOAD OK:", data);

        setStatus("✅ Файл загружен");

        fetch(`${API_URL}/today`)
            .then(res => res.json())
            .then(() => {
                console.log("UPDATED")
            });
      })
      .catch(err => {
        console.log("UPLOAD ERR:", err);
        setStatus("❌ Ошибка загрузки");
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Загрузка расписания</Text>

        <TouchableOpacity
          onPress={pickFile}
          style={{
            backgroundColor: "#1c1c1c",
            borderWidth: 1,
            borderColor: "#4ade80",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 5,
          }}
        >
          <Text style={{ color: "#4ade80", fontWeight: "600" }}>
            Выбрать таблицу
          </Text>
        </TouchableOpacity>

        <Text style={styles.status}>{status}</Text>
      </View>
      {/*<View style={styles.card}>
        <Text style={styles.title}>Уведомления</Text>

      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Тема</Text>

      </View>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f0f0f",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
  },
  status: {
    fontWeight: "300",
    marginTop: 5,
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  card: {
    flexDirection: "column",
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 12,
    overflow: "hidden",
  },
});