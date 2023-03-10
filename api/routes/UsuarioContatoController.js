const mysql = require('../config/mysql').pool;

class UsuarioController {
    async getSolicitacoes(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario_solicitacao WHERE Usr_Codigo = ${id}`,
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

    async getSolicitacoesEnviadas(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario_solicitacao WHERE Usr_Solicitacao = ${id}`,
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

    async postSolicitacao (req, res) {
        try {
            //usuarioSolicitado = Quem voce quer enviar a solicitação
            //usuarioSolicitacao = Você
            const { usuarioSolicitado, usuarioSolicitacao } = req.body;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario_solicitacao WHERE Usr_Codigo = ${usuarioSolicitado} AND Usr_Solicitacao = ${usuarioSolicitacao}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) !== '[]') {
                            return res.status(401).json();
                        } else {
                            conn.query(
                                `SELECT * FROM usuario WHERE Usr_Codigo = ${usuarioSolicitado}`,
                                (error, result, fields) => {
                                    if (error) { return res.status(500).send({ error: error }) }
                                    if (JSON.stringify(result) === '[]') {
                                        return res.status(404).json();
                                    } else {
                                        conn.query(
                                            `INSERT INTO usuario_solicitacao VALUES(${usuarioSolicitado}, ${usuarioSolicitacao})`,
                                            (error, result, fields) => {
                                                if (error) { return res.status(500).send({ error: error }) }
                                                return res.status(201).json(result);
                                            }    
                                        )
                                    }
                                }
                            )
                        }
                    }
                )
                conn.release();
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async deleteSolicitacao (req, res) {
        try {
            const { usuarioSolicitado, usuarioSolicitacao } = req.body;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario_solicitacao WHERE Usr_Codigo = ${usuarioSolicitado} AND Usr_Solicitacao = ${usuarioSolicitacao}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json();
                        } else {
                           conn.query(
                            `DELETE FROM usuario_solicitacao WHERE Usr_Codigo = ${usuarioSolicitado} AND Usr_Solicitacao = ${usuarioSolicitacao}`,
                            (error, result, fields) => {
                                if (error) { return res.status(500).send({ error: error }) }
                                return res.status(201).json(result);
                            }
                           )
                        }
                    }
                )
                conn.release();
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async getContatos(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario_contato WHERE Usr_Codigo = ${id}`,
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

    async postContato (req, res) {
        try {
            const { usuarioID, contato, contatoApelido } = req.body;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `DELETE FROM usuario_solicitacao WHERE Usr_Codigo = ${usuarioID} AND Usr_Solicitacao = ${contato}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json();
                        } else {
                           conn.query(
                            `INSERT INTO usuario_contato VALUES(${usuarioID}, ${contato}, "${contatoApelido}")`,
                            (error, result, fields) => {
                                if (error) { return res.status(500).send({ error: error }) }
                                return res.status(201).json(result);
                            }
                           )
                        }
                    }
                )
                conn.release();
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async deleteContato (req, res) {
        try {
            const { usuarioID, contato } = req.body;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario_contato WHERE Usr_Codigo = ${usuarioID} AND UsrC_Contato = ${contato}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json();
                        } else {
                           conn.query(
                            `DELETE FROM usuario_contato WHERE Usr_Codigo = ${usuarioID} AND UsrC_Contato = ${contato}`,
                            (error, result, fields) => {
                                if (error) { return res.status(500).send({ error: error }) }
                                return res.status(201).json(result);
                            }
                           )
                        }
                    }
                )
                conn.release();
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }
}

export default new UsuarioController();