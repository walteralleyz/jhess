const BlockManager = require('./blockmanager');

class GameManager extends BlockManager {
    constructor(player, id, socket, roomId) {
        super();

        this.localPlayer = player;
        this.id = id;
        this.transport = socket;
        this.room = roomId;
    }

    update() {
        if(this.isKing()) this.emit('error', JSON.stringify({ error: 'Fim do jogo' }));
        else this.emit('update', JSON.stringify({ matrix: this.matrix, killZone: this.killZone }));
    }

    emit(type, message) {
        this.transport.to(this.room).emit(type, message);
    }

    isCheck() {
        return this.moves.isCheck(this.matrix, this.player);
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
        if(this.localPlayer === this.player) {
            const child = this.isFilled(row, block);

            if (child) {
                const [color, chess] = child.split("-");

                if (color === this.player) {
                    this.selected.color = color;
                    this.selected.piece = chess;
                    this.selected.col = bIndex
                    this.selected.row = rIndex;
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

            this.emit('error', JSON.stringify({ error: 'Não pode mover!' }));
        }
    }
}

module.exports = GameManager;