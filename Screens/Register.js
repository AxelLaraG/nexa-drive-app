import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import React, { useState } from "react";
import styles from "../Styles/Styles";
import { auth } from "../firebase/FirebaseConf";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  setDoc,
  getDocs,
  query,
  collection,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/FirebaseConf";
import Icon from "react-native-vector-icons/FontAwesome";
import ShakeView from "../Components/ShakeView";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usrExists, setUsrExists] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError(""); // limpiar errores anteriores

    if (!email || !password || !confirmPassword || !username) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      // Verificar si el username ya existe
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("El nombre de usuario ya está en uso");
        setUsrExists(true);
        setLoading(false);
        return;
      }

      // Crear el usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Registrar en Firestore con el mismo UID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
        createdAt: new Date(),
      });

      Alert.alert("Usuario creado con éxito");
      navigation.navigate("Login");
    } catch (error) {
      setError(error.message);
      console.error("Error en el registro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Crea una cuenta!</Text>

        {usrExists ? (
            <Text style={{ color: "red", textAlign: "center", marginBottom: 5 }}>
              {error}
            </Text>
          ) : null}

        <View style={styles.form}>
          <ShakeView shake={error && !username}>
            <TextInput
              style={[
                styles.input,
                error && (!username || usrExists) && { borderColor: "red" },
              ]}
              placeholder="Nombre de usuario"
              onChangeText={setUsername}
            />
          </ShakeView>

          <ShakeView shake={error && !email}>
            <TextInput
              style={[styles.input, error && !email && { borderColor: "red" }]}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </ShakeView>

          <ShakeView shake={error && !password}>
            <TextInput
              style={[
                styles.input,
                error && !password && { borderColor: "red" },
              ]}
              placeholder="Contraseña"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
          </ShakeView>

          <ShakeView shake={error && !confirmPassword}>
            <TextInput
              style={[
                styles.input,
                error && !confirmPassword && { borderColor: "red" },
              ]}
              placeholder="Confirma tu Contraseña"
              secureTextEntry={true}
              onChangeText={setConfirmPassword}
            />
          </ShakeView>

          <TouchableOpacity
            style={styles.formBtn}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Cargando..." : "Crear Cuenta"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.signUpLabel}>¿Ya tienes cuenta? </Text>
        <TouchableOpacity>
          <Text
            style={styles.signUpLink}
            onPress={() => navigation.replace("Login")}
          >
            Inicia Sesión
          </Text>
        </TouchableOpacity>

        {/*}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.googleLoginButton}
                onPress={() => promptAsync()} // Inicia el flujo de Google
                disabled={!request || loading}
              >
                <Icon name="google" style={styles.googleIcon} />
                <Text>Inicia sesión con Google</Text>
              </TouchableOpacity>
            </View>*/}
      </View>
    </View>
  );
}
