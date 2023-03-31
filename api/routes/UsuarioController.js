import sendEmail from '../sendEmail';
import { checkPassword, createPasswordHash } from '../services/auth';

const mysql = require('../config/mysql').pool;

class UsuarioController {
    async index(req, res) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario`,
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

    async show (req, res) {
        try {
            const { id } = req.params;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * from usuario WHERE Usr_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (!result) {
                            return res.status(404).json();
                        }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async create(req, res) {
        try {
            const { email, senha } = req.body;

            const encryptedPassword = await createPasswordHash(senha);
            
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Email = "${email}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                    
                        if (JSON.stringify(result) != '[]') {
                            return res.status(400).json('Email já cadastrado');
                        } else {
                            conn.query(
                                `INSERT INTO usuario (Usr_Email, Usr_Senha) VALUES ` + 
                                `("${email}", "${encryptedPassword}")`,
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
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async updatePassword(req, res) {
        try {
            const { id } = req.params;
            const { senhaAntiga, senhaNova } = req.body;

            const encryptedPassword = await createPasswordHash(senhaNova);

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Codigo = "${id}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json('Usuário não encontrado');
                        } else {
                            const usuarioSenha = JSON.stringify(result[0].Usr_Senha).slice(0, -1).slice(1 | 1);

                            if (!checkPassword(senhaAntiga, usuarioSenha)) {
                                return res.status(401).json({ error: "Senha inválida." });
                            } else {
                                conn.query(
                                    `UPDATE usuario SET Usr_Senha = "${encryptedPassword}" WHERE Usr_Codigo = ${id}`,
                                    (error, result, fields) => {
                                        if (error) { return res.status(500).send({ error: error }) }

                                        return res.status(201).json(result);
                                    }
                                )
                            }
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

    async destroy(req, res) {
        try {
            const { id } = req.params;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Codigo = "${id}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json('Usuário não encontrado');
                        } else {
                            conn.query(
                                `DELETE FROM usuario WHERE Usr_Codigo = "${id}"`,
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

    async postEnviaEmailRecuperacaoSenha(req, res) {
        try {
            const { email } = req.body;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT *, MD5(Usr_Senha) AS Email FROM usuario WHERE Usr_Email = "${email}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json();
                        } else {
                            const email = JSON.stringify(result[0].Usr_Email).slice(0, -1).slice(1 | 1);
                            const key = JSON.stringify(result[0].Email).slice(0, -1).slice(1 | 1);
                            const link = `https://privacy-chat.vercel.app/${key}`
                            const send = async() => {
                                if (await sendEmail(email, link, 'RECUPERACAO')) {
                                    return res.status(201).json();
                                } else {
                                    return res.status(400).json();
                                }
                            }

                            send();
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

    async postRecuperacaoSenha(req, res) {
        try {
            const { key, senha } = req.body;

            const encryptedPassword = await createPasswordHash(senha);

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE MD5(Usr_Senha) = "${key}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json();
                        } else {
                            const id = JSON.stringify(result[0].Usr_Codigo);
                            conn.query(
                                `UPDATE usuario SET Usr_Senha = "${encryptedPassword}" WHERE Usr_Codigo = ${id}`,
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