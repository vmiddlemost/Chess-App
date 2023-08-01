import { useRef, useState } from 'react';
import Tile from '../Tile/Tile';
import './Chessboard.css';
import {
    HORIZONTAL_AXIS,
    VERTICAL_AXIS,
    GRID_SIZE,
    samePosition
} from '../../Constants';
import { Piece, Position } from '../../models';

interface Props {
    updatePossibleMoves: () => void;
    playMove: (piece: Piece, position: Position) => boolean;
    pieces: Piece[];
}

export default function Chessboard({ updatePossibleMoves, playMove, pieces }: Props) {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabPosition, setGrabPosition] = useState<Position>(new Position( -1, -1 ));
    const chessboardRef = useRef<HTMLDivElement>(null);

    function grabPiece(e: React.MouseEvent) {
        updatePossibleMoves();
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))

            setGrabPosition(new Position( grabX, grabY ));

            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const minY = chessboard.offsetTop - 25;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            // set position to "absolute" so it's positioned relative to its first ancestor element
            activePiece.style.position = "absolute";

            // if x is smaller than minimum amount, set position to min
            if (x < minX) {
                activePiece.style.left = `${minX}px`;
                // if x is bigger than maximum amount, set position to max
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
                // if x is within the minimum and maximum, leave position as is
            } else {
                activePiece.style.left = `${x}px`;
            }

            // if y is smaller than minimum amount, set position to min
            if (y < minY) {
                activePiece.style.top = `${minY}px`;
                // if y is bigger than maximum amount, set position to max
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
                // if y is within the minimum and maximum, leave position as is
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));

            // log current piece location
            const currentPiece = pieces.find((p: { position: Position; }) =>
                samePosition(p.position, grabPosition)
            );

            if (currentPiece) {
                var success = playMove(currentPiece, new Position( x, y ));
                if (!success) {
                    // RESETS THE PIECE POSITION
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }



            setActivePiece(null);
        }
    }

    // initilize the chessboard
    let board = [];

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const number = j + i + 2;
            const piece = pieces.find((p: { position: Position; }) => samePosition(p.position, new Position( i, j )));
            let image = piece ? piece.image : undefined;

            let currentPiece = activePiece != null ? pieces.find((p: { position: Position; }) => samePosition(p.position, grabPosition)) : undefined;
            let highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some((p: Position) => samePosition(p, new Position( i, j ))) : false;

            board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} />);
        }
    }

    return (
        <>
            <div
                onMouseDown={e => grabPiece(e)}
                onMouseMove={e => movePiece(e)}
                onMouseUp={e => dropPiece(e)}
                id="chessboard"
                ref={chessboardRef}
            >
                {board}
            </div>
        </>
    );
}