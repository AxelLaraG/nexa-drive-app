import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Asegúrate de importar correctamente
import styles from "../Styles/Styles";

export default function Inicio({ navigation }) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Estado para el pull-to-refresh
  const video_url =
    "https://firebasestorage.googleapis.com/v0/b/ejemplosreact.firebasestorage.app/o/videos%2Fadmon.mp4?alt=media&token=37b55662-f05f-4409-bc70-dd96110c1068";

  useEffect(() => {
    fetchData();
    onRefresh();
  }, []);

  const fetchData = async () => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "vehicles"));
      const vehicles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(vehicles);
    } catch (error) {
      console.error("Error al obtener los datos:", error); // Agrega manejo de errores
    }
  };

  const handlePressCard = (item) => {
    navigation.navigate("FormEdit", { vehicle: item });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Vuelve a cargar los datos
    setRefreshing(false);
  };

  const filterData = data.filter(
    (item) =>
      item.brand?.toLowerCase().includes(search.toLowerCase()) ||
      item.model?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePress = () => {
    navigation.navigate("FormCar");
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      horizontal={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      } // Agrega el RefreshControl
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Video Player */}
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: video_url }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              isLooping
            />
          </View>

          {/* Barra de búsqueda */}
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar por marca o modelo"
            value={search}
            onChangeText={setSearch}
          />

          {/* Botón flotante */}
          <TouchableOpacity style={styles.fab} onPress={handlePress}>
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>

          {/* Listado de Tarjetas */}
          <FlatList
            data={filterData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePressCard(item)}>
                <View style={styles.card}>
                  <Image
                    source={{ uri: item.pic_url }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.cardText}>ID: {item.id}</Text>
                  <Text style={styles.cardText}>Marca: {item.brand}</Text>
                  <Text style={styles.cardText}>Modelo: {item.model}</Text>
                  <Text style={styles.cardText}>Estatus: {item.status}</Text>
                  <Text style={styles.cardText}>
                    Fecha Alta: {item.create_date}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </ScrollView>
  );
}
