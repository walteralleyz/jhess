export class Moves {
    isCheck(matrix, player) {
        const kingIndex = this.findKing(matrix, player);
        const check = this.isKingSecure(matrix, player, kingIndex);

        this.saveCheckStatus(check);
    }

    saveCheckStatus(obj) {
        localStorage.setItem("check", JSON.stringify(obj));
    }

    getCheckStatus() {
        const check = JSON.parse(localStorage.getItem("check"));

        return check || false;
    }

    isKingSecure(matrix, player, king) {
        const enemy = player === "y" ? "r" : "y";

        let enemyCoordinates = {
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            topLeft: "0",
            topRight: "0",
            bottomLeft: "0",
            bottomRight: "0",
        };

        if(matrix[+king[0] - 1]) {
            if(matrix[+king[0] - 1][+king[1] - 1] !== 0 && matrix[+king[0] - 1][+king[1] - 1].startsWith(player)) enemyCoordinates.bottomLeft = 'secured';
            if(matrix[+king[0] - 1][+king[1] + 1] !== 0 && matrix[+king[0] - 1][+king[1] + 1].startsWith(player)) enemyCoordinates.bottomRight = 'secured';
            if ((matrix[+king[0] - 1][king[1]] !== 0 && matrix[+king[0] - 1][king[1]].startsWith(player)) || matrix[+king[0] - 1][king[1]] === undefined) enemyCoordinates.bottom = "secured";
        }

        if(matrix[+king[0] + 1]) {
            if(matrix[+king[0] + 1][+king[1] - 1] !== 0 && matrix[+king[0] + 1][+king[1] - 1].startsWith(player)) enemyCoordinates.topLeft = 'secured';
            if(matrix[+king[0] + 1][+king[1] + 1] !== 0 && matrix[+king[0] + 1][+king[1] + 1].startsWith(player)) enemyCoordinates.topRight = 'secured';
            if ((matrix[+king[0] + 1][king[1]] !== 0 && matrix[+king[0] + 1][king[1]].startsWith(player)) || matrix[+king[0] + 1][king[1]] === undefined) enemyCoordinates.top = "secured";
        }

        if (
            matrix[+king[0]][+king[1] - 1] !== 0 &&
            matrix[+king[0]][+king[1] - 1].startsWith(player)
        )
            enemyCoordinates.left = "secured";
        if (
            matrix[+king[0]][+king[1] + 1] !== 0 &&
            matrix[+king[0]][+king[1] + 1].startsWith(player)
        )
            enemyCoordinates.right = "secured";

        for (let i = +king[0]; i <= 7; i++) {
            for (let j = 0; j <= 7; j++) {
                const row = Math.abs(i - king[0]);
                const col = Math.abs(j - king[1]);

                if (row > 0 && col === 0) {
                    if (enemyCoordinates.top === "secured") continue;
                    else if(matrix[i][j] !== 0 && matrix[i][j] === `${enemy}-rook` || matrix[i][j] === `${enemy}-queen`) enemyCoordinates.top = [i, j];
                }

                if (row === 0 && col > 0) {
                    if (
                        enemyCoordinates.left === "secured" &&
                        enemyCoordinates.right === "secured"
                    )
                        continue;

                    if (j < +king[1]) {
                        if (enemyCoordinates.left === "secured") continue;
                        else if (
                            matrix[i][j] !== 0 &&
                            (matrix[i][j] === `${enemy}-rook` ||
                                matrix[i][j] === `${enemy}-queen`)
                        )
                            enemyCoordinates.left = [i, j];
                    } else {
                        if (enemyCoordinates.right === "secured") continue;
                        else if (
                            matrix[i][j] !== 0 &&
                            (matrix[i][j] === `${enemy}-rook` ||
                                matrix[i][j] === `${enemy}-queen`)
                        )
                            enemyCoordinates.right = [i, j];
                    }
                }

                if (row === col) {
                    if(enemyCoordinates.topLeft === 'secured' && enemyCoordinates.topRight === 'secured') continue;

                    if(j < +king[1]) {
                        if(enemyCoordinates.topLeft === 'secured') continue;
                        else if(matrix[i][j] !== 0 && (matrix[i][j] === `${enemy}-bishop` || matrix[i][j] === `${enemy}-queen`)) enemyCoordinates.topLeft = [i, j];
                    }

                    else {
                        if(enemyCoordinates.topRight === 'secured') continue;
                        else if(matrix[i][j] !== 0 && (matrix[i][j] === `${enemy}-bishop` || matrix[i][j] === `${enemy}-queen`)) enemyCoordinates.topRight = [i, j];
                    }
                }
            }
        }

        for (let i = +king[0]; i >= 0; i--) {
            for (let j = 0; j <= 7; j++) {
                const row = Math.abs(i - king[0]);
                const col = Math.abs(j - king[1]);

                if (row > 0 && col === 0) {
                    if (enemyCoordinates.bottom === "secured") continue;
                    else if(matrix[i][j] !== 0 && matrix[i][j] === `${enemy}-rook` || matrix[i][j] === `${enemy}-queen`) enemyCoordinates.top = [i, j];                    
                }

                if (row === 0 && col > 0) {
                    if (
                        enemyCoordinates.left === "secured" &&
                        enemyCoordinates.right === "secured"
                    )
                        continue;

                    if (j < +king[1]) {
                        if (enemyCoordinates.left === "secured") continue;
                        else if (
                            matrix[i][j] !== 0 &&
                            (matrix[i][j] === `${enemy}-rook` ||
                                matrix[i][j] === `${enemy}-queen`)
                        )
                            enemyCoordinates.left = [i, j];
                    } else {
                        if (enemyCoordinates.right === "secured") continue;
                        else if (
                            matrix[i][j] !== 0 &&
                            (matrix[i][j] === `${enemy}-rook` ||
                                matrix[i][j] === `${enemy}-queen`)
                        )
                            enemyCoordinates.right = [i, j];
                    }
                }

                if (row === col) {
                    if(enemyCoordinates.bottomLeft === 'secured' && enemyCoordinates.bottomRight === 'secured') continue;

                    if(j < +king[1]) {
                        if(enemyCoordinates.bottomLeft === 'secured') continue;
                        else if(matrix[i][j] !== 0 && (matrix[i][j] === `${enemy}-bishop` || matrix[i][j] === `${enemy}-queen`)) enemyCoordinates.bottomLeft = [i, j];
                    }

                    else {
                        if(enemyCoordinates.bottomRight === 'secured') continue;
                        else if(matrix[i][j] !== 0 && (matrix[i][j] === `${enemy}-bishop` || matrix[i][j] === `${enemy}-queen`)) enemyCoordinates.bottomRight = [i, j];
                    }
                }
            }
        }

        return enemyCoordinates;
    }

    findKing(matrix, player) {
        for (let row in matrix) {
            const colIndex = matrix[row].indexOf(`${player}-king`);

            if (colIndex !== -1) return [row, colIndex];
        }
    }
}
