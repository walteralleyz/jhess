export class Moves {
    moveRules = (piece, bIndex, rIndex, action, selected) => ({
        "pawn": () => {
            const increment = selected.color === 'y' ? 1 : -1;

            if(action === 'move') {
                if(+rIndex !== (+selected.row + increment)) return false;
                if(+bIndex !== (+selected.col)) return false;

                return true;
            } else {
                if(+rIndex !== (+selected.row + increment)) return false;
                if(+bIndex !== (+selected.col + 1) && +bIndex !== (+selected.col - 1)) return false;

                return true;
            }
        },

        "rook": () => {
            if(action === "move" || action === "kill") {
                if(rIndex > selected.row && bIndex > selected.col 
                || rIndex > selected.row && bIndex < selected.col
                || rIndex < selected.row && bIndex > selected.col
                || rIndex < selected.row && bIndex < selected.col) return false;

                return true;
            }
        },

        "bishop": () => {
            if(action === "move" || action === "kill") {
                const increment = Math.abs(rIndex - selected.row);

                if(+bIndex !== selected.col - increment && +bIndex !== +selected.col + increment) return false;

                return true;
            }
        },

        "king": () => {
            if(action === "move" || action === "kill") {
                if(+rIndex !== +selected.row + 1 && +rIndex !== selected.row - 1 && rIndex !== selected.row) return false;
                if(+bIndex !== +selected.col + 1 && +bIndex !== selected.col - 1 && bIndex !== selected.col) return false;

                return true;
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

        "queen": () => true
    }[piece || false]);
}