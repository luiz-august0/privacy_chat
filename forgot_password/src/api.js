import axios from "axios";

export const api = axios.create({
    baseURL: process.env.REACT_APP_BASEURL
});

export const updatePassword = async(key, senha) => {
    return api.post('/usuario_recuperacao', { key, senha })
};