const mysql = require('../config/mysql').pool;

class ChatController {
    async getMensagens(req, res) {
        const { senderID, receiverID } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT Sender_Id, Receiver_Id, CONVERT(Mensagem USING utf8) AS Mensagem, Data FROM chats
                     WHERE (Sender_Id = ${senderID} AND Receiver_Id = ${receiverID})
                     OR (Sender_Id = ${receiverID} AND Receiver_Id = ${senderID})`,
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

    async postMensagem(req, res) {
        const { senderID, receiverID, mensagem, data } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `INSERT INTO chats VALUES(${senderID}, ${receiverID}, "${mensagem}", "${data}")`,
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

}

export default new ChatController();