exports.join = (socket, container, Game, io, next) => {
    socket.on('join', body => {
        const { player, id } = JSON.parse(body);
        const oponent = player === 'y' ? 'r' : 'y';
        let roomId = `${player}-${id}`;
    
        for(let room in container) {
            if(room.split('-')[0] === oponent) {
                if(container[room].status === 'open') roomId = room;
            }
        }

        this.create(socket, container, roomId, body, io, Game, next);
    });
}

exports.create = (socket, container, room, body, io, Game, next) => {
    const { player, id } = JSON.parse(body);

    socket.join(room, err => {
        if(err) console.log(err);
        else {
            if(container[room]) {
                container[room].status = 'full';
                container[room].game = new Game(player, id, io, room);
                
                next(room, container[room].game.player);
            }
            else {
                container[room] = {
                    status: 'open',
                    game: null
                };
            };
        }
    });
}

exports.move = (socket, container) => {
    socket.on('move', body => {
        const {boxIndex, rowIndex, roomId} = JSON.parse(body);
    
        container[roomId].game.select(rowIndex, boxIndex);
    });
}

exports.message = (socket, io) => {
    socket.on('message', body => {
        const { room, message, id } = JSON.parse(body);

        io.to(room).emit('message', { message, id });
    })
}

exports.sendId = (socket, io, uuid) => {
    socket.on('id', () => {
        io.emit('id', {id: uuid.v1().substr(0, 4) + Date.now() + new Date().getSeconds()});
    });
}