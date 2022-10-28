import React from "react";
import "./BattleshipBoard.css";


class BattleshipSetupBoard extends React.Component {

    constructor(props) {
        super(props);

        this.ships = [
            {
                amount: 1,
                shape: 'xxxx',
            },
            {
                amount: 1,
                shape: 'xxx',
            },
            {
                amount: 2,
                shape: 'xx',
            },
            {
                amount: 3,
                shape: 'x',
            },
        ];

        let shipState = [];
        this.ships.forEach(shipType => {
            for (let i = 0; i < shipType.amount; i++) {
                let position = {
                    x: Math.floor(Math.random() * this.props.size),
                    y: Math.floor(Math.random() * this.props.size),
                    width: shipType.shape.length,
                    height: 1,
                };
                if(Math.random() < .5) {
                    let w = position.width;
                    position.width = position.height;
                    position.height = w;
                }

                if(this.isDropPositionPossible(shipState, position)) {
                    shipState.push({
                        position: position,
                    });
                } else {
                    i--;
                }
            }
        })

        this.state = {
            ships: shipState,
        };

        this.onShipyardDragStart = this.onShipyardDragStart.bind(this);
        this.dropShip = this.dropShip.bind(this);
        this.rotateShip = this.rotateShip.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    squareWidth() {
        return document.getElementsByClassName('battleship_board')[0].getBoundingClientRect().width / this.props.size;
    }

    onShipyardDragStart(event) {
        let bounds = event.target.getBoundingClientRect();
        let xPositionInShip = event.clientX - bounds.x;
        let yPositionInShip = event.clientY - bounds.y;

        event.dataTransfer.setData("text", `${event.target.dataset.idx};${xPositionInShip};${yPositionInShip}`);
        event.dataTransfer.dropEffect = "move";
    }

    allowDrop(event) {
        event.preventDefault();
    }

    rectOverlap(rect1, rect2) {
        return (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y);
    }

    isDropPositionOutOfBounds(position) {
        return (position.x < 0
            || position.y < 0
            || position.x + position.width > this.props.size
            || position.y + position.height > this.props.size);
    }

    isDropPositionPossible(ships, shipPosition) {
        if (this.isDropPositionOutOfBounds(shipPosition)) {
            return false;
        }

        let illegalBox = {
            x: shipPosition.x - 1,
            y: shipPosition.y - 1,
            width: shipPosition.width + 2,
            height: shipPosition.height + 2,
        }

        let overlap = false;

        ships.forEach(ship => {
            if (ship.position.x === null) return;
            if (this.rectOverlap(ship.position, illegalBox)) {
                overlap = true;
            }
        });

        return !overlap;
    }

    rotateShip(event) {
        let ships = JSON.parse(JSON.stringify(this.state.ships));
        let idx = event.target.dataset.idx;

        let position = JSON.parse(JSON.stringify(ships[idx].position));
        position.width = ships[idx].position.height;
        position.height = ships[idx].position.width;
        ships[idx].position.x = null;
        ships[idx].position.y = null;

        if (this.isDropPositionPossible(ships, position)) {
            ships[idx].position = position;
            this.setState({
                ships: ships,
            })
        }
    }

    dropShip(event) {
        let gridElement = event.target.closest(".battleship_drop_target");
        if (!gridElement) {
            return;
        }

        event.preventDefault();
        var [idx, xOffset, yOffset] = event.dataTransfer.getData("text").split(";");
        let ships = JSON.parse(JSON.stringify(this.state.ships));

        let bounds = gridElement.getBoundingClientRect();
        let xPositionInBoard = event.clientX - bounds.x - xOffset + .5 * this.squareWidth();
        let yPositionInBoard = event.clientY - bounds.y - yOffset + .5 * this.squareWidth();

        let x = Math.floor(xPositionInBoard * this.props.size / bounds.width);
        let y = Math.floor(yPositionInBoard * this.props.size / bounds.height);

        let position = JSON.parse(JSON.stringify(ships[idx].position));
        ships[idx].position.x = null;
        ships[idx].position.y = null;
        position.x = x;
        position.y = y;

        if (this.isDropPositionPossible(ships, position)) {
            ships[idx].position = position
            this.setState({
                ships: ships,
            })
        }
    }

    isFullyPlaced() {
        let fullyPlaced = true;
        this.state.ships.forEach(ship => {
            if (ship.position.x === null) {
                fullyPlaced = false;
            }
        });
        return fullyPlaced;
    }

    startGame() {
        this.props.onBoardSetupCompleted(this.state.ships);
    }

    shipyard() {
        return (<div className="shipyard">
            {this.ships.map((shipType, shipTypeIdx) => {
                let startIdx = 0;
                for (let i = 0; i < shipTypeIdx; i++) {
                    startIdx += this.ships[i].amount;
                }
                return <div key={shipType.shape}>
                    {Array.from({ length: shipType.amount }, (_, idx) =>
                        <div className={"ship"} key={idx}
                            draggable={this.state.ships[startIdx + idx].position.x === null} onDragStart={this.onShipyardDragStart}
                            style={{
                                "--ship-width": shipType.shape.length,
                                "--ship-height": 1,
                            }}
                            data-idx={startIdx + idx} />
                    )}
                </div>
            }
            )}
            {
                this.isFullyPlaced() ?
                    <input type="button" value="START GAME" onClick={this.startGame} /> :
                    <input type="button" value="START GAME" className="disabled" />
            }
        </div>)
    }

    board() {
        return (<div className="battleship_board" onDrop={this.dropShip} onDragOver={this.allowDrop}>
            <table>
                <tbody>
                    {Array.from({ length: this.props.size }, (_, idx) =>
                        <tr key={idx}>
                            {Array.from({ length: this.props.size }, (_, idx) =>
                                <td key={idx} />
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="battleship_drop_target">
                {this.state.ships.map((ship, idx) =>
                    ship.position.x !== null ? <div className="ship" key={`${idx}`}
                        draggable={true} onDragStart={this.onShipyardDragStart}
                        onClick={this.rotateShip}
                        style={{
                            "--ship-position-x": ship.position.x,
                            "--ship-position-y": ship.position.y,
                            "--ship-width": ship.position.width,
                            "--ship-height": ship.position.height,
                        }}
                        data-idx={idx} /> : null
                ).filter(ship => ship !== null)}
            </div>
        </div>)
    }

    render() {
        return (
            <div className="battleship_board_container">
                {this.shipyard()}
                {this.board()}
            </div>
        );
    }
}

export default BattleshipSetupBoard;