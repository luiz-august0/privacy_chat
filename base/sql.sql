CREATE TABLE usuario (
	Usr_Codigo INT(11) PRIMARY KEY AUTO_INCREMENT,
	Usr_Email VARCHAR(110) UNIQUE NOT NULL,
	Usr_Senha VARCHAR(255) NOT NULL
)ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb3;

CREATE TABLE usuario_solicitacao(
	Usr_Codigo INT(11) NOT NULL,
	Usr_Solicitacao INT(11) NOT NULL
);

CREATE TABLE usuario_contato(
	Usr_Codigo INT(11) NOT NULL,
	UsrC_Contato INT(11) NOT NULL,
	UsrC_Apelido VARCHAR(120)
);

CREATE TABLE usuario_chats (
	Usr_Codigo INT(11) NOT NULL,
	Usr_Chat INT(11) NOT NULL
);

CREATE TABLE chats (
	Sender_Id INT(11) NOT NULL,
	Receiver_Id INT(11) NOT NULL,
	Mensagem LONGBLOB NOT NULL,
	Tipo VARCHAR(255) NOT NULL,
	Data DATETIME NOT NULL
);

ALTER TABLE usuario_solicitacao ADD CONSTRAINT fk_usuariosolicitacao
FOREIGN KEY (Usr_Codigo) REFERENCES usuario (Usr_Codigo);

ALTER TABLE usuario_solicitacao ADD CONSTRAINT fk_usuario_solicitacao
FOREIGN KEY (Usr_Solicitacao) REFERENCES usuario (Usr_Codigo);

ALTER TABLE usuario_solicitacao ADD CONSTRAINT pk_usuario_solicitacao
PRIMARY KEY (Usr_Codigo, Usr_Solicitacao);

ALTER TABLE usuario_contato ADD CONSTRAINT fk_usuariocontato
FOREIGN KEY (Usr_Codigo) REFERENCES usuario (Usr_Codigo);

ALTER TABLE usuario_contato ADD CONSTRAINT fk_usuariocontato_contato
FOREIGN KEY (UsrC_Contato) REFERENCES usuario (Usr_Codigo);

ALTER TABLE usuario_contato ADD CONSTRAINT pk_usuario_contato
PRIMARY KEY (Usr_Codigo, UsrC_Contato);

ALTER TABLE usuario_chats ADD CONSTRAINT fk_usuariochat
FOREIGN KEY (Usr_Codigo) REFERENCES usuario (Usr_Codigo);

ALTER TABLE usuario_chats ADD CONSTRAINT fk_usuariochat_chat
FOREIGN KEY (Usr_Chat) REFERENCES usuario (Usr_Codigo);

ALTER TABLE usuario_chats ADD CONSTRAINT pk_usuario_chat
PRIMARY KEY (Usr_Codigo, Usr_Chat);

ALTER TABLE chats ADD CONSTRAINT fk_usuario_sender
FOREIGN KEY (Sender_Id) REFERENCES usuario (Usr_Codigo);

ALTER TABLE chats ADD CONSTRAINT fk_usuario_receiver
FOREIGN KEY (Receiver_Id) REFERENCES usuario (Usr_Codigo);