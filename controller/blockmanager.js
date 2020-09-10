const Game = require('./game');

class BlockManager extends Game {
    constructor() {
        super();
    }

    clearBlock(row, block) {
        this.matrix[this.selected.row][this.selected.col] = 0;
        this.matrix[row][block] =
            this.selected.color + "-" + this.selected.piece;
    }

    kill(row, block, target) {
        this.killZone[this.player] = [...this.killZone[this.player], target];

        this.clearBlock(row, block);
    }

    move(row, block) {
        this.clearBlock(row, block);
    }

    isFilled(row, block) {
        return this.matrix[row][block];
    }
}

module.exports = BlockManager;