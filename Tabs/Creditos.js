import { Text, View, ScrollView } from "react-native";
import React from "react";
import styles from "../Styles/Styles";

export default function Creditos() {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      horizontal={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Créditos</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Desarrollador:</Text>
            <Text style={styles.value}>Axel Lara Madero</Text>

            <Text style={styles.label}>Docente:</Text>
            <Text style={styles.value}>PULIDO ALBA ROCIO ELIZABETH</Text>

            <Text style={styles.label}>Nombre de la App:</Text>
            <Text style={styles.value}>Rentacar Admin</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
