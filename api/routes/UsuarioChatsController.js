const mysql = require('../config/mysql').pool;

class UsuarioChatsController {
	async getContatosChats(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT tmp.Usr_Codigo, tmp.UsrC_Contato, tmp.UsrC_Apelido FROM  (
					 SELECT Usr_Codigo, UsrC_Contato, UsrC_Apelido FROM usuario_contato WHERE Usr_Codigo = ${id}
					 UNION ALL
					 SELECT Usr_Codigo, Usr_Chat AS UsrC_Contato, NULL AS UsrC_Apelido FROM usuario_chats WHERE Usr_Codigo = ${id}
					 ) AS tmp
					 GROUP BY UsrC_Contato`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }

						return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

	async getChats(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT USC.Usr_Codigo, USC.Usr_Chat, UC.UsrC_Apelido FROM usuario_chats USC
					 LEFT JOIN usuario_contato UC
					 ON USC.Usr_Codigo = UC.Usr_Codigo
					 AND USC.Usr_Chat = UC.UsrC_Contato
					 WHERE USC.Usr_Codigo = ${id}
					 GROUP BY USC.Usr_Chat`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                    
						return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

	async postChat(req, res) {
        const { usuarioID, contatoID } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT Usr_Codigo FROM usuario WHERE Usr_Codigo = ${contatoID}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) !== "[]") {
                            conn.query(
                                `SELECT * FROM usuario_chats WHERE Usr_Codigo = ${usuarioID} AND Usr_Chat = ${contatoID}`,
                                (error, result, fields) => {
                                    if (error) { return res.status(500).send({ error: error }) }
            
                                    if (JSON.stringify(result) == "[]") {
                                        conn.query(
                                            `INSERT INTO usuario_chats VALUES(${usuarioID}, ${contatoID})`,
                                            (error, result, fields) => {
                                                if (error) { return res.status(500).send({ error: error }) }
                                            }
                                        )

                                        conn.query(
                                            `INSERT INTO usuario_chats VALUES(${contatoID}, ${usuarioID})`,
                                            (error, result, fields) => {
                                                if (error) { return res.status(500).send({ error: error }) }
                                                return res.status(201).json(result);
                                            }
                                        )
                                    } else {
                                        return res.status(201).json(result);
                                    }
                                }
                            )
                        } else {
                            return res.status(404).json();
                        }
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

	async deleteChat(req, res) {
        const { usuarioID, contatoID } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `DELETE FROM usuario_chats WHERE (Usr_Codigo = ${usuarioID} AND Usr_Chat = ${contatoID}) OR (Usr_Codigo = ${contatoID} AND Usr_Chat = ${usuarioID}) `,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
						return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }
}

export default new UsuarioChatsController();