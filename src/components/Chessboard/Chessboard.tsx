import Tile from '../Tile/Tile';
import './Chessboard.css';

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface Piece
{
    image: string
    horizontalPosition: number
    verticalPosition: number
}

const pieces: Piece[] = [];

pieces.push({ image: "assets/images/pawn_b.png", horizontalPosition: 0, verticalPosition: 1});

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
                if (p.horizontalPosition === i && p.verticalPosition == j)
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