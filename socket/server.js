const app = require("./app");
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = [];

const addUser = (userID, socketID) => {
    !users.some(user=>user.userID === userID) &&
        users.push({ userID, socketID });
}

const removeUser = (socketID) => {
    users = users.filter((user) => user.socketID !== socketID);
}

const getUser = (userID) => {
    return users.find(user=>user.userID === userID);
}

io.on('connection', (socket) => {
    console.log('Um usuário conectou.');

    socket.on("addUser", userID => {
        addUser(userID, socket.id);
        io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderID, receiverID, text }) => {
        const user = getUser(receiverID);
        io.emit(user.socketID).emit("getMessage", {
            senderID,
            text
        })
    })

    socket.on("disconnect", () => {
        console.log("Um usuário desconectou.");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
});

http.listen(6000);