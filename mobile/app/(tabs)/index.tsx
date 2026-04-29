import { useEffect, useState } from "react";
import { Text, View, ScrollView, Button } from "react-native";
import { TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const [data, setData] = useState(null);

  const loadData = () => {
    fetch("http://192.168.0.21:8000/today")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0f0f0f" }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 20,
      }}
    >
      {/* 🔄 КНОПКА ОБНОВЛЕНИЯ */}
      <TouchableOpacity
        onPress={loadData}
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
          🔄 Обновить
        </Text>
      </TouchableOpacity>

      <Text style={styles.day}>📅 {data.day}</Text>

      {data.lessons?.map((lesson, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.leftBar} />

          <View style={styles.content}>
            <Text style={styles.time}>
              {lesson.number}) {lesson.time}
            </Text>

            <Text style={styles.subject}>{lesson.subject}</Text>

            <Text style={styles.room}>📍 Кабинет: {lesson.room}</Text>
          </View>
        </View>
      ))}

      {data.info?.map((item, i) => (
        <View key={i} style={styles.infoCard}>
          <Text style={styles.infoText}>
            {item.type === "lunch"
              ? `🍽️ ${item.time} - ${item.text}`
              : `🧹 После занятий - ${item.text}`}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = {
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
  },

  text: {
    color: "white",
  },

  day: {
    fontSize: 26,
    color: "white",
    marginVertical: 15,
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },

  leftBar: {
    width: 6,
    backgroundColor: "#4ade80",
  },

  content: {
    padding: 12,
    flex: 1,
  },

  time: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 4,
  },

  subject: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },

  room: {
    color: "#888",
    fontSize: 14,
  },

  infoCard: {
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },

  infoText: {
    color: "#ccc",
  },
};