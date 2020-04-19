import React, {Component} from "react";
import {Row, Col, Button, ListGroup, ListGroupItem} from "react-bootstrap";
import {PeopleFill, Bullseye, StopwatchFill, CaretDownFill} from 'react-bootstrap-icons';
import Form from "react-bootstrap/Form";
import {RouletteClient} from "./RouletteClient";
import $ from "jquery";
import {AuthContext} from "../../../context/AuthContext";

/**
 * Jeu roulette
 */
class Roulette extends Component {
    /**
     * Contexte d'authentification
     */
    static contextType = AuthContext;

    constructor(props,context) {
        super(props,context);

        /**
         * Initialisation de l'état
         */
        this.state = {
            //Valeur à miser
            betValue:       0,
            //Mises sur le violet
            purpleBets:     [],
            //Mises sur le noir
            blackBets:      [],
            //Mises sur le rose
            pinkBets:       [],
            //État de la roulette
            rolling:        false,
            //Autoriser les paris
            allowBets:      false,
            //Nombre gagnant aléatoire
            winningNumber:  -1,
            //Liste des numéros qui sera animée
            rollList:       [],
            //Couleur des numéros
            colors:         {},
            //Multiplicateurs de chaque couleur
            profits:        {},
            //Historique des tirages
            history:        []
        };

        this.animateRoll = this.animateRoll.bind(this);
        this.resetAnimation = this.resetAnimation.bind(this);
        this.setNumbersColor = this.setNumbersColor.bind(this);
        this.setColorsProfit = this.setColorsProfit.bind(this);
        this.getNumberColor = this.getNumberColor.bind(this);

        this.updateBetList = this.updateBetList.bind(this);
        this.updateTimer = this.updateTimer.bind(this);
        this.updateRolling = this.updateRolling.bind(this);
        this.updateWinningNumber = this.updateWinningNumber.bind(this);
        this.updateRollList = this.updateRollList.bind(this);
        this.updateMoney = this.updateMoney.bind(this);
        this.updateHistory = this.updateHistory.bind(this);

        this.handleBetValueIncrement = this.handleBetValueIncrement.bind(this);
        this.handleBetValueChange = this.handleBetValueChange.bind(this);
        this.handleBetConfirm = this.handleBetConfirm.bind(this);

        /**
         * Client de la roulette
         */
        this.client = new RouletteClient();

        /**
         * Liaison de la fonction de mise à jour des mises placées
         */
        this.client.onUpdateBets(this.updateBetList);

        /**
         * Liaison de la fonction de mise à jour des mises placées pour les vider
         */
        this.client.onClearBets(this.updateBetList);

        /**
         * Liaison de la fonction de mise à jour du chronomètre
         */
        this.client.onUpdateTimer(this.updateTimer);

        /**
         * Liaison de la fonction de mise à jour de l'état de la roulette
         */
        this.client.onUpdateRolling(this.updateRolling);

        /**
         * Liaison de la fonction de mise à jour du numéro gagnant
         */
        this.client.onUpdateWinningNumber(this.updateWinningNumber);

        /**
         * Liaison de la fonction de mise à jour de la liste animée
         */
        this.client.onUpdateRollList(this.updateRollList);

        /**
         * Liaison de la fonction de mise à jour de l'argent de l'utilisateur
         */
        this.client.onUpdateMoney(this.updateMoney);

        /**
         * Liaison de la fonction de mise à jour de l'historique de l'utilisateur
         */
        this.client.onUpdateHistory(this.updateHistory);

        /**
         * Liaison de la fonction pour définir la couleur de chaque numéro
         */
        this.client.onSetNumbersColor(this.setNumbersColor);

        /**
         * Liaison de la fonction pour définir le profit de chaque couleur
         */
        this.client.onSetColorsProfits(this.setColorsProfit);
    }

    /**
     * Définir le profit de chaque couleur
     * @param profits liste des multiplicateurs
     */
    setColorsProfit(profits) {
        this.setState({profits: profits});
    }

    /**
     * Définir la couleur de chaque numéro
     * @param colors liste des couleurs
     */
    setNumbersColor(colors) {
        this.setState({colors: colors});
    }

