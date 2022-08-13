import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Details } from '../screens/details';
import Guests from '../screens/guests';


const {
    Navigator,
    Screen
} = createNativeStackNavigator();

export function AppRoutes() {
    return (

        <Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Screen name="guests" component={Guests} />
            <Screen name="details" component={Details} />
        </Navigator>
    );
}