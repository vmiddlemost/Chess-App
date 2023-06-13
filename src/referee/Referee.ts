import { PieceType, TeamType, Piece } from "../components/Chessboard/Chessboard";

export default class Referee
{
    tileIsOccupied(
        xPosition: number, 
        yPosition: number, 
        boardstate: Piece[]
        ): boolean
        {
            const piece = boardstate.find(p => p.xPosition === xPosition && p.yPosition === yPosition)

            if (piece)
            {
                return true;
            } else {
                return false;
            }
        }

    isValidMove(
        previousXPosition: number, 
        previousYPosition: number, 
        xPosition: number, 
        yPosition: number, 
        type: PieceType, 
        team: TeamType,
        boardState: Piece[]
        )
    {
        // PAWN RULES
        if (type === PieceType.PAWN)
        {
            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

            if (previousXPosition === xPosition && previousYPosition === specialRow && yPosition - previousYPosition === 2*pawnDirection)
            {
                if (!this.tileIsOccupied(xPosition, yPosition, boardState) && !this.tileIsOccupied(xPosition, yPosition - pawnDirection, boardState))
                {
                    return true;
                }
            } else if (previousXPosition === xPosition && yPosition - previousYPosition === pawnDirection) 
            {
                if (!this.tileIsOccupied(xPosition, yPosition, boardState))
                {
                    return true;
                } 
            }
        }

        return false;
    }
}