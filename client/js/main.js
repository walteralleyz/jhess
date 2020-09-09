import {GameManager} from "./gamemanager.js";

function startGame(e, socket) {
    const player = e.currentTarget.value;
    const id = localStorage.getItem('id') || null;
    const game = new GameManager(player, socket, id);
    const modal = document.querySelector(".modal");
    const content = document.querySelector('.modal__content');
    
    game.emit('join', JSON.stringify({ player: game.localPlayer, id: game.id }));
    content.style.display = 'none';

    pauseGame('Aguardando Oponente...');

    socket.on('start', body => {
        game.start();
        localStorage.setItem('room', body);
        modal.style.display = 'none';
    });
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
    });
    socket.on('id', body => localStorage.setItem('id', body.id));
}

window.onload = () => {
    const socket = io(window.location.href);
    const buttonYellow = document.querySelector(".modal__button--yellow");
    const buttonRed = document.querySelector(".modal__button--red");

    connection(socket, pauseGame('Carregando...'));

    buttonYellow.onclick = e => startGame(e, socket);
    buttonRed.onclick = e => startGame(e, socket);
}