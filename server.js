const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io'); // class from socket.io 
const ACTIONS = require('./src/Actions');

const server = http.createServer(app);
const io = new Server(server); // create instance of server 

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// storing in local memory 
const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // get roomID from  adapter which are present in socket   -> give map then convert to array then iterate 
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);
 
    // map the user with socket id  // key is socket id value is username 
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;  
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId); // list of connnected client .. return socketid & username
        clients.forEach(({ socketId }) => { // get the sockerid from clients
            io.to(socketId).emit(ACTIONS.JOINED, {  //in io to which socketid to notify joined & send data 
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });  //code emit to all except you 
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];  // Get the list of rooms that the socket is joined to
        rooms.forEach((roomId) => {
            //socket.in(roomId) syntax is used to target only the sockets in the specific room.
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, { 
                socketId: socket.id,
                username: userSocketMap[socket.id],   //showing to all that this user is getting disconnected
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
