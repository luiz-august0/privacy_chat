import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login/index';
import Registro from './src/pages/Registro/index';
import Home from './src/pages/Home';
import { AuthProvider } from './src/contexts/auth';
import EditarSenha from './src/pages/EditarSenha';

const Stack = createNativeStackNavigator();

const Routes = () => {
    return (
        <AuthProvider>
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
                    <Stack.Screen
                    name="Home"
                    component={Home}
                    />
                    <Stack.Screen
                    name="EditarSenha"
                    component={EditarSenha}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    )
}

export default Routes;