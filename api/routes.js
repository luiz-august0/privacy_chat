import { Router } from "express";
import SessionController from "./routes/SessionController";
import auth from "./middlewares/auth";
import UsuarioController from "./routes/UsuarioController";

const routes = new Router();

routes.post('/usuario', UsuarioController.create);
routes.put('/sessions', SessionController.create);
routes.use(auth);

//Rotas usuário
routes.get('/usuario', UsuarioController.index);
routes.get('/usuario/:id', UsuarioController.show);
routes.post('/usuario_password/:id', UsuarioController.updatePassword);
routes.delete('/usuario/:id', UsuarioController.destroy);

export default routes;