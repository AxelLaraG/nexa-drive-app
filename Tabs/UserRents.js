import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import styles from "../Styles/Styles";
import { db } from "../firebase/FirebaseConf";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function UserRents({ navigation, route }) {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = route.params?.userId;

  useFocusEffect(
    React.useCallback(() => {
      fetchUserRents();
    }, [userId])
  );

  const fetchUserRents = async () => {
    try {
      const rentsCollection = collection(db, "rents");
      const q = query(rentsCollection, where("user_id", "==", userId));
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
    const returnDate = new Date(item.return_date);
    const currentDate = new Date();

    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>ID Renta: {item.id}</Text>
        <Text style={styles.cardText}>Vehículo: {item.vehicle_id}</Text>
        <Text style={styles.cardText}>Fecha de Renta: {item.rent_date}</Text>
        <Text style={styles.cardText}>Fecha de Devolución: {item.return_date}</Text>
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Mis Rentas</Text>
        {loading ? (
          <Text>Cargando...</Text>
        ) : rents.length === 0 ? (
          <Text>No se encontraron rentas para este usuario.</Text>
        ) : (
          <FlatList
            data={rents}
            keyExtractor={(item) => item.id}
            renderItem={renderRentItem}
            scrollEnabled={false} // Desactiva el scroll del FlatList ya que está dentro del ScrollView
          />
        )}
      </View>
    </ScrollView>
  );
}