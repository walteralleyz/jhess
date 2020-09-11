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

exports.bot = (socket, container, Game, io, next) => {
    socket.on('bot', body => {
        const { player, id } = JSON.parse(body);
        const room = `${player}-${id}`;

        socket.join(room, err => {
            if(err) console.log(err);
            else {
                container[room] = {
                    status: 'full',
                    game: new Game(player, id, io, room)
                };

                next(room, container[room].game.player);
            }
        })
    });
};

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
            }
        }

        this.quit(socket, io);
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

exports.off = (socket, io, next) => {
    socket.on('disconnect', () => {
        io.emit('clients', { len: next(-1) });
    });
}

exports.quit = (socket, io) => {
    socket.on('disconnecting', () => {
        const room = Object.keys(socket.rooms)[1];
        
        io.to(room).emit('off', { status: 'off' });
    });
}