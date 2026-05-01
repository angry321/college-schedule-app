import { Text, StyleSheet } from "react-native"

export function TextStyle({ children }) {
	return <Text style={styles.text}>{children}</Text>
}

const styles = StyleSheet.create({
	text: {
		color: "white",
		fontSize: 16,
	},
});