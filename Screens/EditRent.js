import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConf";
import styles from "../Styles/Styles";

export default function EditRent({ route, navigation }) {
  const { rent } = route.params; // Recibe los datos de la renta seleccionada
  const [returnDate, setReturnDate] = useState(rent.returnDate);
  const [vehicle, setVehicle] = useState(rent.vehicle);

  const handleUpdate = async () => {
    try {
      const rentDocRef = doc(db, "rents", rent.id);
      await updateDoc(rentDocRef, {
        returnDate,
        vehicle,
      });
      Alert.alert("Éxito", "La renta ha sido actualizada correctamente.");
      navigation.goBack(); // Regresa a la pantalla anterior
    } catch (error) {
      console.error("Error al actualizar la renta:", error);
      Alert.alert("Error", "No se pudo actualizar la renta.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Renta</Text>

      <Text style={styles.label}>Vehículo</Text>
      <TextInput
        style={styles.input}
        value={vehicle}
        onChangeText={setVehicle}
        placeholder="Vehículo"
      />

      <Text style={styles.label}>Fecha de Devolución</Text>
      <TextInput
        style={styles.input}
        value={returnDate}
        onChangeText={setReturnDate}
        placeholder="YYYY-MM-DD"
      />

      <TouchableOpacity style={styles.formBtn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
}
