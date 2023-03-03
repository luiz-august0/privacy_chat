import axios from "axios";

export const api = axios.create({
    baseURL: 'https://api-privacy-chat.vercel.app'
});

//Rota de sessão
export const createSession = async (email, senha) => {
    return api.put('/sessions', { email, senha });
};
/**************************************************************/

//Rota de usuários
export const getUsuarios = async () => { 
    return api.get('/usuario');
};

export const createUsuario = async (email, senha) => {
    return api.post('/usuario', { email, senha });
};

export const updateUsuarioPassword = async (senhaAntiga, senhaNova, usuarioID) => {
    return api.post(`/usuario_password/${usuarioID}`, { senhaAntiga, senhaNova });
};

export const deleteUsuario = async (usuarioID) => {
    return api.delete(`/usuario/${usuarioID}`);
};

export const getUsuario = async (usuarioID) => {
    return api.get(`/usuario/${usuarioID}`);
};