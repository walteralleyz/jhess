class Moves {
    bishopBlocked = (rowIndex, colIndex, selected, matrix) => {
        let i = +selected.row;
        let c = +selected.col;
        let notBlocked = true;

        while (i !== +rowIndex) {
            if (i !== +selected.row && c !== +selected.col && matrix[i][c]) {
                notBlocked = false;
                break;
            }

            c = c > colIndex ? c - 1 : c + 1;
            i = i > rowIndex ? i - 1 : i + 1;
        }

        return notBlocked;
    };

    rookBlocked = (rowIndex, colIndex, selected, matrix) => {
        let i = +selected.row;
        let c = +selected.col;
        let notBlocked = true;

        while (i !== +rowIndex) {
            if (i != selected.row && matrix[i][c]) {
                notBlocked = false;
                break;
            }

            i = i > rowIndex ? i - 1 : i + 1;
        }

        while (c !== +colIndex) {
            if (c != selected.col && matrix[i][c]) {
                notBlocked = false;
                break;
            }

            c = c > colIndex ? c - 1 : c + 1;
        }

        return notBlocked;
    };

    pawnBlocked(rowIndex, colIndex, matrix) {
        return matrix[rowIndex][colIndex] === 0;
    }
    
    moveRules = (piece, bIndex, rIndex, action, selected, matrix) =>
        ({
            pawn: () => {
                const increment = selected.color === "y" ? 1 : -1;
                const doubleIncrement = selected.color === "y" ? 2 : -2;
                const boxIncrement = Math.abs(bIndex - selected.col);

                if (action === "move") {
                    if (boxIncrement !== 0) return false;
                    if ((selected.color === 'y' && +selected.row === 1) && +rIndex === +selected.row + doubleIncrement)
                        return true && this.pawnBlocked(rIndex, bIndex, matrix);

                    if ((selected.color === 'r' && +selected.row === 6) && +rIndex === +selected.row + doubleIncrement) 
                        return true && this.pawnBlocked(rIndex, bIndex, matrix);
                    if (+rIndex !== +selected.row + increment) return false;

                    return true && this.pawnBlocked(rIndex, bIndex, matrix);
                } else {
                    if (+rIndex !== +selected.row + increment) return false;
                    if (boxIncrement !== 1) return false;

                    return true;
                }
            },

            rook: () => {
                const rowIncrement = Math.abs(rIndex - selected.row);
                const boxIncrement = Math.abs(bIndex - selected.col);

                if (action === "move" || action === "kill") {
                    if (rowIncrement === 0 && boxIncrement > 0)
                        return (
                            true &&
                            this.rookBlocked(rIndex, bIndex, selected, matrix)
                        );
                    if (rowIncrement > 0 && boxIncrement === 0)
                        return (
                            true &&
                            this.rookBlocked(rIndex, bIndex, selected, matrix)
                        );

                    return false;
                }
            },

            bishop: () => {
                if (action === "move" || action === "kill") {
                    const rowIncrement = Math.abs(rIndex - selected.row);
                    const boxIncrement = Math.abs(bIndex - selected.col);

                    if (boxIncrement === rowIncrement)
                        return (
                            true &&
                            this.bishopBlocked(rIndex, bIndex, selected, matrix)
                        );

                    return false;
                }
            },

            king: () => {
                const rowIncrement = Math.abs(rIndex - selected.row);
                const boxIncrement = Math.abs(bIndex - selected.col);

                if (action === "move" || action === "kill") {
                    if (rowIncrement === 0 && boxIncrement === 1) return true;
                    if (rowIncrement === 1 && boxIncrement === 0) return true;
                    if (rowIncrement === 1 && boxIncrement === 1) return true;

                    return false;
                }
            },

            knight: () => {
                if (action === "move" || action === "kill") {
                    const incrementRow = Math.abs(rIndex - selected.row);
                    const incrementBlock = Math.abs(bIndex - selected.col);

                    if (incrementRow === 1 && incrementBlock === 2) return true;
                    if (incrementRow === 2 && incrementBlock === 1) return true;

                    return false;
                }
            },

            queen: () => {
                const rowIncrement = Math.abs(rIndex - selected.row);
                const boxIncrement = Math.abs(bIndex - selected.col);

                if (action === "move" || action === "kill") {
                    if (rowIncrement === 0 && boxIncrement > 0)
                        return (
                            true &&
                            this.rookBlocked(rIndex, bIndex, selected, matrix)
                        );
                    if (rowIncrement > 0 && boxIncrement === 0)
                        return (
                            true &&
                            this.rookBlocked(rIndex, bIndex, selected, matrix)
                        );
                    if (boxIncrement === rowIncrement)
                        return (
                            true &&
                            this.bishopBlocked(rIndex, bIndex, selected, matrix)
                        );

                    return false;
                }
            },
        }[piece || false]);
}

module.exports = Moves;