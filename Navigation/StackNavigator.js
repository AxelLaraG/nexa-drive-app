import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Screens/Login';
import Register from '../Screens/Register';
import Home from '../Screens/Home';
import Inicio from '../Tabs/Inicio';
import FormCar from '../Screens/FormCar';
import EditCar from '../Screens/EditCar';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
       <Stack.Navigator >
        <Stack.Screen name="Login" options={{headerShown:false}} component={Login} />
        <Stack.Screen name="Register" options={{headerShown:false}} component={Register} />
        <Stack.Screen name="Home" options={{headerShown:false}} component={Home} />
        <Stack.Screen name="Inicio" options={{headerShown:false}} component={Inicio} />
        <Stack.Screen name="FormCar" options={{headerShown:false}} component={FormCar} />
        <Stack.Screen name="FormEdit" options={{headerShown:false}} component={EditCar} />
       </Stack.Navigator>
    );
}