import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import CustomDatePicker from "../Components/CustomDatePicker";
import styles from "../Styles/Styles";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConf";

export default function EditRent({ route, navigation }) {
  const { rent } = route.params; // Recibe los datos de la renta seleccionada
  const [returnDate, setReturnDate] = useState(() => {
    // rent.return_date es "YYYY-MM-DD"
    const [year, month, day] = rent.return_date.split("-").map(Number);
    return new Date(year, month - 1, day); // new Date(año, mes-1, día) crea la fecha en hora local
  });
  const [vehicleName, setVehicleName] = useState(""); // Estado para el nombre del vehículo
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener el nombre del vehículo al cargar la pantalla
  useEffect(() => {
    const fetchVehicleName = async () => {
      try {
        // Realiza una consulta para buscar el vehículo cuyo campo "id" coincida con rent.vehicle_id
        const vehiclesCollection = collection(db, "vehicles");
        const q = query(vehiclesCollection, where("id", "==", rent.vehicle_id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const vehicleData = querySnapshot.docs[0].data(); // Obtén el primer documento que coincida
          setVehicleName(`${vehicleData.brand} ${vehicleData.model}`); // Combina marca y modelo
        } else {
          console.error("El vehículo no existe en la base de datos.");
          setVehicleName("Vehículo no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el nombre del vehículo:", error);
        setVehicleName("Error al cargar el vehículo");
      }
    };

    fetchVehicleName();
  }, [rent.vehicle_id]);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");

    if (!(returnDate instanceof Date) || isNaN(returnDate)) {
      setError("La fecha de devolución no es válida");
      setLoading(false);
      return;
    }

    try {
      console.log(rent.id)
      const rentDocRef = doc(db, "rents", rent.id);
      await updateDoc(rentDocRef, {
        return_date: returnDate.toISOString().split("T")[0],
      });

      setLoading(false);

      Alert.alert("Éxito", "La renta ha sido actualizada correctamente.");
      navigation.goBack(); // Regresa a la pantalla anterior
    } catch (error) {
      console.error("Error al actualizar la renta:", error);
      Alert.alert("Error", "No se pudo actualizar la renta.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer3}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Editar Renta</Text>

          <View style={styles.form}>
            {/* Vehículo seleccionado */}
            <Text style={styles.label}>Vehículo seleccionado</Text>
            <View style={[styles.input, { backgroundColor: "#f0f0f0" }]}>
              <Text>{vehicleName}</Text>
            </View>

            {/* Fecha de devolución */}
            <Text style={styles.label}>Fecha de devolución</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowReturnDatePicker(true)}
            >
              <Text>{returnDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showReturnDatePicker && (
              <CustomDatePicker
                value={returnDate}
                onChange={(event, selectedDate) => {
                  setShowReturnDatePicker(false);
                  if (event.type === "set" && selectedDate) {
                    setReturnDate(new Date(selectedDate)); // Asegúrate de que sea un objeto Date
                  }
                }}
              />
            )}

            {/* Botón de guardar */}
            <TouchableOpacity style={styles.formBtn} onPress={handleUpdate}>
              <Text style={styles.btnText}>
                {loading ? "Cargando..." : "Guardar Cambios"}
              </Text>
            </TouchableOpacity>

            {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
