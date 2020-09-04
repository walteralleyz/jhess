window.onload = () => {
    const game = new Game();
    game.setup();
};

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
        Array.from(this.pieces, (piece) => "w-" + piece),
        Array(8).fill("w-pawn"),
        Array(8).fill(0),
        Array(8).fill(0),
        Array(8).fill(0),
        Array(8).fill(0),
        Array(8).fill("b-pawn"),
        Array.from(this.pieces, (piece) => "b-" + piece),
    ];

    player = "w";
    selected = {
        color: "",
        piece: "",
        row: 0,
        col: 0,
    };

    setup() {
        this.showMessage();
        this.buildChessTable();
        this.mountChessTable();
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

    showMessage() {
        const messageBox = document.querySelector('span');

        messageBox.textContent = `Player ${this.player.toUpperCase()} now!`;
    }

    select(e) {
        const block = e.currentTarget;
        const row = block.parentNode;
        const piece = block.childNodes[0] || undefined;

        if (piece) {
            const [color, vendor, chess] = piece.classList.value.split(" ");

            if (color == this.player) {
                this.selected.color = color;
                this.selected.piece = chess.split("-")[2];
                this.selected.col = block.getAttribute("index");
                this.selected.row = row.getAttribute("index");
            }
        } else {
            this.drop(e);
        }
    }

    drop(e) {
        const block = e.currentTarget;
        const row = block.parentNode;

        const child = block.childNodes[0] || undefined;

        if (
            (this.selected.piece && !block.childElementCount) ||
            (child && child.classList.value.indexOf(this.player) === -1)
        ) {
            this.matrix[this.selected.row][this.selected.col] = 0;
            this.matrix[row.getAttribute("index")][
                block.getAttribute("index")
            ] = this.selected.color + "-" + this.selected.piece;

            this.changePlayer();
        }
    }

    changePlayer() {
        this.player = this.player == "w" ? "b" : "w";
        this.selected = {
            color: "",
            piece: "",
            row: 0,
            col: 0,
        };

        this.clearTable();
        this.showMessage();
        this.mountChessTable();
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

    mountChessTable() {
        const tableChess = document.querySelector(".table-chess");
        const iterable = [...tableChess.childNodes];

        for (let i = 0; i < iterable.length; i++) {
            const rowIterable = [...iterable[i].childNodes];

            for (let j = 0; j < rowIterable.length; j++) {
                rowIterable[j].onclick = (e) => this.select(e);

                if (this.matrix[i][j]) {
                    const [color, icon] = this.matrix[i][j].split("-");
                    const span = document.createElement("span");

                    span.classList.add(color, "mdi", "mdi-chess-" + icon);

                    rowIterable[j].appendChild(span);
                }
            }
        }
    }
}
