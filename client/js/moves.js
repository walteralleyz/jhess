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
    }[piece || false]);
}