const Moves = require('./moves');

class Game {
    pieces = [
        "rook",
        "knight",
        "bishop",
        "king",
        "queen",
        "bishop",
        "knight",
        "rook",
    ];
    matrix = [
        Array.from(this.pieces, (piece) => "y-" + piece),
        Array(8).fill("y-pawn"),
        Array(8).fill(0),
        Array(8).fill(0),
        Array(8).fill(0),
        Array(8).fill(0),
        Array(8).fill("r-pawn"),
        Array.from(this.pieces, (piece) => "r-" + piece),
    ];

    player = "y";
    selected = {
        color: this.player,
        piece: "",
        row: 0,
        col: 0,
    };

    killZone = {
        y: [],
        r: [],
    };

    moves = new Moves();
}

module.exports = Game;