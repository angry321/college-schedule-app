import { View, Text, Button, StyleSheet } from "react-native";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { TouchableOpacity } from "react-native";

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

    fetch("http://192.168.0.21:8000/upload", {
        method: "POST",
        body: formData,
    })
      .then(res => res.json())
      .then(data => {
        console.log("UPLOAD OK:", data);

        setStatus("✅ Файл загружен");

        fetch("http://192.168.0.21:8000/today")
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
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "#4ade80", fontWeight: "600" }}>
          Выбрать таблицу
        </Text>
      </TouchableOpacity>

      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  status: {
    marginTop: 20,
    color: "#fff",
    textAlign: "center",
  },
});