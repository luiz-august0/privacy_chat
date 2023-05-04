import { Router } from "express";
import SessionController from "./routes/SessionController";
import auth from "./middlewares/auth";
import UsuarioController from "./routes/UsuarioController";
import UsuarioContatoController from "./routes/UsuarioContatoController";
import UsuarioChatsController from "./routes/UsuarioChatsController";

const routes = new Router();

routes.post('/usuario', UsuarioController.create);
routes.post('/usuario_emailrecuperacao', UsuarioController.postEnviaEmailRecuperacaoSenha);
routes.post('/usuario_recuperacao', UsuarioController.postRecuperacaoSenha);
routes.put('/sessions', SessionController.create);
routes.use(auth);

//Rotas usuário
routes.get('/usuario', UsuarioController.index);
routes.get('/usuario/:id', UsuarioController.show);
routes.post('/usuario_password/:id', UsuarioController.updatePassword);
routes.delete('/usuario/:id', UsuarioController.destroy);

//Rotas usuario contato
routes.get('/usuario_solicitacao/:id', UsuarioContatoController.getSolicitacoes);
routes.get('/usuario_solicitacao_enviadas/:id', UsuarioContatoController.getSolicitacoesEnviadas);
routes.post('/usuario_solicitacao', UsuarioContatoController.postSolicitacao);
routes.post('/usuario_solicitacao_remove', UsuarioContatoController.deleteSolicitacao);
routes.get('/usuario_contato/:id', UsuarioContatoController.getContatos);
routes.post('/usuario_contato', UsuarioContatoController.postContato);
routes.post('/usuario_contato_apelido', UsuarioContatoController.updateContatoApelido);
routes.post('/usuario_contato_remove', UsuarioContatoController.deleteContato);

//Rotas usuario chats
routes.get('/usuario_chat_contatos/:id', UsuarioChatsController.getContatosChats);
routes.get('/usuario_chat/:id', UsuarioChatsController.getChats);
routes.post('/usuario_chat', UsuarioChatsController.postChat);
routes.post('/usuario_chat_remove', UsuarioChatsController.deleteChat);

export default routes;