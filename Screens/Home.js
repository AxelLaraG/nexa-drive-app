import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import Inicio from "../Tabs/Inicio";
import Sucursales from "../Tabs/Sucursales";
import Creditos from "../Tabs/Creditos";
import UserRents from "../Tabs/UserRents";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConf";

const Drawer = createDrawerNavigator();

export default function Home({ navigation }) {
  const userId = auth.currentUser?.uid; // Obtén el userId del usuario logueado

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
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
      <Drawer.Screen name="Rentas" component={UserRents} initialParams={{ userId }} />
      <Drawer.Screen name="Creditos" component={Creditos} />
    </Drawer.Navigator>
  );
}
