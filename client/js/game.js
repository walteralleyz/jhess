import {Moves} from './moves.js';

export class Game {
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

    setup() {
        this.showMessage();
        this.buildChessTable();
        this.mountChessTable();
    }

    showMessage(message) {
        const messageBox = document.querySelector("span");

        if (message) {
            messageBox.textContent = message;
            messageBox.style.backgroundColor = "gray";
        } else {
            messageBox.textContent = `Player ${this.player.toUpperCase()} now!`;
            messageBox.style.backgroundColor =
                this.player === "y" ? "gold" : "red";
        }
    }

    clearTable() {
        const tableChess = document.querySelector(".table-chess");
        const iterable = [...tableChess.childNodes];

        for (let i = 0; i < iterable.length; i++) {
            const rowIterable = [...iterable[i].childNodes];

            for (let j = 0; j < rowIterable.length; j++) {
                rowIterable[j].innerHTML = "";
            }
        }
    }

    buildChessTable() {
        const tableChess = document.querySelector(".table-chess");

        for (let i = 0; i < 8; i++) {
            const row = document.createElement("div");
            row.classList.add("row");
            row.setAttribute("index", i);

            for (let j = 0; j < 8; j++) {
                const block = document.createElement("div");
                block.classList.add("block");
                block.setAttribute("index", j);

                row.appendChild(block);
            }

            tableChess.appendChild(row);
        }
    }

    mountChessTable() {
        const tableChess = document.querySelector(".table-chess");
        const iterable = [...tableChess.childNodes];

        for (let i = 0; i < iterable.length; i++) {
            const rowIterable = [...iterable[i].childNodes];

            for (let j = 0; j < rowIterable.length; j++) {
                if (this.matrix[i][j]) {
                    const [color, icon] = this.matrix[i][j].split("-");
                    const span = document.createElement("span");

                    span.classList.add(color, "mdi", "mdi-chess-" + icon);

                    rowIterable[j].appendChild(span);
                    rowIterable[j].id = `${icon}${i}${j}`;
                }
            }
        }
    }
}