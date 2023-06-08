import { useRef, useState } from 'react';
import Tile from '../Tile/Tile';
import './Chessboard.css';
import Referee from '../../referee/Referee';

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface Piece
{
    image: string;
    xPosition: number;
    yPosition: number;
    type: PieceType;
    team: TeamType;
}

export enum TeamType
{
    OPPONENT,
    OUR
}

export enum PieceType
{
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING
}

const initialBoardState: Piece[] = [];

// pawns setup
for (let i = 0; i < 8; i++)
{
    initialBoardState.push({ image: "assets/images/pawn_b.png", xPosition: i, yPosition: 6, type: PieceType.PAWN, team: TeamType.OPPONENT});
    initialBoardState.push({ image: "assets/images/pawn_w.png", xPosition: i, yPosition: 1, type: PieceType.PAWN, team: TeamType.OUR});
};
// rest of the pieces setup
for (let i = 0; i < 2; i++)
{
    const teamType = (i === 0) ? TeamType.OPPONENT : TeamType.OUR;
    const type = (i === TeamType.OPPONENT) ? "b" : "w";
    const yPosition = (i === TeamType.OPPONENT) ? 7 : 0;
    initialBoardState.push({ image: `assets/images/rook_${type}.png`, xPosition: 0, yPosition, type: PieceType.ROOK, team: teamType});
    initialBoardState.push({ image: `assets/images/rook_${type}.png`, xPosition: 7, yPosition, type: PieceType.ROOK, team: teamType});
    initialBoardState.push({ image: `assets/images/knight_${type}.png`, xPosition: 1, yPosition, type: PieceType.KNIGHT, team: teamType});
    initialBoardState.push({ image: `assets/images/knight_${type}.png`, xPosition: 6, yPosition, type: PieceType.KNIGHT, team: teamType});
    initialBoardState.push({ image: `assets/images/bishop_${type}.png`, xPosition: 2, yPosition, type: PieceType.BISHOP, team: teamType});
    initialBoardState.push({ image: `assets/images/bishop_${type}.png`, xPosition: 5, yPosition, type: PieceType.BISHOP, team: teamType});
    initialBoardState.push({ image: `assets/images/queen_${type}.png`, xPosition: 3, yPosition, type: PieceType.QUEEN, team: teamType});
    initialBoardState.push({ image: `assets/images/king_${type}.png`, xPosition: 4, yPosition, type: PieceType.KING, team: teamType});
}



export default function Chessboard()
{
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();

    // controller functions
    function grabPiece(e: React.MouseEvent)
    {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard)
        {
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)));
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent)
    {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard)
        {
            const minX = chessboard.offsetLeft - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const minY = chessboard.offsetTop - 25;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            // set position to "absolute" so it's positioned relative to its first ancestor element
            activePiece.style.position = "absolute";

            // if x is smaller than minimum amount, set position to min
            if (x < minX)
            {
                activePiece.style.left = `${minX}px`;
            // if x is bigger than maximum amount, set position to max
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            // if x is within the minimum and maximum, leave position as is
            } else {
                activePiece.style.left = `${x}px`;
            }

            // if y is smaller than minimum amount, set position to min
            if (y < minY)
            {
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

    function dropPiece(e: React.MouseEvent)
    {
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard)
        {
            const xPosition = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const yPosition = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

            // Updates the piece position
            setPieces ((value) => {
                const pieces = value.map(p => {
                    if (p.xPosition === gridX && p.yPosition === gridY)
                    {
                        const validMove = referee.isValidMove(gridX, gridY, xPosition, yPosition, p.type, p.team);

                        if (validMove)
                        {
                            p.xPosition = xPosition;
                            p.yPosition = yPosition;
                        } else {
                            activePiece.style.position = 'relative';
                            activePiece.style.removeProperty('top');
                            activePiece.style.removeProperty('left');
                        }

                    }
                    return p;
                });
                return pieces;
            })
            setActivePiece(null);
        }
    }

    // initilize the chessboard
    let board = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--)
    {
        for (let i = 0; i < horizontalAxis.length; i++)
        {
            const number = j + i + 2;
            let image = undefined;

            pieces.forEach(p => {
                if (p.xPosition === i && p.yPosition === j)
                {
                    image = p.image;
                }
            });

            board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
        }
    }

    return (
    <div 
        onMouseDown={e => grabPiece(e)} 
        onMouseMove={e => movePiece(e)} 
        onMouseUp={e => dropPiece(e)}
        id="chessboard"
        ref={chessboardRef}
    >
        {board}
    </div>
    );
}