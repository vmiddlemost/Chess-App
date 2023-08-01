import { TeamType } from "../../Constants";
import { Piece, Position } from "../../models";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const knightMove = (
    initialPosition: Position, 
    desiredPosition: Position, 
    team: TeamType, 
    boardState: Piece[]
): boolean =>
{
    // MOVEMENT LOGIC
    if ((Math.abs(desiredPosition.x - initialPosition.x) === 1 && Math.abs(desiredPosition.y - initialPosition.y) === 2)
    || (Math.abs(desiredPosition.x - initialPosition.x) === 2 && Math.abs(desiredPosition.y - initialPosition.y) === 1))
    {
        // ATTACKING LOGIC
        if (tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
        {
            return true;
        }
        else if (tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    return false;
}
export const getPossibleKnightMoves = (
    knight: Piece, 
    boardState: Piece[]
    ): Position[] => 
{
    const possibleMoves: Position[] = [];

    for (let i = -1; i < 2; i += 2)
    {
        for (let j = -1; j < 2; j += 2)
        {
            const verticalMove = new Position( knight.position.x + j, knight.position.y + (i * 2))
            const horizontalMove= new Position ( knight.position.x + (j * 2), knight.position.y + i)
            if (!tileIsOccupied(
                knight.position.x + j,
                knight.position.y + (i * 2),
                boardState))
                {
                    possibleMoves.push(verticalMove);
                }
            else if (tileIsOccupiedByOpponent(
                knight.position.x + j,
                knight.position.y + (i * 2),
                boardState,
                knight.team))
                {
                    possibleMoves.push(verticalMove);
                }
            if (!tileIsOccupied(
                knight.position.x + (j * 2),
                knight.position.y + i,
                boardState))
            {
                possibleMoves.push(horizontalMove);
            }
            else if (tileIsOccupiedByOpponent(
                knight.position.x + (j * 2),
                knight.position.y + i,
                boardState,
                knight.team))
                {
                    possibleMoves.push(horizontalMove);
                }
        }
    }

    return possibleMoves;
}