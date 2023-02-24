import { USUARIO_LOGADO } from "../actions/actionTypes"; 

const initialState = {};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case USUARIO_LOGADO:
            return {
                state: action.payload
            }
        default: 
            return state
    }
}

export default reducer;