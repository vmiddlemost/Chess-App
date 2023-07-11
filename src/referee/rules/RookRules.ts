import { Position, TeamType, Piece } from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";



export const rookMove = (
    initialPosition: Position, 
    desiredPosition: Position, 
    team: TeamType, 
    boardState: Piece[]
): boolean =>
{
    // VERTICAL MOVEMENT LOGIC
    if (initialPosition.x === desiredPosition.x 
        && initialPosition.y !== desiredPosition.y)
    {
        let direction = (desiredPosition.y < initialPosition.y) ? -1 : 1;

        for (let i = 1; i <= Math.abs(desiredPosition.y - initialPosition.y) - 1; i++)
        {
            if (tileIsOccupied(desiredPosition.x, initialPosition.y + (i * direction), boardState))
            {
                return false;
            } 
        }
        if (!tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
        {
            return true;
        }
        // VERTICAL ATTACKING LOGIC
        else if (tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
        {
            return true;
        }
    }
    else if (initialPosition.y === desiredPosition.y 
        && initialPosition.x !== desiredPosition.x)
        // HORIZONTAL MOVEMENT LOGIC
    {
        let direction = (desiredPosition.x < initialPosition.x) ? -1 : 1;

        for (let i = 1; i <= Math.abs(desiredPosition.x - initialPosition.x) - 1; i++)
        {
            if (tileIsOccupied(initialPosition.x + (i * direction), desiredPosition.y, boardState))
            {
                return false;
            } 
        }
        if (!tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
        {
            return true;
        }
        // HORIZONTAL ATTACKING LOGIC
        else if (tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
        {
            return true;
        }
    }
    return false;
}