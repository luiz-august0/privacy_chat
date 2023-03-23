import axios from "axios";

export const api = axios.create({
    baseURL: 'http://192.168.0.106:5000'
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

//Rotas de usuario contato
export const getUsuarioSolicitacoes = async (usuarioID) => { 
    return api.get(`/usuario_solicitacao/${usuarioID}`);
};

export const getUsuarioSolicitacoesEnviadas = async (usuarioID) => { 
    return api.get(`/usuario_solicitacao_enviadas/${usuarioID}`);
};

export const postUsuarioSolicitacao = async (usuarioSolicitado, usuarioSolicitacao) => { 
    return api.post('/usuario_solicitacao', { usuarioSolicitado,  usuarioSolicitacao });
};

export const deleteUsuarioSolicitacao = async (usuarioSolicitado, usuarioSolicitacao) => { 
    return api.post('/usuario_solicitacao_remove', { usuarioSolicitado,  usuarioSolicitacao });
};

export const getUsuarioContato = async (usuarioID) => { 
    return api.get(`/usuario_contato/${usuarioID}`);
};

export const postUsuarioContato = async (usuarioID, contato, contatoApelido) => { 
    return api.post('/usuario_contato', { usuarioID, contato, contatoApelido });
};

export const updateContatoApelido = async (usuarioID, contato, contatoApelido) => { 
    return api.post('/usuario_contato_apelido', { usuarioID, contato, contatoApelido });
};

export const deleteUsuarioContato = async (usuarioID, contato, contatoApelido) => { 
    return api.post('/usuario_contato_remove', { usuarioID, contato, contatoApelido });
};