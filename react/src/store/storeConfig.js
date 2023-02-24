import { 
    createStore, 
    combineReducers,
    compose,
    applyMiddleware 
} from "redux";
import thunk from "redux-thunk";
import usuarioReducer from './reducers/usuario'

const reducers = combineReducers({
    usuario: usuarioReducer
})

const storeConfig = () => {
    return createStore(reducers, compose(applyMiddleware(thunk)))
}

export default storeConfig;