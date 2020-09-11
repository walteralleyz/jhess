import {GameManager} from "./gamemanager.js";

function socketStart(socket, game, modal) {
    socket.on('start', body => {
        game.setPlayer(body.startPlayer);
        game.start();

        localStorage.setItem('room', body.room);
        modal.style.display = 'none';
    });
}

function socketUpdate(socket, game) {
    socket.on('update', body => {
        game.update(JSON.parse(body));
    });
}

function socketMessage(socket) {
    socket.on('message', body => appendMessage(body.message, false, body.id));
}

function socketClients(socket) {
    socket.on('clients', body => updateNumClients(body.len));
}

function socketDisconnect(socket) {
    socket.on('off', body => appendMessage('Oponente Desconectou', true));
}

function startGame(e, socket) {
    const player = e.currentTarget.value;
    const id = localStorage.getItem('id') || null;
    const game = new GameManager(player, socket, id);
    const modal = document.querySelector(".modal");
    const content = document.querySelector('.modal__content');
    
    game.transport.emit('join', JSON.stringify({ player: game.localPlayer, id: game.id }));
    content.style.display = 'none';

    pauseGame('Aguardando Oponente...');

    socketStart(socket, game, modal);
    socketUpdate(socket, game);
    socketMessage(socket);
}

function PlayBot(socket) {
    const id = localStorage.getItem('id') || null;
    const game = new GameManager('y', socket, id, true);
    const modal = document.querySelector(".modal");
    const content = document.querySelector('.modal__content');
    
    game.transport.emit('bot', JSON.stringify({ player: game.localPlayer, id: game.id }));
    content.style.display = 'none';

    pauseGame('Aguardando Oponente...');

    socketStart(socket, game, modal);
    socketUpdate(socket, game);
    socketMessage(socket);
}

function appendMessage(message, off, id) {
    const content = document.querySelector('.message-box__content');
    const container = document.createElement('div');
    const p = document.createElement('p');
    const small = document.createElement('small');

    let className;

    if(!off) className = id === localStorage.getItem('id') ? 'text-self' : 'text-oponent';
    else className = 'text-off';

    container.classList.add(className);
    p.textContent = message;
    small.textContent = new Date().getHours() + ':' + new Date().getMinutes();

    p.appendChild(small);
    container.appendChild(p);
    content.appendChild(container);

    container.scrollIntoView();
}

function updateNumClients(total) {
    const clients = document.querySelector('.clients');

    clients.textContent = `Conectados: ${total}`;
}

function pauseGame(message) {
    const modal = document.querySelector(".modal");
    const loading = document.querySelector('.modal__loading');

    modal.style.display = 'fixed';
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

    input.value = "";
}

function resetStorage() {
    const entries = Object.keys(localStorage);

    for(let entry of entries) {
        localStorage.removeItem(entry);
    }
}

window.onload = () => {
    const socket = io(window.location.href);
    const buttonYellow = document.querySelector(".modal__button--yellow");
    const buttonRed = document.querySelector(".modal__button--red");
    const buttonBot = document.querySelector(".modal__button--bot");
    const buttonSend = document.querySelector('.message-box__input button');

    socketClients(socket);
    socketDisconnect(socket);
    resetStorage();
    connection(socket, pauseGame('Carregando...'));

    buttonYellow.onclick = e => startGame(e, socket);
    buttonRed.onclick = e => startGame(e, socket);
    buttonBot.onclick = () => PlayBot(socket);
    buttonSend.onclick = () => sendMessage(socket);
}