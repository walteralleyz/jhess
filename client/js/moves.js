export class Moves {
    moveRules = (piece, bIndex, rIndex, action, selected) => ({
        "pawn": () => {
            const increment = selected.color === 'y' ? 1 : -1;
            const boxIncrement = Math.abs(bIndex - selected.col);

            if(action === 'move') {
                if(+rIndex !== (+selected.row + increment)) return false;
                if(boxIncrement !== 0) return false;

                return true;
            } else {
                if(+rIndex !== (+selected.row + increment)) return false;
                if(boxIncrement !== 1) return false;

                return true;
            }
        },

        "rook": () => {
            const rowIncrement = Math.abs(rIndex - selected.row);
            const boxIncrement = Math.abs(bIndex - selected.col);


            if(action === "move" || action === "kill") {
                if(rowIncrement === 0 && boxIncrement > 0) return true;
                if(rowIncrement > 0 && boxIncrement === 0) return true;

                return false;
            }
        },

        "bishop": () => {
            if(action === "move" || action === "kill") {
                const rowIncrement = Math.abs(rIndex - selected.row);
                const boxIncrement = Math.abs(bIndex - selected.col);

                if(boxIncrement === rowIncrement) return true;

                return false;
            }
        },

        "king": () => {
            const rowIncrement = Math.abs(rIndex - selected.row);
            const boxIncrement = Math.abs(bIndex - selected.col);


            if(action === "move" || action === "kill") {
                if(rowIncrement === 0 && boxIncrement === 1) return true;
                if(rowIncrement === 1 && boxIncrement === 0) return true;

                return false;
            }
        },

        "knight": () => {
            if(action === "move" || action === "kill") {
                const incrementRow = Math.abs(rIndex - selected.row);
                const incrementBlock = Math.abs(bIndex - selected.col);

                if(incrementRow === 1 && incrementBlock === 2) return true;
                if(incrementRow === 2 && incrementBlock === 1) return true;

                return false;
            }
        },

        "queen": () => {
            const rowIncrement = Math.abs(rIndex - selected.row);
            const boxIncrement = Math.abs(bIndex - selected.col);


            if(action === "move" || action === "kill") {
                if(rowIncrement === 0 && boxIncrement > 0) return true;
                if(rowIncrement > 0 && boxIncrement === 0) return true;
                if(boxIncrement === rowIncrement) return true;

                return false;
            }
        }
    }[piece || false]);
}