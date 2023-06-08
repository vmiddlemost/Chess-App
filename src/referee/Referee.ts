import { PieceType, TeamType } from "../components/Chessboard/Chessboard";

export default class Referee
{
    isValidMove(previousXPosition: number, previousYPosition: number, xPosition: number, yPosition: number, type: PieceType, team: TeamType)
    {

        // Pawn rules
        if (type === PieceType.PAWN)
        {
            if (team === TeamType.OUR)
            {
                if (previousYPosition === 1)
                {
                    // check if pawn is moved by either 1 or 2 spaces on first turn
                    if (previousXPosition === xPosition && (yPosition - previousYPosition === 1 || yPosition - previousYPosition === 2))
                    {
                        return true;
                    }
                } else {
                    // check if pawn has moved already, and if so only allow it to move 1 square up
                    if (previousXPosition === xPosition && yPosition - previousYPosition === 1)
                    {
                        return true;
                    }
                }
            }
        }


        return false;
    }
}