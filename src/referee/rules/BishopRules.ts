import { Piece, Position, TeamType } from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const bishopMove = (
    initialPosition: Position, 
    desiredPosition: Position, 
    team: TeamType, 
    boardState: Piece[]
): boolean =>
{
    // MOVEMENT RULES (\ DIRECTION)
    if (initialPosition.x + initialPosition.y === desiredPosition.x + desiredPosition.y)
    {
        let direction = (desiredPosition.y < initialPosition.y) ? -1 : 1;

        for (let i = 1; i <= Math.abs(desiredPosition.y - initialPosition.y) - 1; i++)
        {
            if (tileIsOccupied(initialPosition.x - (i * direction), initialPosition.y + (i * direction), boardState))
            {
                return false;
            } 
        }
        if (!tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
        {
            return true;
        }
        // ATTACKING LOGIC (\ DIRECTION)
        else if (tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
        {
            return true;
        }
    }
    // MOVEMENT RULES (/ DIRECTION)
    else if (initialPosition.x - desiredPosition.x === initialPosition.y - desiredPosition.y)
    {
        let direction = (desiredPosition.y < initialPosition.y) ? -1 : 1;

        for (let i = 1; i <= Math.abs(desiredPosition.y - initialPosition.y) - 1; i++)
        {
            if (tileIsOccupied(initialPosition.x + (i * direction), initialPosition.y + (i * direction), boardState))
            {
                return false;
            } 
        }
        if (!tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
        {
            return true;
        }
        // ATTACKING LOGIC (/ DIRECTION)
        else if (tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
        {
            return true;
        }
    }
    return false;
}