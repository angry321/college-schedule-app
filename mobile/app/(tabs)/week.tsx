import { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { TouchableOpacity } from "react-native";

export default function Week() {
  const [data, setData] = useState(null);

  const loadWeek = () => {
    fetch("http://192.168.0.21:8000/week")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadWeek();
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
        onPress={loadWeek}
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

      {data.week?.map((day, i) => (
        <View key={i} style={styles.dayCard}>
          <Text style={styles.dayTitle}>📅 {day.day}</Text>

          {day.lessons?.map((lesson, j) => (
            <View key={j} style={styles.lesson}>
              <Text style={styles.text}>
                {lesson.number}) {lesson.time}
              </Text>

              <Text style={styles.subject}>
                {lesson.subject}
              </Text>

              <Text style={styles.room}>
                📍 Кабинет: {lesson.room}
              </Text>
            </View>
          ))}

          {day.info?.map((item, k) => (
            <Text key={k} style={styles.info}>
              {item.type === "lunch"
                ? `🍽️ ${item.time} - ${item.text}`
                : `🧹 После занятий - ${item.text}`}
            </Text>
          ))}
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

  dayCard: {
    backgroundColor: "#1c1c1c",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  dayTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  lesson: {
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#4ade80",
  },

  subject: {
    color: "white",
    fontSize: 16,
  },

  room: {
    color: "#aaa",
    fontSize: 13,
  },

  info: {
    color: "#aaa",
    marginTop: 5,
  },
};