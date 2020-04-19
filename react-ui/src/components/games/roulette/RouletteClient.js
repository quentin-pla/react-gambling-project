/**
 * Instance socket IO
 */
import socket from "../../../context/SocketIOInstance";

/**
 * Classe Roulette Client
 */
class RouletteClient {
    /**
     * Constructeur
     */
    constructor() {
        //Émission d'un message pour démarrer la roulette
        socket.emit('start-roulette');
    }

    /**
     * Mise à jour des mises placées
     * @param updateBetList fonction appelée
     */
    onUpdateBets(updateBetList) {
        socket.on("add-purple-bets", (betList) => updateBetList("purple", betList));
        socket.on("add-black-bets", (betList) => updateBetList("black", betList));
        socket.on("add-pink-bets", (betList) => updateBetList("pink", betList));
    }

    /**
     * Effacement de toutes les mises en jeu
     * @param updateBetList
     */
    onClearBets(updateBetList) {
        socket.on("clear-roulette-bets", () => {
            updateBetList("purple", []);
            updateBetList("black", []);
            updateBetList("pink", []);
        })
    }

    /**
     * Mise à jour du chronomètre
     * @param updateTimer fonction liée
     */
    onUpdateTimer(updateTimer) {
        socket.on("update-timer", (value) => {
            updateTimer(value);
        });
    }

    /**
     * Mise à jour de l'état de la roulette
     * @param updateRolling fonction liée
     */
    onUpdateRolling(updateRolling) {
        socket.on("update-rolling", (value) => {
            updateRolling(value);
        });
    }

    /**
     * Mise à jour du numéro gagnant
     * @param updateWinningNumber fonction liée
     */
    onUpdateWinningNumber(updateWinningNumber) {
        socket.on("update-winning-number", (number) => {
            updateWinningNumber(number);
        });
    }

    /**
     * Mise à jour des numéros de la liste pour l'animation
     * @param updateRollList fonction liée
     */
    onUpdateRollList(updateRollList) {
        socket.on("update-roll-list", (list) => {
            updateRollList(list);
        });
    }

    /**
     * Mettre à jour l'argent de l'utilisateur
     * @param updateMoney fonction liée
     */
    onUpdateMoney(updateMoney) {
        socket.on("update-money", (value) => {
            updateMoney(value);
        });
    }

    /**
     * Mettre à jour l'historique des tirages
     * @param updateHistory historique
     */
    onUpdateHistory(updateHistory) {
        socket.on('update-history', (history) => {
            updateHistory(history);
        })
    }

    /**
     * Définir la couleur de chaque numéro
     * @param setNumbersColor liste des couleurs
     */
    onSetNumbersColor(setNumbersColor) {
        socket.on('set-numbers-color', (colors) => {
            setNumbersColor(colors);
        });
    }

    /**
     * Définir les profits pour chaque couleur
     * @param setColorsProfits
     */
    onSetColorsProfits(setColorsProfits) {
        socket.on('set-colors-profit', (profits) => {
            setColorsProfits(profits);
        })
    }

    /**
     * Placement d'une mise sur une couleur de la roulette
     */
    addBet(color, username, betValue) {
        socket.emit("post-bet", color, username, betValue);
    }
}

export { RouletteClient }
