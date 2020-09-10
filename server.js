const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const uuid = require('uuid');

const port = process.env.PORT || 3000;
const GameManager = require('./controller/gamemanager');
const { join, move, message, sendId } = require('./controller/socket');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('./client'));

let rooms = {};

function emitStart(room, startPlayer) {
    io.to(room).emit('start', { room, startPlayer});
}

io.on('connection', (socket) => {
    sendId(socket, io, uuid);
    join(socket, rooms, GameManager, io, emitStart);
    move(socket, rooms);
    message(socket, io);
});

http.listen(port, () => console.log('Listen!'));