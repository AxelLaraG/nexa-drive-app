import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomDatePicker from "../Components/CustomDatePicker";
import styles from "../Styles/Styles";
import { Picker } from "@react-native-picker/picker";
import ShakeView from "../Components/ShakeView";
import { db, storage } from "../firebase/FirebaseConf";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  runTransaction,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function FormCar({ navigation }) {
  const [status, setStatus] = useState("Activo");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso denegado", "Se necesita acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso denegado", "Se necesita acceso a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!brand || !model || !date || !image) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      // Subir imagen al Storage
      const imageRef = ref(storage, `car_images/${Date.now()}_${brand}.jpg`);
      const response = await fetch(image); // URI de la imagen local
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);

      const picUrl = await getDownloadURL(imageRef);

      // Obtener nuevo ID secuencial desde config
      const newId = await runTransaction(db, async (transaction) => {
        const configDocRef = doc(db, "config", "car_count");
        const configDoc = await transaction.get(configDocRef);

        if (!configDoc.exists()) {
          throw new Error("El documento 'car_count' no existe.");
        }

        const currentCount = configDoc.data().count;
        transaction.update(configDocRef, { count: currentCount + 1 });
        return currentCount;
      });

      // Crear nuevo documento del vehículo
      const vehiclesCollectionRef = collection(db, "vehicles");
      const docRef = await addDoc(vehiclesCollectionRef, {
        id: newId,
        brand: brand,
        create_date: date.toISOString(),
        model: model,
        pic_url: picUrl,
        status: status,
      });

      // Agregar campo "id_real" con el ID generado por Firestore
      await updateDoc(docRef, {
        id_real: docRef.id,
      });

      setLoading(false);

      Alert.alert(
        "Formulario enviado",
        "Los datos se han registrado correctamente."
      );

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Alert.alert("Error", "Hubo un problema al enviar los datos.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer2}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Registro de Auto</Text>

          <View style={styles.form}>
            {/* Estatus */}
            <Text style={styles.label}>Estatus</Text>
            <Picker
              selectedValue={status}
              style={styles.input}
              onValueChange={(itemValue) => setStatus(itemValue)}
            >
              <Picker.Item label="Activo" value="Activo" />
              <Picker.Item label="Inactivo" value="Inactivo" />
            </Picker>

            {/* Marca del auto */}
            <Text style={styles.label}>Marca del auto</Text>

            <ShakeView shake={error && !brand}>
              <TextInput
                style={[
                  styles.input,
                  error && !brand && { borderColor: "red" },
                ]}
                placeholder="Marca del auto"
                onChangeText={setBrand}
              />
            </ShakeView>

            {/* Modelo */}
            <Text style={styles.label}>Modelo</Text>

            <ShakeView shake={error && !model}>
              <TextInput
                style={[
                  styles.input,
                  error && !model && { borderColor: "red" },
                ]}
                placeholder="Modelo"
                onChangeText={setModel}
              />
            </ShakeView>

            {/* Fecha de alta */}
            <Text style={styles.label}>Fecha de alta</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <CustomDatePicker
                value={date}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (event.type === "set" && selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}

            {/* Imagen */}
            <ShakeView shake={error && !image}>
              <Text style={[styles.label, error && !image && { color: "red" }]}>
                Imagen
              </Text>
            </ShakeView>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={[styles.formBtn, { flex: 1, marginRight: 5 }]}
                onPress={handleImagePicker}
              >
                <Text style={styles.btnText}>Galería</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formBtn, { flex: 1, marginLeft: 5 }]}
                onPress={handleCamera}
              >
                <Text style={styles.btnText}>Cámara</Text>
              </TouchableOpacity>
            </View>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: 200, marginTop: 10 }}
              />
            )}

            {/* Botón de envío */}
            <TouchableOpacity style={styles.formBtn} onPress={handleSubmit}>
              <Text style={styles.btnText}>
                {loading ? "Cargando..." : "Registrar Auto"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
