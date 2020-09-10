import {GameManager} from "./gamemanager.js";

function startGame(e, socket) {
    const player = e.currentTarget.value;
    const id = localStorage.getItem('id') || null;
    const game = new GameManager(player, socket, id);
    const modal = document.querySelector(".modal");
    const content = document.querySelector('.modal__content');
    
    game.transport.emit('join', JSON.stringify({ player: game.localPlayer, id: game.id }));
    content.style.display = 'none';

    pauseGame('Aguardando Oponente...');

    socket.on('start', body => {
        game.setPlayer(body.startPlayer);
        game.start();

        localStorage.setItem('room', body.room);
        modal.style.display = 'none';
    });

    socket.on('update', body => {
        game.update(JSON.parse(body));
    });

    socket.on('message', body => appendMessage(body.message, body.id));
}

function appendMessage(message, id) {
    const content = document.querySelector('.message-box__content');
    const container = document.createElement('div');
    const span = document.createElement('span');
    const className = id === localStorage.getItem('id') ? 'text-self' : 'text-oponent';

    container.classList.add(className);
    span.textContent = message;

    container.appendChild(span);
    content.appendChild(container);
}

function pauseGame(message) {
    const modal = document.querySelector(".modal");
    const loading = document.querySelector('.modal__loading');

    modal.style.display = 'block';
    loading.style.display = 'block';

    return showLoadingText(message);
}

function showLoadingText(message) {
    const loadingText = document.getElementById('text');
    const text = message;

    let mockText = '';
    let i = 0;

    let interval = setInterval(() => {
        if(mockText === text) {
            mockText = '';
            i = 0;
        } else {
            mockText += text[i];
            loadingText.textContent = mockText;
            i++;
        }
    }, 200);

    return interval;
}

function connection(socket, interval) {
    socket.on('connect', () => {
        const loading = document.querySelector('.modal__loading');
        const content = document.querySelector('.modal__content');

        loading.style.display = 'none';
        content.style.display = 'block';

        clearInterval(interval);

        socket.emit('id', 'id');
    });
    socket.on('id', body => localStorage.getItem('id') === null && localStorage.setItem('id', body.id));
}

function sendMessage(socket) {
    const room = localStorage.getItem('room');
    const id = localStorage.getItem('id');
    const input = document.querySelector('.message-box__input input');

    socket.emit('message', JSON.stringify({ room, message: input.value, id }));
}

function resetStorage() {
    localStorage.removeItem('room');
    localStorage.removeItem('id');
}

window.onload = () => {
    const socket = io(window.location.href);
    const buttonYellow = document.querySelector(".modal__button--yellow");
    const buttonRed = document.querySelector(".modal__button--red");
    const buttonSend = document.querySelector('.message-box__input button');

    resetStorage();
    connection(socket, pauseGame('Carregando...'));

    buttonYellow.onclick = e => startGame(e, socket);
    buttonRed.onclick = e => startGame(e, socket);
    buttonSend.onclick = () => sendMessage(socket);
}