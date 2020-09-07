export class Moves {
    bishopBlocked = (rowIndex, colIndex, selected, matrix) => {
        let i = +selected.row;
        let c = +selected.col;
        let notBlocked = true;

        while (i !== +rowIndex) {
            const decrement = Math.abs(i - selected.row);
            c = c > colIndex ? c - decrement : c + decrement;

            if (c != selected.col && matrix[i][c]) {
                notBlocked = false;
                break;
            }

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

    isCheck(matrix, player) {
        const kingIndex = this.findKing(matrix, player);
        this.isKingSecure(matrix, player, kingIndex);
    }

    isKingSurrounded(matrix, player, king) {
        const nextRow = +king[0] + 1 <= 7 ? +king[0] + 1 : undefined;
        const previousRow = king[0] - 1 >= 0 ? king[0] - 1 : undefined;
        const enemy = player === "y" ? "r" : "y";

        let insecure = [];

        if (nextRow) {
            if (
                (king[1] + 1 <= 7 && matrix[nextRow][king[1] + 1] === 0) ||
                matrix[nextRow][king[1] + 1].includes(enemy)
            )
                insecure.push([nextRow, king[1] + 1]);
            if (
                (king[1] - 1 >= 0 && matrix[nextRow][king[1] - 1] === 0) ||
                matrix[nextRow][king[1] - 1].includes(enemy)
            )
                insecure.push([nextRow, king[1] - 1]);
            if (
                matrix[nextRow][king[1]] === 0 ||
                matrix[nextRow][king[1]].includes(enemy)
            )
                insecure.push([nextRow, king[1]]);
        }

        if (previousRow) {
            if (
                (king[1] + 1 <= 7 && matrix[previousRow][king[1] + 1] === 0) ||
                matrix[previousRow][king[1] + 1].includes(enemy)
            )
                insecure.push([previousRow, king[1] + 1]);
            if (
                (king[1] - 1 >= 0 && matrix[previousRow][king[1] - 1] === 0) ||
                matrix[previousRow][king[1] - 1].includes(enemy)
            )
                insecure.push([previousRow, king[1] - 1]);
            if (
                matrix[previousRow][king[1]] === 0 ||
                matrix[previousRow][king[1]].includes(enemy)
            )
                insecure.push([previousRow, king[1]]);
        }

        if (
            (king[1] + 1 <= 7 && matrix[king[0]][king[1] + 1] === 0) ||
            matrix[king[0]][king[1] + 1].includes(enemy)
        )
            insecure.push([+king[0], king[1] + 1]);
        if (
            (king[1] - 1 >= 0 && matrix[king[0]][king[1] - 1] === 0) ||
            matrix[king[0]][king[1] - 1].includes(enemy)
        )
            insecure.push([+king[0], king[1] - 1]);

        return insecure;
    }

    isKingSecure(matrix, player, king) {
        const enemy = player === "y" ? "r" : "y";
        const secure = this.isKingSurrounded(matrix, player, king);

        let enemyCoordinates = [];

        for (let v of secure) {
            if (v[0] !== +king[0] && v[1] === +king[1]) {
                for (let i = v[0]; i <= 7; i++) {
                    if (matrix[i][v[1]]) {
                        if (matrix[i][v[1]].startsWith(player)) break;
                        else if (
                            matrix[i][v[1]] === `${enemy}-rook` ||
                            matrix[i][v[1]] === `${enemy}-queen`
                        ) {
                            enemyCoordinates.push([i, v[1]]);
                        }
                    }
                }

                for (let i = v[0]; i >= 0; i--) {
                    if (matrix[i][v[1]]) {
                        if (matrix[i][v[1]].startsWith(player)) break;
                        else if (
                            matrix[i][v[1]] === `${enemy}-rook` ||
                            matrix[i][v[1]] === `${enemy}-queen`
                        ) {
                            enemyCoordinates.push([i, v[1]]);
                        }
                    }
                }
            }

            if (v[0] === +king[0] && v[1] !== +king[1]) {
                for (let i = v[1]; i >= 0; i--) {
                    if (matrix[v[0]][i]) {
                        if (matrix[v[0]][i].startsWith(player)) break;
                        else if (
                            matrix[v[0]][i] === `${enemy}-rook` ||
                            matrix[i][v[1]] === `${enemy}-queen`
                        ) {
                            enemyCoordinates.push([v[0], i]);
                        }
                    }
                }

                for (let i = v[1]; i <= 7; i++) {
                    if (matrix[v[0]][i]) {
                        if (matrix[v[0]][i].startsWith(player)) break;
                        else if (
                            matrix[v[0]][i] === `${enemy}-rook` ||
                            matrix[i][v[1]] === `${enemy}-queen`
                        ) {
                            enemyCoordinates.push([v[0], i]);
                        }
                    }
                }
            }

            if (v[0] !== +king[0] && v[1] !== +king[1]) {
                let col = v[1];

                if (v[0] > king[0]) {
                    for (let i = v[0]; i <= 7; i++) {
                        if (col > king[1]) {
                            if (i === v[0]) col = v[1];
                            if (col > 7) break;
                            if (
                            matrix[i][col] 
                            && (matrix[i][col] === `${enemy}-queen`
                            || matrix[i][col] === `${enemy}-bishop`)
                            )
                                enemyCoordinates.push([i, col]);
                            col += 1;
                        } else {
                            if (i === v[0]) col = v[1];
                            if (col < 0) break;
                            if (
                            matrix[i][col] 
                            && (matrix[i][col] === `${enemy}-queen` ||
                                matrix[i][col] === `${enemy}-bishop`)
                            )
                                enemyCoordinates.push([i, col]);
                            col -= 1;
                        }
                    }
                }

                if (v[0] < king[0]) {
                    for (let i = v[0]; i >= 0; i--) {
                        if (col > king[1]) {
                            if (i === v[0]) col = v[1];
                            if (col > 7) break;
                            if (
                                (matrix[i][col] &&
                                    matrix[i][col] === `${enemy}-queen`) ||
                                matrix[i][col] === `${enemy}-bishop`
                            )
                                enemyCoordinates.push([i, col]);
                            col += 1;
                        } else {
                            if (i === v[0]) col = v[1];
                            if (col < v[0]) break;
                            if (
                                (matrix[i][col] &&
                                    matrix[i][col] === `${enemy}-queen`) ||
                                matrix[i][col] === `${enemy}-bishop`
                            )
                                enemyCoordinates.push([i, col]);
                            col -= 1;
                        }
                    }
                }
            }
        }

        console.log(enemyCoordinates);

        return enemyCoordinates;
    }

    findKing(matrix, player) {
        for (let row in matrix) {
            const colIndex = matrix[row].indexOf(`${player}-king`);

            if (colIndex !== -1) return [row, colIndex];
        }
    }

    moveRules = (piece, bIndex, rIndex, action, selected, matrix) =>
        ({
            pawn: () => {
                const increment = selected.color === "y" ? 1 : -1;
                const boxIncrement = Math.abs(bIndex - selected.col);

                if (action === "move") {
                    if (+rIndex !== +selected.row + increment) return false;
                    if (boxIncrement !== 0) return false;

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