    /**
     * Mettre à jour le chronomètre
     * @param value nombre de secondes restantes
     */
    updateTimer(value) {
        this.setState({timer: value});
    }

    /**
     * Mettre à jour l'état de la roulette (tourne/statique)
     * @param value valeur
     */
    updateRolling(value) {
        this.setState({rolling: value, allowBets: !value});
        //Démarrage de l'animation
        this.animateRoll();
    }

    /**
     * Mettre à jour le numéro gagnant
     * @param number
     */
    updateWinningNumber(number) {
        this.setState({winningNumber: number});
    }

    /**
     * Mettre à jour la liste des numéros de la roulette (pour l'animation)
     * @param list
     */
    updateRollList(list) {
        this.setState({rollList: list});
        //Réinitialisation de l'animation
        this.resetAnimation();
    }

    /**
     * Mettre à jour l'argent de l'utilisateur
     * @param value
     */
    updateMoney(value) {
        this.context.setMoney(value);
    }

    /**
     * Mettre à jour l'historique
     * @param history
     */
    updateHistory(history) {
        this.setState({history: history});
    }

    /**
     * Mettre à jour les éléments d'une liste
     * @param color couleur de liste
     * @param betList liste
     */
    updateBetList(color, betList) {
        //Opération en fonction de la couleur
        switch (color) {
            //Couleur violet
            case "purple":
                //Mise à jour de la liste des paris sur le violet
                this.setState({purpleBets: betList});
                break;
            //Couleur noire
            case "black":
                //Mise à jour de la liste des paris sur le noir
                this.setState({blackBets: betList});
                break;
            //Couleur rose
            case "pink":
                //Mise à jour de la liste des paris sur le rose
                this.setState({pinkBets: betList});
                break;
            default:
                break;
        }
    }

    /**
     * Incrémenter la mise avec une valeur
     * @param value
     */
    handleBetValueIncrement(value) {
        //Si la valeur est supérieur à 0 et que l'utilisateur à l'argent nécessaire
        if (value > 0 && (this.state.betValue + value) <= this.context.money)
            //Mise à jour de la valeur à parier
            this.setState((state) => ({
                betValue: state.betValue + value
            }));
        else
            //Mise à jour de la valeur avec l'argent de l'utilisateur
            this.setState({betValue: this.context.money});
    }

    /**
     * Confirmer paris sur une couleur
     * @param color couleur
     */
    handleBetConfirm(color) {
        //On vérifie que l'utilisateur a les fonds nécessaires
        if (this.state.allowBets && this.context.money >= this.state.betValue && this.state.betValue > 0) {
            //Ajout de la mise dans la liste concernée
            this.client.addBet(color, this.context.username, this.state.betValue);
            //Réinitialisation de la mise en jeu
            this.setState({betValue: 0});
        }
    }

    /**
     * Mettre à jour betValue lorsque l'utilisateur saisit une valeur au clavier
     * @param value
     */
    handleBetValueChange(value) {
        this.setState({betValue: parseInt(value)});
    }

    /**
     * Animer le lancement de la roulette
     */
    animateRoll() {
        //Si la roulette est lancée et que le numéro gagnant est définit
        if (this.state.rolling && this.state.winningNumber !== -1) {
            //Récupération de l'élément roulette dans le DOM
            let roulette = $("#roulette");
            //Récupération de l'index du numéro gagnant
            let winningNumberIndex = this.state.rollList.lastIndexOf(this.state.winningNumber);
            //Calcul du la position
            let pos = (((92 + 3.8333) * winningNumberIndex) + 46) - (roulette.width() / 2);
            //Animation de la roulette
            roulette.animate({scrollLeft: pos}, 5000);
        }
    }

    /**
     * Réinitialiser l'animation
     */
    resetAnimation() {
        //Récupération de l'élément roulette dans le DOM
        let roulette = $("#roulette");
        //Calcul de la position à laquelle se positionner
        //on multiplie par 20 pour avoir la 2e occurence de l'ancien nombre gagnant
        let pos = (((92 + 3.8333) * 20) + 46) - (roulette.width() / 2);
        //Positionnement du scroll à la position
        roulette.scrollTo(pos);
    }

