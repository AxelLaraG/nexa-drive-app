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
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EidtCar({ navigation, route }) {
  const { vehicle } = route.params;

  const [status, setStatus] = useState(vehicle.status);
  const [brand, setBrand] = useState(vehicle.brand);
  const [model, setModel] = useState(vehicle.model);
  const [date, setDate] = useState(new Date(vehicle.create_date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(vehicle.pic_url);
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

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const vehicleRef = doc(db, "vehicles", vehicle.id_real);
      await deleteDoc(vehicleRef);

      Alert.alert("Éxito", "El vehículo ha sido eliminado correctamente.");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
      Alert.alert("Error", "Hubo un problema al eliminar el vehículo.");
    } finally {
      setLoading(false);
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

  const handleUpdate = async () => {
    setLoading(true);
    setError("");

    // Validación de campos
    if (!brand || !model || !image) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl = image;

      // Subir imagen si es una nueva
      if (!image.startsWith("http")) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(
          storage,
          `vehicles/${vehicle.id}_${Date.now()}.jpg`
        );
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Actualizar datos en Firestore
      const vehicleRef = doc(db, "vehicles", vehicle.id_real);

      console.log("vehicleRef", vehicleRef);

      await updateDoc(vehicleRef, {
        status,
        brand,
        model,
        create_date: date.toISOString(),
        pic_url: imageUrl,
      });

      Alert.alert("Éxito", "El vehículo ha sido actualizado correctamente.");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error al actualizar el vehículo:", error);
      Alert.alert("Error", "Hubo un problema al actualizar el vehículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer2}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Editar Vehiculo</Text>

          <View style={styles.form}>
            {/* Estatus */}
            <Text style={styles.label}>Estatus</Text>
            <Picker
              selectedValue={status}
              style={styles.input}
              onValueChange={(itemValue) => setStatus(itemValue)}
              value={status}
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
                value={brand}
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
                value={model}
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
            <TouchableOpacity style={styles.formBtn} onPress={handleUpdate}>
              <Text style={styles.btnText}>
                {loading ? "Cargando..." : "Actualizar Auto"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.formBtnDelete}
              onPress={handleDelete}
            >
              <Text style={styles.btnText}>
                {loading ? "Cargando..." : "Borrar Auto"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
