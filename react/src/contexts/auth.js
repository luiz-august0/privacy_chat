import createContext from "./createContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { api, createSession, getUsuario } from "../services/api";

const initialState = {};

const reducer = (state, action) => {
    switch (action.type) {
        default:
        return state;
    }
};

const login = (dispatch) => {
    return async (email, senha) => {
        try {           
            const response = await createSession(email, senha);

            const usuarioLogado = response.data.usuario;
            const token = response.data.token;

            await AsyncStorage.setItem("usuario", JSON.stringify(usuarioLogado));
            await AsyncStorage.setItem("token", token);

            api.defaults.headers.Authorization = `Bearer ${token}`;

            return {
                authenticated: true,
                token: token,
                dataUsuario: usuarioLogado
            }

        } catch (error) {
            console.log(error)
            Alert.alert('Email ou senha inválido');
            return {authenticated: false};
        }
    }
};

const logout = (dispatch) => {
    return async () => {
        await AsyncStorage.removeItem("usuario");
        await AsyncStorage.removeItem("token");
        
        api.defaults.headers.Authorization = null;
    }
};

const loadUser = (dispatch) => {
    return async () => {
        const usuario = await AsyncStorage.getItem("usuario");
        const token = await AsyncStorage.getItem("token");

        if (usuario && token) {
            try {        
                api.defaults.headers.Authorization = `Bearer ${token}`;
                
                const response = await getUsuario(JSON.parse(usuario).id);
                const data = response.data;    
            
                return {
                    authenticated: true,
                    token: token,
                    dataUsuario: {
                        id: data[0].Usr_Codigo,
                        email: data[0].Usr_Email
                    }
                }
            } catch (error) {
                console.log(error);
            }

        } else {
            return {authenticated: false};
        }
    }
}

export const { Context, AuthProvider } = createContext(
    reducer,
    { login, logout, loadUser },
    initialState,
);