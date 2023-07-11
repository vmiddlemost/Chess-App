import { useRef, useState } from 'react';
import Tile from '../Tile/Tile';
import './Chessboard.css';
import Referee from '../../referee/Referee';
import { 
    HORIZONTAL_AXIS, 
    VERTICAL_AXIS, 
    GRID_SIZE,
    Piece, 
    PieceType, 
    TeamType, 
    initialBoardState, 
    Position, 
    samePosition
} from '../../Constants';


export default function Chessboard()
{
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabPosition, setGrabPosition] = useState<Position>({x: -1, y: -1});
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();

    // controller functions
    function updateValidMoves()
    {
        setPieces((currentPieces) => {
            return currentPieces.map(p => {
                p.possibleMoves = referee.getValidMoves(p, currentPieces);
                return p;
            });
        });
    }

    function grabPiece(e: React.MouseEvent)
    {
        updateValidMoves();
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard)
        {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))

            setGrabPosition({
                x: grabX, 
                y: grabY
            });

            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;
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
            const xPosition = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const yPosition = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));

            // log current piece location
            const currentPiece = pieces.find(p => 
                samePosition(p.position, grabPosition)
                );

            if (currentPiece)
            {
                const isEnPassantMove = referee.isEnPassantMove(
                    grabPosition,
                    {x: xPosition, y: yPosition},
                    currentPiece.type,
                    currentPiece.team,
                    pieces
                );
                const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

                const validMove = referee.isValidMove(
                    grabPosition,
                    {x: xPosition, y: yPosition},
                    currentPiece?.type, 
                    currentPiece.team, 
                    pieces
                    );

                if (isEnPassantMove)
                {
                    const updatedPieces = pieces.reduce((results, piece) => 
                    {
                        if (samePosition(piece.position, grabPosition))
                        {
                            piece.enPassant = false;
                            piece.position.x = xPosition;
                            piece.position.y = yPosition;
                            results.push(piece);
                        } else if (!samePosition(piece.position, { x: xPosition, y: yPosition - pawnDirection}))
                        {
                            if (piece.type === PieceType.PAWN)
                            {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }

                        return results;
                    }, [] as Piece[])

                    setPieces(updatedPieces);
                    
                } else if (validMove)
                {
                    // UPDATES PIECE POSITION
                    // If piece is attacked, it is removed
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, grabPosition))
                        {
                            // SPECIAL MOVE 
                            piece.enPassant = 
                                Math.abs(grabPosition.y - yPosition) === 2 && 
                                piece.type === PieceType.PAWN;
                            piece.position.x = xPosition;
                            piece.position.y = yPosition;
                            results.push(piece);
                        } else if (!samePosition(piece.position, {x: xPosition, y: yPosition}))
                        {
                            if (piece.type === PieceType.PAWN)
                            {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }

                        return results;
                    }, [] as Piece[]);

                    setPieces(updatedPieces);
                } else
                {
                    // RESETS PIECE POSITION
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

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--)
    {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++)
        {
            const number = j + i + 2;
            const piece = pieces.find(p => samePosition(p.position, {x: i, y: j}));
            let image = piece ? piece.image : undefined;

            let currentPiece = activePiece != null ? pieces.find(p => samePosition(p.position, grabPosition)) : undefined;
            let highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(p => samePosition(p, {x: i, y: j})) : false;

            board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight}/>);
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