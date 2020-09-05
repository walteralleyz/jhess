import {GameManager} from "./gamemanager.js";

window.onload = () => {
    const game = new GameManager();

    localStorage.removeItem('selected');
    game.start();
};