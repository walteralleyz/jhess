const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const uuid = require('uuid');

const port = process.env.PORT || 3000;
const GameManager = require('./controller/gamemanager');
const { join, move, message, sendId, bot, off } = require('./controller/socket');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('./client'));
app.use('*', (req, res) => {
    res.status(404).send("404! Página não encontrada.");
});

let rooms = {};
let numConnected = 0;

function emitStart(room, startPlayer) {
    io.to(room).emit('start', { room, startPlayer});
}

function changeNum(num) {
    if(num < 0 && numConnected === 0) {
        numConnected = 0;
    }
    else numConnected += num;

    return numConnected;
}

io.on('connection', (socket) => {
    sendId(socket, io, uuid);
    
    join(socket, rooms, GameManager, io, emitStart);
    bot(socket, rooms, GameManager, io, emitStart);
    move(socket, rooms);
    message(socket, io);
    off(socket, io, changeNum);

    io.emit('clients', { len: changeNum(1) });
});

http.listen(port, () => console.log('Listen!'));