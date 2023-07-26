import { Piece, Position, TeamType } from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";
import { bishopMove } from "./BishopRules";
import { rookMove } from "./RookRules"

export const queenMove = (
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
): boolean =>
{
    // as the Queen simply has the exact same movement/attacking options as both the Rooks and the Bishops,
    // this method just calls the rookMove and bishopMove method
    if (rookMove(initialPosition, desiredPosition, team, boardState))
    {
        return true;
    }
    else if (bishopMove(initialPosition, desiredPosition, team, boardState))
    {
        return true;
    }
    else
    {
        return false;
    }
}
export const getPossibleQueenMoves = (
    queen: Piece,
    boardState: Piece[]
    ): Position[] =>
{
    const possibleMoves: Position[] = [];

    // TOP possible moves
    for (let i = 1; i < 8; i++)
    {
        const destination: Position = {x: queen.position.x, y: queen.position.y + i}
        
        if (!tileIsOccupied(
            queen.position.x,
            queen.position.y + i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            queen.position.x,
            queen.position.y + i,
            boardState,
            queen.team
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
    for (let i = 1; i < 8; i++)
    {
        const destination: Position = {x: queen.position.x, y: queen.position.y - i}
        
        if (!tileIsOccupied(
            queen.position.x,
            queen.position.y - i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            queen.position.x,
            queen.position.y - i,
            boardState,
            queen.team))
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
    for (let i = 1; i < 8; i++)
    {
        const destination: Position = {x: queen.position.x + i, y: queen.position.y}
        
        if (!tileIsOccupied(
            queen.position.x + i,
            queen.position.y,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            queen.position.x + i,
            queen.position.y,
            boardState,
            queen.team))
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
    for (let i = 1; i < 8; i++)
    {
        const destination: Position = {x: queen.position.x - i, y: queen.position.y}
        
        if (!tileIsOccupied(
            queen.position.x - i,
            queen.position.y,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            queen.position.x - i,
            queen.position.y,
            boardState,
            queen.team))
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
    for (let i = 1; i < 8; i++)
    {
        const destination: Position = {x: queen.position.x + i, y: queen.position.y + i}

        if (!tileIsOccupied(
            queen.position.x + i,
            queen.position.y + i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            queen.position.x + i,
            queen.position.y + i,
            boardState,
            queen.team))
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
        const destination: Position = {x: queen.position.x - i, y: queen.position.y - i}

        if (!tileIsOccupied(
            queen.position.x - i,
            queen.position.y - i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            queen.position.x - i,
            queen.position.y - i,
            boardState,
            queen.team))
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
        const destination: Position = {x: queen.position.x - i, y: queen.position.y + i}

        if (!tileIsOccupied(
            queen.position.x - i,
            queen.position.y + i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            queen.position.x - i,
            queen.position.y + i,
            boardState,
            queen.team))
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
        const destination: Position = {x: queen.position.x + i, y: queen.position.y - i}

        if (!tileIsOccupied(
            queen.position.x + i,
            queen.position.y - i,
            boardState))
        {
            possibleMoves.push(destination);
        }
        else if (tileIsOccupiedByOpponent(
            queen.position.x + i,
            queen.position.y - i,
            boardState,
            queen.team))
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
