import { BlockManager } from "./blockmanager.js";

export class GameManager extends BlockManager {
    constructor(player, socket, id) {
        super();

        this.handleClick = this.select;
        this.localPlayer = player;
        this.id = id;
        this.transport = socket;
    }

    localPlayer;
    id;
    transport;

    start() {
        this.setup();
        this.attachEvent();
        this.resetLocalStorage();
    }

    update(body) {
        if(body.type === 'error') {
            if(this.localPlayer === this.player) return alert(body.message);
            return false;
        }
        else if(body.type === 'end') {
            const { matrix, killZone } = body.message;

            this.matrix = matrix;
            this.killZone = killZone;
            
            this.clearTable();
            this.notHighLight();
            this.mountChessTable();
            this.showMessage(`Game is end!`);
            this.removeEvent();
        } else {
            const { matrix, killZone } = body.message;

            this.matrix = matrix;
            this.killZone = killZone;

            this.changePlayer();
            this.clearTable();
            this.notHighLight();
            this.showMessage();
            this.mountChessTable();
            this.isCheck();
        }
    }

    setPlayer(player) {
        this.player = player;
    }

    resetLocalStorage() {
        localStorage.removeItem('check');
        localStorage.removeItem('selected');
        localStorage.removeItem('checked');
    }

    isCheck() {
        this.moves.isCheck(this.matrix, this.player);
        const check = this.moves.getCheckStatus();
        const checkKeys = Object.keys(check);

        for(let keys of checkKeys) {
            if(check[keys] !== '0' && check[keys] !== 'secured') {
                let piece = this.matrix[check[keys][0]][check[keys][1]].split('-')[1];

                document.getElementById(`${piece}${check[keys][0]}${check[keys][1]}`).classList.add('highlight-danger');
            }
        }
    }

    changePlayer() {
        this.player = this.player === "y" ? "r" : "y";
        this.selected = {
            color: "",
            piece: "",
            row: 0,
            col: 0,
        };
    }

    select(e) {
        if(this.localPlayer === this.player) {
            const block = e.currentTarget.getAttribute('index');
            const row = e.currentTarget.parentNode.getAttribute('index');
            const child = this.isFilled(row, block);

            this.transport.emit('move', JSON.stringify({ boxIndex: block, rowIndex: row, roomId: localStorage.getItem('room') }));

            if (child) {
                const [color, chess] = child.split("-");

                if (color === this.player) this.highLight(chess, row, block);
            }
        }
    }

    getSelected() {
        return localStorage.getItem("selected");
    }

    saveSelected(id) {
        localStorage.setItem('selected', id);
    }

    highLight(piece, row, col, className) {
        const toSelect = document.getElementById(`${piece}${row}${col}`);

        this.notHighLight();

        toSelect.classList.add(className || 'highlight');
        this.saveSelected(`${piece}${row}${col}`);
    }

    highLightDanger(piece, row, col) {
        const toSelect = document.getElementById(`${piece}${row}${col}`);
        toSelect.classList.add('highlight-danger');
    }

    notHighLight() {
        const id = this.getSelected();
        if(id) document.getElementById(id).classList.remove('highlight');
    }

    attachEvent() {
        const tableChess = document.querySelector(".table-chess");
        const iterable = [...tableChess.childNodes];

        for (let i = 0; i < iterable.length; i++) {
            const rowIterable = [...iterable[i].childNodes];

            for (let block of rowIterable)
                block.onclick = (e) => this.select(e);
        }
    }

    removeEvent() {
        const tableChess = document.querySelector(".table-chess");
        const iterable = [...tableChess.childNodes];

        for (let i = 0; i < iterable.length; i++) {
            const rowIterable = [...iterable[i].childNodes];

            for (let block of rowIterable)
                block.onclick = () => null;
        }
    }
}
