import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

import { API_URL } from "../../src/config/api";

export default function Calls() {
  const [data, setData] = useState([]);

  const loadCalls = () => {
    fetch(`${API_URL}/calls`)
      .then(res => res.json())
      .then(res => {
        console.log("API RESPONSE:", res);

        if (Array.isArray(res)) {
          setData(res);
        } else if (Array.isArray(res.calls)) {
          setData(res.calls);
        } else {
          setData([]);
        }
      })
      .catch(err => {
        console.log(err);
        setData([]);
      });
  };

  useEffect(() => {
    loadCalls();
  }, []);

  if (!data.length) {
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
        paddingBottom: 120,
      }}
    >
      {data.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.text}>
            {item.number}) {item.time}
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

  card: {
    backgroundColor: "#1c1c1c",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  text: {
    color: "white",
    fontSize: 16,
  },
};