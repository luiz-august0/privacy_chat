import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login/index';
import Registro from './src/pages/Registro/index';

const Stack = createNativeStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
            screenOptions={{
            headerShown: false
            }}
            >
                <Stack.Screen
                name="Login"
                component={Login}
                />
                <Stack.Screen
                name="Registro"
                component={Registro}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Routes;