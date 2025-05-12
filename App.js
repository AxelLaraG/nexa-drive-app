import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./Navigation/StackNavigator";
import { ActionSheetProvider } from "@expo/react-native-action-sheet"; // Importa ActionSheetProvider

export default function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
