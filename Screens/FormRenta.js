import React, { useState } from "react";
import { Text, TouchableOpacity, View, Alert, ScrollView } from "react-native";
import CustomDatePicker from "../Components/CustomDatePicker";
import styles from "../Styles/Styles";
import { db } from "../firebase/FirebaseConf";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function FormRenta({ route, navigation }) {
  const { vehicle } = route.params; // Recibe el vehículo seleccionado
  const [rentDate, setRentDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showRentDatePicker, setShowRentDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!rentDate || !returnDate) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    if (!(rentDate instanceof Date) || isNaN(rentDate)) {
      setError("La fecha de renta no es válida");
      setLoading(false);
      return;
    }

    if (!(returnDate instanceof Date) || isNaN(returnDate)) {
      setError("La fecha de devolución no es válida");
      setLoading(false);
      return;
    }

    if (returnDate < rentDate) {
      setError("La fecha de devolución no puede ser menor a la fecha de renta");
      setLoading(false);
      return;
    }

    console.log("Filtros pasados");

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "No se encontró un usuario loggeado.");
        setLoading(false);
        return;
      }

      const currentDate = new Date();

      // Verificar si las fechas son mayores a la fecha actual
      if (rentDate > currentDate || returnDate > currentDate) {
        const vehicleDocRef = doc(db, "vehicles", vehicle.id_real);
        await updateDoc(vehicleDocRef, { status: "Inactivo" });
      }

      const rentsCollectionRef = collection(db, "rents");
      await addDoc(rentsCollectionRef, {
        vehicle_id: vehicle.id,
        rent_date: rentDate.toISOString().split("T")[0],
        return_date: returnDate.toISOString().split("T")[0],
        user_id: user.uid,
      });

      setLoading(false);

      Alert.alert(
        "Formulario enviado",
        "La renta se ha registrado correctamente."
      );

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Alert.alert("Error", "Hubo un problema al registrar la renta.");
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
          <Text style={styles.title}>Registro de Renta</Text>

          <View style={styles.form}>
            {/* Fecha de renta */}
            <Text style={styles.label}>Fecha de renta</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowRentDatePicker(true)}
            >
              <Text>{rentDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showRentDatePicker && (
              <CustomDatePicker
                value={rentDate}
                onChange={(event, selectedDate) => {
                  setShowRentDatePicker(false);
                  if (event.type === "set" && selectedDate) {
                    setRentDate(selectedDate);
                  }
                }}
              />
            )}

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

            {/* Vehículo seleccionado */}
            <Text style={styles.label}>Vehículo seleccionado</Text>
            <View style={[styles.input, { backgroundColor: "#f0f0f0" }]}>
              <Text>{`${vehicle.brand} - ${vehicle.model}`}</Text>
            </View>

            {/* Botón de envío */}
            <TouchableOpacity style={styles.formBtn} onPress={handleSubmit}>
              <Text style={styles.btnText}>
                {loading ? "Cargando..." : "Registrar Renta"}
              </Text>
            </TouchableOpacity>

            {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
