import { BlockManager } from "./blockmanager.js";

export class GameManager extends BlockManager {
    constructor(player, socket, id, bot) {
        super();

        this.handleClick = this.select;
        this.localPlayer = player;
        this.id = id;
        this.transport = socket;
        this.bot = bot;
    }

    localPlayer;
    id;
    transport;
    bot = false;
    botSelected = false;

    start() {
        this.setup();
        this.attachEvent();
        this.resetLocalStorage();
    }

    rebuild() {
        this.clearTable();
        this.notHighLight();
        this.mountChessTable();
        this.updateKillZone();
    }

    update(body) {
        if(body.type === 'error') {
            if(this.localPlayer === this.player) return alert(body.message);
            if(this.localPlayer !== this.player && this.bot) this.selectBot();
        }
        else if(body.type === 'end') {
            const { matrix, killZone } = body.message;

            this.matrix = matrix;
            this.killZone = killZone;
            
            this.showMessage(`Game is end!`);
            this.rebuild();
            this.removeEvent();
        } else {
            const { matrix, killZone } = body.message;

            this.matrix = matrix;
            this.killZone = killZone;

            this.changePlayer();
            this.showMessage();
            this.rebuild();
            this.isCheck();

            if(this.localPlayer !== this.player && this.bot) this.selectBot();
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

    async selectBot() {
        const rowIndex = Math.floor(Math.random() * 8);
        const boxIndex = Math.floor(Math.random() * 8);
        const roomId = localStorage.getItem('room');

        const chess = this.matrix[rowIndex][boxIndex];

        if(this.botSelected) {
            if(chess === 0 || chess.split('-')[0] !== this.player) {
                this.transport.emit('move', JSON.stringify({ boxIndex, rowIndex, roomId }));
                this.botSelected = false;
            }
            else this.selectBot();
        } else {
            if(chess && chess.split('-')[0] === this.player) {
                this.highLight(chess.split('-')[1], rowIndex, boxIndex);
                await this.transport.emit('move', JSON.stringify({ boxIndex, rowIndex, roomId }));

                this.botSelected = true;
                this.selectBot();
            }
            else this.selectBot(); 
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
        if(id !== null) document.getElementById(id).classList.remove('highlight');
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
