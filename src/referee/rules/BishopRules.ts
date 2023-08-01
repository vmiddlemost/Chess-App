import { TeamType } from "../../Constants";
import { Piece, Position } from "../../models";
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
export const getPossibleBishopMoves = (
    bishop: Piece,
    boardState: Piece[]
    ): Position[] =>
{
    const possibleMoves: Position[] = [];

    // TOP RIGHT possible moves
    for (let i = 1; i < 8; i++)
    {
        const destination = new Position( bishop.position.x + i, bishop.position.y + i)

        if (!tileIsOccupied(
            bishop.position.x + i,
            bishop.position.y + i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            bishop.position.x + i,
            bishop.position.y + i,
            boardState,
            bishop.team))
        {
            possibleMoves.push(destination);
            break;
        }
        else
        {
            break;
        }
    }

    // BOTTOM LEFT possible moves
    for (let i = 1; i < 8; i++)
    {
        const destination = new Position( bishop.position.x - i, bishop.position.y - i)

        if (!tileIsOccupied(
            bishop.position.x - i,
            bishop.position.y - i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            bishop.position.x - i,
            bishop.position.y - i,
            boardState,
            bishop.team))
        {
            possibleMoves.push(destination);
            break;
        }
        else
        {
            break;
        }
    }

    // TOP LEFT possible moves
    for (let i = 1; i < 8; i++)
    {
        const destination = new Position( bishop.position.x - i, bishop.position.y + i)

        if (!tileIsOccupied(
            bishop.position.x - i,
            bishop.position.y + i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            bishop.position.x - i,
            bishop.position.y + i,
            boardState,
            bishop.team))
        {
            possibleMoves.push(destination);
            break;
        }
        else
        {
            break;
        }
    }

    // BOTTOM RIGHT possible moves
    for (let i = 1; i < 8; i++)
    {
        const destination = new Position( bishop.position.x + i, bishop.position.y - i)

        if (!tileIsOccupied(
            bishop.position.x + i,
            bishop.position.y - i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            bishop.position.x + i,
            bishop.position.y - i,
            boardState,
            bishop.team))
        {
            possibleMoves.push(destination);
            break;
        }
        else
        {
            break;
        }
    }

    return possibleMoves;
}