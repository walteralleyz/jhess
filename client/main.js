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

    moveRules = chess =>
        ({
            "pawn": () => {
                const bIndex = +chess.target.getAttribute('index');
                const rIndex = +chess.target.parentNode.getAttribute('index');
                const increment = this.selected.color === 'y' ? 1 : -1;

                if(chess.action === 'move') {
                    if(rIndex !== (+this.selected.row + increment)) return false;
                    if(bIndex !== (+this.selected.col)) return false;

                    return true;
                } else {
                    if(rIndex !== (+this.selected.row + increment)) return false;
                    if(bIndex !== (+this.selected.col + 1) && bIndex !== (+this.selected.col - 1)) return false;

                    return true;
                }
            },
        }[chess.piece || false]);

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

    select(e) {
        if (!this.gameEnd) {
            const block = e.currentTarget;
            const row = block.parentNode;
            const piece = this.matrix[row.getAttribute("index")][
                block.getAttribute("index")
            ];

            let canMove = action => {
                return this.moveRules({
                    piece: this.selected.piece,
                    target: block,
                    action
                })()
            };

            if (piece) {
                const [color, chess] = piece.split("-");

                if (color === this.player) {
                    this.selected.color = color;
                    this.selected.piece = chess;
                    this.selected.col = block.getAttribute("index");
                    this.selected.row = row.getAttribute("index");

                } else if(color !== this.player && this.selected.piece) {
                    if(!canMove('kill')) alert("Cant move this way");
                    else return this.drop(e);
                }

                return false;
            } else if(this.selected.piece) {
                if(canMove('move')) return this.drop(e);
                alert("Cant move this way!");
            }
        }
    }

    drop(e) {
        const block = e.currentTarget;
        const row = block.parentNode;

        const child = this.matrix[row.getAttribute("index")][
            block.getAttribute("index")
        ];

        if (this.selected.piece) {
            this.clearBlock(row, block);

            if (!block.childElementCount) {
                this.changePlayer();
            } else {
                if (child && child.indexOf(this.player) === -1) {
                    const piece = child.split("-")[1];

                    this.moveRules({
                        piece: this.selected.piece,
                        target: block,
                        action: 'kill'
                    })();

                    this.kill(piece);
                    this.changePlayer();
                    this.isItKing(piece);
                }
            }
        }
    }

    clearBlock(row, block) {
        this.matrix[this.selected.row][this.selected.col] = 0;
        this.matrix[row.getAttribute("index")][block.getAttribute("index")] =
            this.selected.color + "-" + this.selected.piece;
    }

    kill(piece) {
        this.killZone[this.player] = [...this.killZone[this.player], piece];
        this.updateKillZone();
    }

    updateKillZone() {
        const yKillZone = document.querySelector("#kill-zone-y .pieces");
        const rKillZone = document.querySelector("#kill-zone-r .pieces");

        this.clearKillZone();

        const createSpan = (p) => {
            const span = document.createElement("span");
            span.classList.add("mdi", "mdi-chess-" + p);

            return span;
        };

        for (let p of this.killZone.y) {
            yKillZone.appendChild(createSpan(p));
        }

        for (let p of this.killZone.r) {
            rKillZone.appendChild(createSpan(p));
        }
    }

    clearKillZone() {
        const yKillZone = document.querySelector("#kill-zone-y .pieces");
        const rKillZone = document.querySelector("#kill-zone-r .pieces");

        yKillZone.innerHTML = "";
        rKillZone.innerHTML = "";
    }

    isItKing(piece) {
        if (piece.indexOf("king") !== -1) {
            this.gameEnd = true;
            this.showMessage("Game is end!");
        }
    }

    changePlayer() {
        this.player = this.player == "y" ? "r" : "y";
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
