import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Details } from '../screens/details';
import Guests from '../screens/guests';
import { BarCode } from '../screens/barcode';


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
            <Screen name="barcode" component={BarCode} />
            <Screen name="guests" component={Guests} />
            <Screen name="details" component={Details} />
        </Navigator>
    );
}