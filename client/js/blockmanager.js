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

    isFilled(row, block) {
        return this.matrix[row][
            block
        ];
    }
}