    /**
     * Récupérer la couleur associée au numéro
     * @param number numéro
     * @returns {string} nom de la couleur
     */
    getNumberColor(number) {
        //Numéro contenu dans ceux dont la couleur est violet
        if (this.state.colors.black.includes(number))
            return "black";
        //Numéro contenu dans ceux dont la couleur est noire
        else if (this.state.colors.purple.includes(number))
            return "purple";
        //Numéro contenu dans ceux dont la couleur est rose
        else if (this.state.colors.pink.includes(number))
            return "pink";
    }

    render() {
        return (
            <Row className="m-0">
                <Col className="m-0 mt-2 mb-4 col-12">
                    <Row>
                        <Col className={"col-12 col-sm"}><h4><CoinIcon/> {this.context.money}</h4></Col>
                        <Timer rolling={this.state.rolling} timer={this.state.timer}/>
                        <Col className={"mt-3 mt-sm-0 text-center text-sm-right col"}>
                            <h4>Tirages <History getNumberColor={this.getNumberColor} history={this.state.history}/></h4>
                        </Col>
                    </Row>
                </Col>
                <Col className="m-0 my-2 col-12">
                    <Row id="roulette">
                        <CaretDownFill className="indicator"/>
                        <RouletteNumbers
                            getNumberColor={this.getNumberColor}
                            rollList={this.state.rollList}
                        />
                    </Row>
                </Col>
                <Col className="m-0 my-3 col-12">
                    <BetInput
                        value={this.state.betValue}
                        onBetValueChange={this.handleBetValueChange}
                        onBetValueIncrement={this.handleBetValueIncrement}
                    />
                </Col>
                <Col className="m-0 my-3 col-12">
                    <Row className="bet-lists">
                        <BetList
                            profitsMultiplicator={this.state.profits.purple}
                            username={this.context.username}
                            allowBets={this.state.allowBets}
                            color={"purple"}
                            betButtonText={"1 - 7"}
                            betList={this.state.purpleBets}
                            onBetListClick={this.handleBetConfirm}
                        />
                        <BetList
                            profitsMultiplicator={this.state.profits.black}
                            username={this.context.username}
                            allowBets={this.state.allowBets}
                            color={"black"}
                            betButtonText={"0"}
                            betList={this.state.blackBets}
                            onBetListClick={this.handleBetConfirm}
                        />
                        <BetList
                            profitsMultiplicator={this.state.profits.pink}
                            username={this.context.username}
                            allowBets={this.state.allowBets}
                            color={"pink"}
                            betButtonText={"8 - 14"}
                            betList={this.state.pinkBets}
                            onBetListClick={this.handleBetConfirm}
                        />
                    </Row>
                </Col>
            </Row>
        );
    }
}

/**
 * Icône jeton
 */
class CoinIcon extends Component {
    render() {
        return (<Bullseye color="#ffb300"/>);
    }
}

/**
 * Chronomètre
 */
class Timer extends Component {
    render() {
        return (
            <Col className={"mt-3 mt-sm-0 col-12 col-sm"}>
                <div className={"d-flex justify-content-center text-center"}>
                    {(!this.props.rolling)
                        ? <h4 className={"timer timer-start"}>Tirage dans {this.props.timer} <StopwatchFill color={"#FFF"}/></h4>
                        : <h4 className={"timer timer-pause"}>Tirage en cours</h4>
                    }
                </div>
            </Col>
        );
    }
}

/**
 * Historique des tirages
 */
class History extends Component {
    render() {
        const Numbers = ({numbers}) => (
            <>
                {numbers.map((number, index) =>
                    (<span key={index} className={this.props.getNumberColor(number) + " badge history"}>{number}</span>))
                }
            </>
        );

        return(
            <Numbers numbers={this.props.history} />
        );
    }
}

/**
 * Numéros affichés lorsque le tirage est lancé
 */
