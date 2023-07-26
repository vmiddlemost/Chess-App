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
export const getPossibleKingMoves = (
    king: Piece,
    boardState: Piece[]
    ): Position[] =>
{
    const possibleMoves: Position[] = [];

        // TOP possible moves
    for (let i = 1; i < 2; i++)
    {
        const destination: Position = {x: king.position.x, y: king.position.y + i}
        
        if (!tileIsOccupied(
            king.position.x,
            king.position.y + i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            king.position.x,
            king.position.y + i,
            boardState,
            king.team
        ))
        {
            possibleMoves.push(destination);
            break;
        }
        else
        {
            break;
        }
    }

    // BOTTOM possible moves
    for (let i = 1; i < 2; i++)
    {
        const destination: Position = {x: king.position.x, y: king.position.y - i}
        
        if (!tileIsOccupied(
            king.position.x,
            king.position.y - i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            king.position.x,
            king.position.y - i,
            boardState,
            king.team))
        {
            possibleMoves.push(destination);
            break;
        }
        else
        {
            break;
        }
    }

    // RIGHT possible moves
    for (let i = 1; i < 2; i++)
    {
        const destination: Position = {x: king.position.x + i, y: king.position.y}
        
        if (!tileIsOccupied(
            king.position.x + i,
            king.position.y,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            king.position.x + i,
            king.position.y,
            boardState,
            king.team))
        {
            possibleMoves.push(destination);
            break;
        }
        else
        {
            break;
        }
    }

    // LEFT possible moves
    for (let i = 1; i < 2; i++)
    {
        const destination: Position = {x: king.position.x - i, y: king.position.y}
        
        if (!tileIsOccupied(
            king.position.x - i,
            king.position.y,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            king.position.x - i,
            king.position.y,
            boardState,
            king.team))
        {
            possibleMoves.push(destination);
            break;
        }
        else
        {
            break;
        }
    }

        // TOP RIGHT possible moves
    for (let i = 1; i < 2; i++)
    {
        const destination: Position = {x: king.position.x + i, y: king.position.y + i}

        if (!tileIsOccupied(
            king.position.x + i,
            king.position.y + i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            king.position.x + i,
            king.position.y + i,
            boardState,
            king.team))
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
    for (let i = 1; i < 2; i++)
    {
        const destination: Position = {x: king.position.x - i, y: king.position.y - i}

        if (!tileIsOccupied(
            king.position.x - i,
            king.position.y - i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            king.position.x - i,
            king.position.y - i,
            boardState,
            king.team))
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
    for (let i = 1; i < 2; i++)
    {
        const destination: Position = {x: king.position.x - i, y: king.position.y + i}

        if (!tileIsOccupied(
            king.position.x - i,
            king.position.y + i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            king.position.x - i,
            king.position.y + i,
            boardState,
            king.team))
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
    for (let i = 1; i < 2; i++)
    {
        const destination: Position = {x: king.position.x + i, y: king.position.y - i}

        if (!tileIsOccupied(
            king.position.x + i,
            king.position.y - i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            king.position.x + i,
            king.position.y - i,
            boardState,
            king.team))
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