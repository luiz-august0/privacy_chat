import { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import { api, createSession } from "../services/api";

export const AuthContext = createContext();

export const login = async (email, senha) => {
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
};

export const logout = async () => {
    await AsyncStorage.removeItem("usuario");
    await AsyncStorage.removeItem("token");
    
    api.defaults.headers.Authorization = null;
    
    //setUsuario(null);
};


export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        const usuarioRecuperado = await AsyncStorage.getItem("usuario");
        const token = await AsyncStorage.getItem('token');

        if(usuarioRecuperado && token) {
            setUsuario(JSON.parse(usuarioRecuperado));
            api.defaults.headers.Authorization = `Bearer ${token}`;
        }

        setLoading(false);
    }, []);
};