class RouletteNumbers extends Component {
    render() {
        const Numbers = ({numbers}) => (
            <>
                {(numbers.length > 0) ?
                    numbers.map(
                        (number, index) => (<Col key={index} className={this.props.getNumberColor(number) + " number"}>{number}</Col>)
                    )
                :
                    <Col id="waiting-text" className={"col-12 text-center text-dark"}>Attente du prochain tirage</Col>
                }
            </>
        );

        return(
            <Numbers numbers={this.props.rollList} />
        );
    }
}

/**
 * Champ de texte pour définir la mise souhaitée à parier
 */
class BetInput extends Component {
    //Évènement lorsque l'utilisateur saisit une valeur au clavier
    handleOnChange = (e) => {
        //Si le champ est vide, par défaut 0
        if (e.target.value === "") this.props.onBetValueChange(0);
        //Modification de la valeur
        else this.props.onBetValueChange(e.target.value);
    };

    //Évènement lorsque l'utilisateur clique sur un des boutons pour incrémenter la mise à parier
    handleIncrement = (value) => {
        //Incrémentation de la valeur
        this.props.onBetValueIncrement(value);
    };

    render() {
        return (
            <div className="bet-input m-0 px-2 d-flex flex-wrap align-items-center">
                <div>
                    <h5 className="m-0 ml-1">Votre mise</h5>
                </div>
                <div>
                    <Form>
                        <Form.Control type="text" value={this.props.value} onChange={(e) => this.handleOnChange(e)}/>
                    </Form>
                </div>
                <div className="ml-auto"><Button onClick={() => this.handleIncrement(1)}>+ 1</Button></div>
                <div><Button onClick={() => this.handleIncrement(5)}>+ 5</Button></div>
                <div><Button onClick={() => this.handleIncrement(10)}>+ 10</Button></div>
                <div><Button onClick={() => this.handleIncrement(100)}>+ 100</Button></div>
                <div><Button onClick={() => this.handleIncrement(1000)}>+ 1000</Button></div>
                <div><Button onClick={() => this.handleIncrement(0)}>MAX</Button></div>
            </div>
        );
    }
}

/**
 * Mise effectuée par un joueur
 */
class BetListItem extends Component {
    render() {
        return (
            <ListGroupItem key={this.props.username}>
                <Row>
                    <Col>{this.props.username}</Col>
                    <Col className="text-right"><CoinIcon/> {this.props.bet}</Col>
                </Row>
            </ListGroupItem>
        );
    }
}

/**
 * Liste contenant les mises des joueurs pour une couleur
 */
class BetList extends Component {
    //Évènement pour confirmer un paris
    handleConfirm = () => {
        //Possibilité de parier
        if (this.props.allowBets)
            //Appel de la méthode passée en paramètre
            this.props.onBetListClick(this.props.color);
    };

    render() {
        const isButtonDisabled = this.props.allowBets ? "" : " disabled";
        const numberOfPlayers = this.props.betList.length;
        const totalBetsValue = this.props.betList.reduce(function(total, item){return total + item.bet}, 0);
        let itemIndex = this.props.betList.findIndex(item => item.username === this.props.username);
        const potentialWinValue = (itemIndex !== -1) ? this.props.betList[itemIndex].bet*this.props.profitsMultiplicator : 0;

        return (
            <Col className={"col-12 col-sm mb-3 mb-sm-0"}>
                <Row className={"m-0 p-2 " + this.props.color}>
                    <Col className="col-12 text-center text-white">
                        <h5>Gains potentiels : {potentialWinValue}</h5>
                    </Col>
                    <Col className="col-12">
                        <Button className={"w-100 btn-light" + isButtonDisabled} onClick={this.handleConfirm}>{this.props.betButtonText}</Button>
                    </Col>
                    <Col className="pt-2 text-white col-12">
                        <Row>
                            <Col><PeopleFill/> {numberOfPlayers}</Col>
                            <Col className="text-right"><CoinIcon/> {totalBetsValue}</Col>
                        </Row>
                        <hr className="text-white m-2"/>
                    </Col>
                    <Col className="col-12">
                        <Row>
                            <ListGroup className="list-group px-3 py-2 w-100">
                                {this.props.betList.map(item =>
                                    <BetListItem username={item.username} bet={item.bet} key={item.username}/>
                                )}
                            </ListGroup>
                        </Row>
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default Roulette;
