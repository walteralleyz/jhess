const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

const port = process.env.PORT || 3000;
const GameManager = require('./controller/gamemanager');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('./client'));

let rooms = {};

function emitStart(room) {
    io.to(room).emit('start', room);
}

io.on('connection', (socket) => {
    io.emit('id', {id: socket.id});

    socket.on('join', body => {
        const { player, id } = JSON.parse(body);
        const oponent = player === 'y' ? 'r' : 'y';
        let roomId = `${player}-${id}`;

        for(let room in rooms) {
            if(room.split('-')[0] === oponent) {
                if(rooms[room].status === 'open') roomId = room;
            }
        }

        socket.join(roomId, err => {
            if(err) console.log(err);
            else {
                if(rooms[roomId]) {
                    rooms[roomId].status = 'full';
                    rooms[roomId].game = new GameManager(player, id, socket, roomId);
                    
                    emitStart(roomId);
                    console.log(rooms);
                }
                else {
                    rooms[roomId] = {
                        status: 'open',
                        game: null
                    };
                };
            }
        });
    });

    socket.on('move', body => {
        const {boxIndex, rowIndex, roomId} = JSON.parse(body);

        rooms[roomId].game.select(boxIndex, rowIndex);
    });
});

http.listen(port, () => console.log('Listen!'));