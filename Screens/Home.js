import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import Inicio from "../Tabs/Inicio";
import Sucursales from "../Tabs/Sucursales";
import Creditos from "../Tabs/Creditos";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConf"; // Ajusta según tu ruta

const Drawer = createDrawerNavigator();

export default function Home({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login"); // o como se llame tu pantalla de login
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: "teal",
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Cerrar sesión"
            onPress={handleLogout}
            labelStyle={{ color: "red" }}
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen name="Inicio" component={Inicio} />
      <Drawer.Screen name="Sucursales" component={Sucursales} />
      <Drawer.Screen name="Creditos" component={Creditos} />
    </Drawer.Navigator>
  );
}

