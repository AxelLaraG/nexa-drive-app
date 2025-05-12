import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Creditos() {
  return (
    <View style={styles.container}>
      <Text>Sucursales</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});