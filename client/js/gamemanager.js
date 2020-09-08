import { BlockManager } from "./blockmanager.js";

export class GameManager extends BlockManager {
    constructor() {
        super();

        this.handleClick = this.select;
    }

    gameEnd = false;

    start() {
        this.setup();
        this.attachEvent();
        this.resetLocalStorage();
    }

    update() {
        this.clearTable();
        this.notHighLight();
        this.showMessage();
        this.mountChessTable();
        this.isCheck();

        this.attachEvent();
    }

    resetLocalStorage() {
        localStorage.removeItem('check');
        localStorage.removeItem('selected');
        localStorage.removeItem('checked');
    }

    isCheck() {
        this.moves.isCheck(this.matrix, this.player);
        const check = this.moves.getCheckStatus();

        if(check) {
            for(let array of check.checkArray) {
                const piece = this.matrix[array[0]][array[1]].split('-')[1];

                this.highLightDanger(piece, array[0], array[1]);
            }
        } else {
            for(let row of document.getElementsByClassName("table-chess")[0].childNodes) {
                for(let box of row.childNodes) {
                    box.classList.remove("highlight-danger");
                }
            }
        }
    }

    isKing(piece) {
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

        this.update();
    }

    canMove(piece, move, block, row, selected, matrix) {
        return this.moves.moveRules(
            piece,
            block.getAttribute("index"),
            row.getAttribute("index"),
            move,
            selected,
            matrix
        )();
    }

    select(e) {
        if (!this.gameEnd) {
            const block = e.currentTarget;
            const row = block.parentNode;
            const child = this.isFilled(row, block);

            if (child) {
                const [color, chess] = child.split("-");

                if (color === this.player) {
                    this.selected.color = color;
                    this.selected.piece = chess;
                    this.selected.col = block.getAttribute("index");
                    this.selected.row = row.getAttribute("index");

                    this.highLight(this.selected.piece, this.selected.row, this.selected.col);
                } else if (this.selected.piece) {
                    if (
                        this.canMove(
                            this.selected.piece,
                            "kill",
                            block,
                            row,
                            this.selected,
                            this.matrix
                        )
                    ) {
                        this.kill(row, block, child);
                        this.changePlayer();
                        this.isKing(child);

                        return false;
                    }
                }

                return false;
            } else if (this.selected.piece) {
                if (
                    this.canMove(
                        this.selected.piece,
                        "move",
                        block,
                        row,
                        this.selected,
                        this.matrix
                    )
                ) {
                    this.move(row, block);
                    this.changePlayer();

                    return false;
                }
            }

            alert("Cant move this way!");
        }
    }

    getSelected() {
        return localStorage.getItem("selected");
    }

    saveSelected(id) {
        localStorage.setItem('selected', id);
    }

    highLight(piece, row, col, className) {
        const toSelect = document.getElementById(`${piece}${row}${col}`);

        this.notHighLight();

        toSelect.classList.add(className || 'highlight');
        this.saveSelected(`${piece}${row}${col}`);
    }

    highLightDanger(piece, row, col) {
        const toSelect = document.getElementById(`${piece}${row}${col}`);
        toSelect.classList.add('highlight-danger');
    }

    notHighLight() {
        const id = this.getSelected();
        if(id) document.getElementById(id).classList.remove('highlight');
    }

    attachEvent() {
        const tableChess = document.querySelector(".table-chess");
        const iterable = [...tableChess.childNodes];

        for (let i = 0; i < iterable.length; i++) {
            const rowIterable = [...iterable[i].childNodes];

            for (let block of rowIterable)
                block.onclick = (e) => this.select(e);
        }
    }
}
