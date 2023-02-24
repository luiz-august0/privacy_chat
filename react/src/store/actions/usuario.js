import { USUARIO_LOGADO } from "./actionTypes"; 

export const usuarioLogado = (usuario) => {
    return {
        type: USUARIO_LOGADO,
        payload: usuario
    }
}