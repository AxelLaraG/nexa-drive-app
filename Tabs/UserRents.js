import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "../Styles/Styles";
import { db } from "../firebase/FirebaseConf";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function UserRents({ navigation, route }) {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = route.params?.userId || "defaultUserId"; // ID del usuario logueado

  useEffect(() => {
    fetchUserRents();
  }, []);

  const fetchUserRents = async () => {
    try {
      const rentsCollection = collection(db, "rents");
      const q = query(rentsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const userRents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRents(userRents);
    } catch (error) {
      console.error("Error al obtener las rentas:", error);
      Alert.alert("Error", "No se pudieron cargar las rentas.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRent = (rent) => {
    navigation.navigate("EditRent", { rent });
  };

  const renderRentItem = ({ item }) => {
    const returnDate = new Date(item.returnDate);
    const currentDate = new Date();

    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>ID Renta: {item.id}</Text>
        <Text style={styles.cardText}>Vehículo: {item.vehicle}</Text>
        <Text style={styles.cardText}>Fecha de Renta: {item.rentDate}</Text>
        <Text style={styles.cardText}>Fecha de Devolución: {item.returnDate}</Text>
        {returnDate > currentDate && (
          <TouchableOpacity
            style={styles.formBtn}
            onPress={() => handleEditRent(item)}
          >
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Rentas</Text>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={rents}
          keyExtractor={(item) => item.id}
          renderItem={renderRentItem}
        />
      )}
    </View>
  );
}
