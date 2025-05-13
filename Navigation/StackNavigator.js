import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Screens/Login';
import Register from '../Screens/Register';
import Home from '../Screens/Home';
import Inicio from '../Tabs/Inicio';
import UserRents from '../Tabs/UserRents';
import EditRent from '../Screens/EditRent';
import FormRenta from '../Screens/FormRenta';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
       <Stack.Navigator >
        <Stack.Screen name="Login" options={{headerShown:false}} component={Login} />
        <Stack.Screen name="Register" options={{headerShown:false}} component={Register} />
        <Stack.Screen name="Home" options={{headerShown:false}} component={Home} />
        <Stack.Screen name="Inicio" options={{headerShown:false}} component={Inicio} />
        <Stack.Screen name="UserRents" options={{headerShown:false}} component={UserRents} />
        <Stack.Screen name="EditRent" options={{headerShown:false}} component={EditRent} />
        <Stack.Screen name="FormRenta" options={{headerShown:false}} component={FormRenta} />
       </Stack.Navigator>
    );
}