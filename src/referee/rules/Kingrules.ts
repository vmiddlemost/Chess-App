import { Piece, Position, TeamType } from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const kingMove = (
    initialPosition: Position, 
    desiredPosition: Position, 
    team: TeamType, 
    boardState: Piece[]
): boolean =>
{
    if ((Math.abs(initialPosition.x - desiredPosition.x) === 0 && Math.abs(initialPosition.y - desiredPosition.y) === 1)
    || (Math.abs(initialPosition.x - desiredPosition.x) === 1 && Math.abs(initialPosition.y - desiredPosition.y) === 0)
    || (Math.abs(initialPosition.x - desiredPosition.x) === 1 && Math.abs(initialPosition.y - desiredPosition.y) === 1))
    {
        if (!tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
        {
            return true;
        }
        // ATTACKING LOGIC
        else if (tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
        {
            return true;
        }
    }
    return false;
}