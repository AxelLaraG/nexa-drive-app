import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";
import CustomDatePicker from "../Components/CustomDatePicker";
import styles from "../Styles/Styles";
import { Picker } from "@react-native-picker/picker";
import { db } from "../firebase/FirebaseConf";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function FormRenta({ navigation }) {
  const [rentDate, setRentDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showRentDatePicker, setShowRentDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "vehicles")
        );
        const activeVehicles = querySnapshot.docs
          .filter((doc) => doc.data().status === "Activo")
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setVehicles(activeVehicles);
      } catch (error) {
        console.error("Error al obtener los vehículos:", error);
      }
    };

    fetchVehicles();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!vehicleId || !rentDate || !returnDate) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    if (returnDate < rentDate) {
      setError("La fecha de devolución no puede ser menor a la fecha de renta");
      setLoading(false);
      return;
    }

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
        const vehicleDocRef = doc(db, "vehicles", vehicleId);
        await updateDoc(vehicleDocRef, { status: "Inactivo" });
      }

      const rentsCollectionRef = collection(db, "rents");
      await addDoc(rentsCollectionRef, {
        vehicle_id: vehicleId,
        rent_date: rentDate.toISOString(),
        return_date: returnDate.toISOString(),
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
                    setReturnDate(selectedDate);
                  }
                }}
              />
            )}

            {/* ID del vehículo */}
            <Text style={styles.label}>ID del vehículo</Text>
            <Picker
              selectedValue={vehicleId}
              style={styles.input}
              onValueChange={(itemValue) => setVehicleId(itemValue)}
            >
              <Picker.Item label="Selecciona un vehículo" value="" />
              {vehicles.map((vehicle) => (
                <Picker.Item
                  key={vehicle.id}
                  label={`${vehicle.brand} - ${vehicle.model}`}
                  value={vehicle.id}
                />
              ))}
            </Picker>

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
