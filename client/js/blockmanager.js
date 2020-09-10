import {Game} from './game.js';

export class BlockManager extends Game {
    constructor() {
        super();
    }

    updateKillZone() {
        const yKillZone = document.querySelector("#kill-zone-y .pieces");
        const rKillZone = document.querySelector("#kill-zone-r .pieces");

        this.clearKillZone();

        const createSpan = (p) => {
            const span = document.createElement("span");
            const piece = p.split('-')[1];
            span.classList.add("mdi", "mdi-chess-" + piece);

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

    clearBlock(row, block) {
        this.matrix[this.selected.row][this.selected.col] = 0;
        this.matrix[row][block] =
            this.selected.color + "-" + this.selected.piece;
    }

    kill(row, block, target) {
        this.killZone[this.player] = [...this.killZone[this.player], target];

        this.clearBlock(row, block);
        this.updateKillZone();
    }

    move(row, block) {
        this.clearBlock(row, block);
    }

    isFilled(row, block) {
        return this.matrix[row][
            block
        ];
    }
}