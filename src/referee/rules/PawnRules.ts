import { Position, TeamType, Piece } from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const pawnMove = (
    initialPosition: Position, 
    desiredPosition: Position, 
    team: TeamType, 
    boardState: Piece[]
): boolean =>
{    
    // create variables to work out which side is moving (pawnDirection = 1 if white, -1 if black)
    // specialRow is when the pawns are on the initial row, meaning they can move 2 spaces
    const specialRow = (team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

    // MOVEMENT LOGIC
    if (initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2 * pawnDirection)
    {
        // second if condition makes it so pawns cannot jump over pieces
        if (!tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState) 
        && !tileIsOccupied(desiredPosition.x, desiredPosition.y - pawnDirection, boardState))
        {
            return true;
        }
    }
    else if (initialPosition.x === desiredPosition.x 
        && desiredPosition.y - initialPosition.y === pawnDirection) 
    {
        if (!tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
        {
            return true;
        } 
    }
    // ATTACKING LOGIC
    else if (desiredPosition.x - initialPosition.x === -1 
        && desiredPosition.y - initialPosition.y === pawnDirection)
    {
        // taking to diagonally left
        if (tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
        {
            return true;
        }
    }
    else if (desiredPosition.x - initialPosition.x === 1 
        && desiredPosition.y - initialPosition.y === pawnDirection)
    {
        // taking diagonally right
        if (tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
        {
            return true;
        }
    }
    return false;
}

export const getPossiblePawnMoves = (
    pawn: Piece,
    boardState: Piece[],
): Position[] =>
{
    const possibleMoves: Position[] = [];
    const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;
    const specialRow = pawn.team === TeamType.OUR ? 1 : 6;

    if (!tileIsOccupied(
        pawn.position.x,
        pawn.position.y + pawnDirection, 
        boardState))
    {
        possibleMoves.push({x: pawn.position.x, y: pawn.position.y + pawnDirection});

        if (pawn.position.y === specialRow && !tileIsOccupied(pawn.position.x, pawn.position.y + pawnDirection * 2, boardState))
        {
            possibleMoves.push({x: pawn.position.x, y: pawn.position.y + pawnDirection * 2});
        }
    }
    

    return possibleMoves;
}