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

            board.push(<Tile image={image} number={number} />);
        }
    }

    return <div id="chessboard">
        {board}
    </div>;
}