const BlockManager = require('./blockmanager');

class GameManager extends BlockManager {
    constructor(player, id, socket, roomId) {
        super();

        this.player = player;
        this.id = id;
        this.transport = socket;
        this.room = roomId;
    }

    update() {
        if(this.isKing()) this.transport.to(this.room).emit('update', JSON.stringify({ message: {matrix: this.matrix, killZone: this.killZone}, type: 'end' }));
        else this.transport.to(this.room).emit('update', JSON.stringify({ message: {matrix: this.matrix, killZone: this.killZone}, type: 'update' }));
    }

    isKing() {
        const enemy = this.player === 'y' ? 'r' : 'y';
        const king = this.killZone[enemy].indexOf(`${this.player}-king`) !== -1;

        return king;
    }

    changePlayer() {
        this.player = this.player == "y" ? "r" : "y";
        this.selected = {
            color: "",
            piece: "",
            row: 0,
            col: 0,
        };

        this.update();
    }

    canMove(piece, move, block, row, selected, matrix) {
        return this.moves.moveRules(
            piece,
            block,
            row,
            move,
            selected,
            matrix
        )();
    }

    select(rIndex, bIndex) {
        const child = this.isFilled(rIndex, bIndex);

        if (child) {
            const [color, chess] = child.split("-");

            if (color === this.player) {
                this.selected.color = color;
                this.selected.piece = chess;
                this.selected.col = bIndex
                this.selected.row = rIndex;

                return false;
            } else if (this.selected.piece) {
                if (
                    this.canMove(
                        this.selected.piece,
                        "kill",
                        bIndex,
                        rIndex,
                        this.selected,
                        this.matrix
                    )
                ) {
                    this.kill(rIndex, bIndex, child);
                    this.changePlayer();

                    return false;
                }
            }

            return false;
        } else if (this.selected.piece) {
            if (
                this.canMove(
                    this.selected.piece,
                    "move",
                    bIndex,
                    rIndex,
                    this.selected,
                    this.matrix
                )
            ) {
                this.move(rIndex, bIndex);
                this.changePlayer();

                return false;
            }
        }

        this.transport.to(this.room).emit('update', JSON.stringify({ message: 'Não pode mover!', type: 'error' }));
    }
}

module.exports = GameManager;