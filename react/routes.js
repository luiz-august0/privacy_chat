import 'react-native-gesture-handler';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItem, DrawerItemList, DrawerContentScrollView } from '@react-navigation/drawer';
import { AuthProvider } from './src/contexts/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./src/services/api";
import Login from './src/pages/Login/index';
import Registro from './src/pages/Registro/index';
import Home from './src/pages/Home/index';
import EditarSenha from './src/pages/EditarSenha/index';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import UsuarioSolicitacoes from './src/pages/UsuarioSolicitacoes';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerContent = (props) => {
    const logout = async() => {
        await AsyncStorage.removeItem("usuario");
        await AsyncStorage.removeItem("token");
        
        api.defaults.headers.Authorization = null;
    }

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Sair" 
            icon={({color, size}) => <MIcon color={color} size={size} name="logout" />}
            inactiveTintColor='#FFF'
            onPress={() => { logout(); props.navigation.navigate('Login');}}/>
        </DrawerContentScrollView>
    )
}

const HomeNav = () => {
    return (
        <Drawer.Navigator useLegacyImplementation={true} initialRouteName="Home" 
            drawerContent={props => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                headerTintColor: "#FFF",
                drawerInactiveTintColor: "#FFF",
                headerPressColor: "#515657",
                drawerActiveTintColor: "#515657",
                drawerStyle: {
                    backgroundColor: '#000',
                    width: 240,
                },
                headerStyle: {
                    backgroundColor: '#000',
                    shadowColor: 'transparent'
                }
            }}>
            <Drawer.Screen name="Home" component={Home} 
                options={
                    {
                        drawerLabel: "Início",
                        drawerIcon: ({color, size}) => (
                            <FIcon name="home" size={size} color={color}/>
                        ),
                        headerTitle: ""
                    }
            }/>
            <Drawer.Screen name="EditarSenha" component={EditarSenha} 
                options={
                    {
                        drawerLabel: "Alterar senha",
                        drawerIcon: ({color, size}) => (
                            <FIcon name="edit" size={size} color={color}/>
                        ),
                        headerTitle: ""
                    }
            }/>
            <Drawer.Screen name="UsuarioSolicitacoes" component={UsuarioSolicitacoes} 
                options={
                    {
                        drawerLabel: "Solicitações",
                        drawerIcon: ({color, size}) => (
                            <FIcon name="users" size={size} color={color}/>
                        ),
                        headerTitle: ""
                    }
            }/>
        </Drawer.Navigator>
    )
}

const Routes = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Login'
                screenOptions={{
                headerShown: false
                }}
                >
                    <Stack.Screen
                    name="HomeNav"
                    component={HomeNav}
                    />
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
        </AuthProvider>
    )
}

export default Routes;