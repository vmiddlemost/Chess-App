import { useRef, useState } from 'react';
import Tile from '../Tile/Tile';
import './Chessboard.css';

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface Piece
{
    image: string
    xPosition: number
    yPosition: number
}

const pieces: Piece[] = [];


// pawns setup
for (let i = 0; i < 8; i++)
{
    pieces.push({ image: "assets/images/pawn_b.png", xPosition: i, yPosition: 6});
    pieces.push({ image: "assets/images/pawn_w.png", xPosition: i, yPosition: 1});
};
// rest of the pieces setup
for (let i = 0; i < 2; i++)
{
    const type = (i === 0) ? "b" : "w";
    const yPosition = (i === 0) ? 7 : 0;
    pieces.push({ image: `assets/images/rook_${type}.png`, xPosition: 0, yPosition});
    pieces.push({ image: `assets/images/rook_${type}.png`, xPosition: 7, yPosition});
    pieces.push({ image: `assets/images/knight_${type}.png`, xPosition: 1, yPosition});
    pieces.push({ image: `assets/images/knight_${type}.png`, xPosition: 6, yPosition});
    pieces.push({ image: `assets/images/bishop_${type}.png`, xPosition: 2, yPosition});
    pieces.push({ image: `assets/images/bishop_${type}.png`, xPosition: 5, yPosition});
    pieces.push({ image: `assets/images/queen_${type}.png`, xPosition: 3, yPosition});
    pieces.push({ image: `assets/images/king_${type}.png`, xPosition: 4, yPosition});
}



export default function Chessboard()
{
    // controller functions
    const chessboardRef = useRef<HTMLDivElement>(null);

    let activePiece: HTMLElement | null = null;

    function grabPiece(e: React.MouseEvent)
    {
        const element = e.target as HTMLElement;
        if (element.classList.contains("chess-piece"))
        {
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            activePiece = element;
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
        if(activePiece)
        {
            activePiece = null;
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
                if (p.xPosition === i && p.yPosition == j)
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