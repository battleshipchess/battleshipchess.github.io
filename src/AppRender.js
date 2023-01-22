import React from 'react';
import './App.css';
import BattleshipSetupBoard from './boards/BattleshipSetupBoard';
import BattleChessboard from './boards/BattleChessboard';
import ChessClock from './ChessClock';

import GameFooter from './GameFooter';
import AppHeader from './AppHeader';
import NotationPanel from './NotationPanel';

import Utils from './Utils';

const GAME_OVER_CHESS = "chess";
const GAME_OVER_BATTLESHIP = "battleship";
const GAME_OVER_TIME_OUT = "timeout";
const GAME_OVER_RESIGN = "resign";

function renderBoardSetup() {
    return (
        <div className="App">
            <AppHeader message="Welcome to BattleChess" />
            <div className='mainContent'>
                <BattleshipSetupBoard onBoardSetupCompleted={this.onBoardSetupCompleted} size={this.size} gameCode={this.state.gameCode} />
                <div />
            </div>
            <GameFooter />
        </div>
    );
}

function renderGame() {
    return (
        <div className="App">
            <AppHeader message="BattleChess" />
            <div className='mainContent'>
                <ChessClock leftoverTime={this.state.leftoverTime} opponentLeftoverTime={this.state.opponentLeftoverTime} lastTimeSync={this.state.lastTimeSync} turn={this.state.chess.turn()} color={this.state.color} onTimeOut={this.onTimeOut} isOpponentLive={this.state.isOpponentLive} />
                <BattleChessboard chess={this.state.chess} onMove={this.onMove} board={this.state.board} size={this.size} color={this.state.color} selectedPiece={this.state.selectedPiece} selectPiece={this.selectPiece} deselectPiece={this.deselectPiece} viewMoveIdx={this.state.viewMoveIdx} />
                <BattleChessboard chess={this.state.chess} onMove={this.onMove} board={this.state.opponentBoard} size={this.size} color={this.state.color} selectedPiece={this.state.selectedPiece} selectPiece={this.selectPiece} deselectPiece={this.deselectPiece} viewMoveIdx={this.state.viewMoveIdx} />
            </div>
            <div className='mainContentVertical'>
                <NotationPanel chess={this.state.chess} color={this.state.color} reviewMoveDelta={this.reviewMoveDelta} />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <input type="button" data-type="primary" value="RESIGN" onClick={this.resign} />
                </div>
            </div>
            <GameFooter state="rules" />
        </div>
    );
}

function renderWinner() {
    const gameOverMessages = {
        win: {
            default: ['Congratulations! You Won!'],
        },
        loss: {
            default: ['Looks like you lost. Better luck next time!'],
        }
    }
    gameOverMessages.win[GAME_OVER_CHESS] = ['The king has been captured and your opponents fleet has scattered in fear! Looks like you\'ve won!'];
    gameOverMessages.win[GAME_OVER_BATTLESHIP] = ['Your opponents fleet has been sunk! Well played captain!'];
    gameOverMessages.win[GAME_OVER_TIME_OUT] = ['Looks like time has run out for your opponent. Well played!'];
    gameOverMessages.win[GAME_OVER_RESIGN] = ['Looks like your opponent has fled the battle! Congratulations, you won!'];

    gameOverMessages.loss[GAME_OVER_CHESS] = ['Your king has been captured and your army has fled the battle. Better luck next time!'];
    gameOverMessages.loss[GAME_OVER_BATTLESHIP] = ['Your last ship has been sunk! The battle has been lost, but the war is far from over.'];
    gameOverMessages.loss[GAME_OVER_TIME_OUT] = ['Hesitation is the enemy of opportunity. Looks like your time has run out!'];
    gameOverMessages.loss[GAME_OVER_RESIGN] = ['A good general knows when a battle is lost! Time to regroup and return to the fight!'];

    if (this.state.winner === null) {
        return <div className="game_result">It's a DRAW. Time for a rematch</div>
    }
    let winState = this.state.winner === this.state.color ? "win" : "loss";
    let messageOptions = gameOverMessages[winState][this.state.winCondition];
    if (messageOptions == null || messageOptions.length === 0) {
        messageOptions = gameOverMessages[winState].default;
    }

    let messageIdx = Math.floor(Math.random() * messageOptions.length);
    return <div className="game_result">{messageOptions[messageIdx]}</div>
}

function renderGameOver() {
    return (
        <div className="App">
            <AppHeader message="Game Over" state="game_over" />
            <div className='mainContent faded disabled'>
                <ChessClock leftoverTime={this.state.leftoverTime} opponentLeftoverTime={this.state.opponentLeftoverTime} lastTimeSync={this.state.lastTimeSync} turn={null} color={this.state.color} onTimeOut={this.onTimeOut} isOpponentLive={this.state.isOpponentLive} />
                <BattleChessboard chess={this.state.chess} onMove={this.onMove} board={this.state.board} size={this.size} color={this.state.color} selectedPiece={this.state.selectedPiece} selectPiece={this.selectPiece} deselectPiece={this.deselectPiece} viewMoveIdx={this.state.viewMoveIdx} />
                <BattleChessboard chess={this.state.chess} onMove={this.onMove} board={this.state.opponentBoard} size={this.size} color={this.state.color} selectedPiece={this.state.selectedPiece} selectPiece={this.selectPiece} deselectPiece={this.deselectPiece} viewMoveIdx={this.state.viewMoveIdx} />
            </div>
            <div className='mainContentVertical'>
                <NotationPanel chess={this.state.chess} color={this.state.color} reviewMoveDelta={this.reviewMoveDelta} />
                {this.renderWinner()}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <input type="button" data-type="primary" value="NEW GAME" onClick={this.resetGame} />
                </div>
            </div>
            <GameFooter />
        </div>
    );
}

function renderWaitingForOpponent() {
    if (!this.state.gameCode) {
        return (
            <div className="App">
                <AppHeader message="Waiting for opponent" />
                <div className='mainContentVertical waitingForOpponent'>
                    You will be paired with the next person to start a game
                    <div className="battlechessIcon loading"></div>
                    <input type="button" data-type="primary" value="ABORT" onClick={this.resetGame} />
                </div>
                <GameFooter />
            </div>
        );
    } else {
        let url = "https://battlechess.club/?game=" + this.state.gameCode;
        return (
            <div className="App">
                <AppHeader message="Waiting for opponent" />
                <div className='mainContentVertical waitingForOpponent'>
                    <div className="shareURL">
                        <div style={{ cursor: 'pointer' }} onClick={(event) => Utils.copyToClipboard(url, event)}>
                            <img src={process.env.PUBLIC_URL + '/copyicon.svg'} className="inline-img" alt="copy to clipboard" />
                        </div>
                        <div>
                            {url}
                        </div>
                    </div>
                    Invite a friend to play by copying the URL
                    <div className="battlechessIcon loading"></div>
                    <input type="button" data-type="primary" value="ABORT" onClick={this.resetGame} />
                </div>
                <GameFooter />
            </div >
        );
    }
}

function renderDisconnectedOverlay() {
    document.getElementsByTagName('body')[0].classList.add("noscroll");
    return <div className='overlayModal'>
        <div>
            <div>Looks like you've been disconnected from the server</div>
            <input type="button" value="Click here to reconnect" onClick={() => window.location.reload()} />
        </div>
    </div>
}

let AppRender = {
    renderBoardSetup,
    renderGame,
    renderWinner,
    renderGameOver,
    renderWaitingForOpponent,
    renderDisconnectedOverlay,
}

export default AppRender;