import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../Styles/Styles";
import ShakeView from "../Components/ShakeView";
import { auth, db } from "../firebase/FirebaseConf"; // Importa Firebase
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useGoogleAuth } from "../firebase/GoogleConfig"; // Importa el hook de Google

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { request, response, promptAsync } = useGoogleAuth(); // Usa el hook de Google

  const sendDataFromGoogle = async (idToken, accessToken) => {
    const credential = GoogleAuthProvider.credential(idToken, accessToken);
    try {
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      console.log("Usuario autenticado con Google:", user);
      navigation.replace("Home");
    } catch (error) {
      console.error("Error al autenticar con Google:", error);
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      sendDataFromGoogle(
        response.authentication.idToken,
        response.authentication.accessToken
      );
    } else if (response?.type === "dismiss") {
      console.error("El usuario canceló el inicio de sesión con Google.");
      setError("Inicio de sesión cancelado. Por favor, inténtalo de nuevo.");
    } else if (response) {
      console.error("Error en la autenticación de Google:", response);
      setError("Error en la autenticación con Google. Intenta nuevamente.");
    }
  }, [response]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      // Buscar el usuario en la colección "users" por nombre de usuario
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Usuario no encontrado");
        setLoading(false);
        return;
      }

      // Obtener el correo del usuario
      const userDoc = querySnapshot.docs[0];
      const userEmail = userDoc.data().email;

      // Autenticar al usuario con el correo obtenido
      await signInWithEmailAndPassword(auth, userEmail, password);
      navigation.replace("Home"); // O la pantalla que desees
    } catch (error) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      horizontal={false}
      keyboardShouldPersistTaps="handled"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Bienvenido!</Text>

            <View style={styles.form}>
              <ShakeView shake={error && !username}>
                <TextInput
                  style={[
                    styles.input,
                    error && !username && { borderColor: "red" },
                  ]}
                  placeholder="Nombre de usuario"
                  onChangeText={setUsername}
                />
              </ShakeView>

              <ShakeView shake={error}>
                <TextInput
                  style={[styles.input, error && { borderColor: "red" }]}
                  placeholder="Contraseña"
                  secureTextEntry={true}
                  onChangeText={setPassword}
                />
              </ShakeView>

              <TouchableOpacity>
                <Text style={styles.linkLabel}>¿Contraseña olvidada?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.formBtn}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.btnText}>
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.signUpLabel}>¿No tienes cuenta? </Text>
            <TouchableOpacity>
              <Text
                style={styles.signUpLink}
                onPress={() => navigation.replace("Register")}
              >
                Regístrate
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
      </ScrollView>
    </ScrollView>
  );
}
