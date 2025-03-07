import { KING } from 'chess.js';
import { BLACK } from 'chess.js';
import { useEffect, useRef } from 'react';
import "./BattleshipBoard.css";
import "./Chessboard.css";
import Utils from '../Utils';

function getContent(props, colIdx, rowIdx) {
    if (props.color === BLACK) {
        return props.board[Utils.boardSize - colIdx - 1][Utils.boardSize - rowIdx - 1];
    }
    return props.board[colIdx][rowIdx];
}

function square(x, y) {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return `${alphabet[x]}${8 - y}`
}

function onChessPieceDragStart(event, props) {
    let pieceDiv = event.target.closest(".chessPieceOverlay");
    if (!pieceDiv) {
        return;
    }
    props.selectPiece(pieceDiv.dataset.x, pieceDiv.dataset.y);
    event.dataTransfer.setData("text", `${pieceDiv.dataset.square}`);
    event.dataTransfer.dropEffect = "move";
    setTimeout(() => pieceDiv.classList.add("draggingChessPiece"), 1)
}

function onChessPieceDragEnd(event) {
    let pieceDiv = event.target.closest(".chessPieceOverlay");
    if (!pieceDiv) {
        return;
    }
    pieceDiv.classList.remove("draggingChessPiece")
}

function pieceOverlay(props, x, y, selectPiece) {
    if (props.color === BLACK) {
        x = Utils.boardSize - x - 1;
        y = Utils.boardSize - y - 1;
    }
    let piece = props.chess.get(square(x, y));
    if (!piece) {
        return null;
    }
    let filename = `${process.env.PUBLIC_URL}/pieces/cburnett/${piece.color}${piece.type.toUpperCase()}.svg`;
    return (<div className="chessPieceOverlay" draggable="true" data-piece={piece.type} data-color={piece.color} data-square={square(x, y)} data-x={x} data-y={y}
        onDragStart={(event) => onChessPieceDragStart(event, props)}
        onDragEnd={onChessPieceDragEnd}
        onClick={selectPiece}>
        <img src={filename} alt={`${piece.color}${piece.type.toUpperCase()}`} />
    </div>);
}

function shipOverlay(content) {
    return (<div data-content={content} className="shipOverlay" />);
}

function lastMoveHighlight(x, y, props) {
    if (props.color === BLACK) {
        x = Utils.boardSize - x - 1;
        y = Utils.boardSize - y - 1;
    }
    let lastMove = props.chess.lastMove();
    if (lastMove != null && lastMove.from === square(x, y)) {
        return (<div className="fromSquare" />);
    } else if (lastMove != null && lastMove.to === square(x, y)) {
        return (<div className="toSquare" />);
    }
    return (<div />);
}

function checkHighlight(x, y, props) {
    if (props.color === BLACK) {
        x = Utils.boardSize - x - 1;
        y = Utils.boardSize - y - 1;
    }
    let piece = props.chess.get(square(x, y));
    if (piece.type === KING && props.chess.inCheck(piece.color)) {
        return (<div className="inCheck" />);
    }
    return (<div />);
}

function selectedPieceHighlight(x, y, props) {
    if (props.color === BLACK) {
        x = Utils.boardSize - x - 1;
        y = Utils.boardSize - y - 1;
    }
    if (props.selectedPiece && props.selectedPiece.x === x && props.selectedPiece.y === y) {
        return (<div className="selectedPiece" />);
    }
    return <div />;
}

function moveOptionHighlight(x, y, moveOptions, props) {
    if (props.color === BLACK) {
        x = Utils.boardSize - x - 1;
        y = Utils.boardSize - y - 1;
    }
    if (moveOptions.includes(square(x, y)) && props.chess.get(square(x, y))) {
        return (<div className="captureOption" />);
    } else if (moveOptions.includes(square(x, y))) {
        return (<div className="moveOption" />);
    }
    return <div />;
}

function calculateCoordinates(event, color, size) {
    let battleshipBoardDiv = event.target.closest(".battleship_board");
    let bounds = battleshipBoardDiv.getBoundingClientRect();
    let xInBoard = event.clientX - bounds.x;
    let yInBoard = event.clientY - bounds.y;

    let x = Math.floor(xInBoard * size / bounds.width);
    let y = Math.floor(yInBoard * size / bounds.height);
    if (color === BLACK) {
        x = size - x - 1;
        y = size - y - 1;
    }

    return [x, y];
}

function BattleChessboard(props) {
    const boardRef = useRef(null);

    let onDrop = (event) => {
        event.preventDefault();

        let [x, y] = calculateCoordinates(event, props.color, Utils.boardSize);

        props.onMove(event.dataTransfer.getData("text"), square(x, y));
    }

    let selectPiece = (event) => {
        event.stopPropagation();

        let [x, y] = calculateCoordinates(event, props.color, Utils.boardSize);

        let piece = props.chess.get(square(x, y));
        if (props.selectedPiece && props.selectedPiece.x === x && props.selectedPiece.y === y) {
            props.deselectPiece();
        } else if (piece && piece.color === props.color) {
            props.selectPiece(x, y);
        } else if (props.selectedPiece) {
            let from = square(props.selectedPiece.x, props.selectedPiece.y);
            let to = square(x, y);
            props.onMove(from, to);
        }
    }

    useEffect(() => {
        let deselectPiece = (event) => {
            event.preventDefault();
            props.deselectPiece();
        }

        let curBoardRef = boardRef.current;
        if (boardRef.current) {
            boardRef.current.addEventListener('contextmenu', deselectPiece);
        }

        return () => {
            if (curBoardRef) {
                curBoardRef.removeEventListener('contextmenu', deselectPiece);
            }
        }
    });

    let moveOptions = [];
    if (props.selectedPiece) {
        let squareName = square(props.selectedPiece.x, props.selectedPiece.y);
        moveOptions = props.chess.moves(squareName);
        moveOptions = moveOptions.map(move => move.to);
    }

    return (
        <div className="battleship_board_container">
            <div className="battleship_board" onDrop={onDrop} onDragOver={(event) => event.preventDefault()} onClick={selectPiece} ref={boardRef}>
                {Array.from({ length: Utils.boardSize }, (_, rowIdx) =>
                    Array.from({ length: Utils.boardSize }, (_, colIdx) =>
                        <div data-col={colIdx + 1} data-row={rowIdx + 1} key={`${colIdx}${rowIdx}`} >
                            {lastMoveHighlight(colIdx, rowIdx, props)}
                            {shipOverlay(getContent(props, colIdx, rowIdx))}
                            {selectedPieceHighlight(colIdx, rowIdx, props)}
                            {checkHighlight(colIdx, rowIdx, props)}
                            {pieceOverlay(props, colIdx, rowIdx, selectPiece)}
                            {moveOptionHighlight(colIdx, rowIdx, moveOptions, props)}
                        </div>
                    )).flat()}
            </div>
        </div>
    );
}

export default BattleChessboard;