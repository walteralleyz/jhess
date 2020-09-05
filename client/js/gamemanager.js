import {BlockManager} from './blockmanager.js';

export class GameManager extends BlockManager {
    constructor() {
        super();

        this.handleClick = this.select;
    }


    gameEnd = false;

    start() {
        this.setup();
        this.attachEvent();
    }

    update() {
        this.clearTable();
        this.showMessage();
        this.mountChessTable();

        this.attachEvent();
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

                } else if(this.selected.piece) {
                    const piece = child.split('-')[1];

                    if(this.moves.moveRules(piece, block.getAttribute('index'), row.getAttribute('index'), 'kill', this.selected)()) {
                        this.kill(row, block, child);
                        this.changePlayer();
                        this.isKing(child);

                        return false;
                    }
                }

                return false;
            } else if(this.selected.piece) {
                if(this.moves.moveRules(this.selected.piece, block.getAttribute('index'), row.getAttribute('index'), 'move', this.selected)()) {
                    this.move(row, block);
                    this.changePlayer();

                    return false;
                }
            }

            alert('Cant move this way!');
        }
    }

    attachEvent() {
        const tableChess = document.querySelector(".table-chess");
        const iterable = [...tableChess.childNodes];

        for (let i = 0; i < iterable.length; i++) {
            const rowIterable = [...iterable[i].childNodes];
            
            for(let block of rowIterable) block.onclick = e => this.select(e);
        }
    }
}