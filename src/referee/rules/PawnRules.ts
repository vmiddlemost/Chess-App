import { TeamType, samePosition, PieceType } from "../../Constants";
import { Piece, Position } from "../../models";
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
    boardState: Piece[]
): Position[] =>
{
    const possibleMoves: Position[] = [];
    const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;
    const specialRow = pawn.team === TeamType.OUR ? 1 : 6;

    const normalMove = new Position( pawn.position.x, pawn.position.y + pawnDirection)
    const specialMove = new Position( normalMove.x, normalMove.y + pawnDirection)
    const rightAttack = new Position( pawn.position.x + 1, pawn.position.y + pawnDirection)
    const leftAttack = new Position( pawn.position.x - 1, pawn.position.y + pawnDirection)
    const leftPosition = new Position( pawn.position.x - 1, pawn.position.y)
    const rightPosition = new Position( pawn.position.x + 1, pawn.position.y)

    // this chunk logs all of the possible NON-ATTACKING moves the pawn may use
    if (!tileIsOccupied(
        pawn.position.x,
        pawn.position.y + pawnDirection, 
        boardState))
    {
        possibleMoves.push(normalMove);

        if (pawn.position.y === specialRow 
            && !tileIsOccupied(
            pawn.position.x, 
            pawn.position.y + pawnDirection * 2, 
            boardState))
        {
            possibleMoves.push(specialMove);
        }
    }
    
    // these two chunks logs all of the possible ATTACKING moves the pawn may use
    if (tileIsOccupiedByOpponent(
        pawn.position.x + 1,
        pawn.position.y + pawnDirection,
        boardState,
        pawn.team
    ))
    {
        possibleMoves.push(rightAttack);
    } 
    else if (!tileIsOccupied(pawn.position.x + 1, pawn.position.y + pawnDirection, boardState))
    {
        const rightPiece = boardState.find(p => samePosition(p.position, rightPosition));
        if (rightPiece != null && rightPiece.type === PieceType.PAWN && rightPiece?.enPassant)
        {
            possibleMoves.push(rightAttack);
        }
    }

    if (tileIsOccupiedByOpponent(
        pawn.position.x -1,
        pawn.position.y + pawnDirection,
        boardState,
        pawn.team
    ))
    {
        possibleMoves.push(leftAttack);
    }
    else if (!tileIsOccupied(pawn.position.x - 1, pawn.position.y + pawnDirection, boardState))
    {
        const leftPiece = boardState.find(p => samePosition(p.position, leftPosition));
        if (leftPiece != null && leftPiece.type === PieceType.PAWN && leftPiece?.enPassant)
        {
            possibleMoves.push(leftAttack);
        }
    }


    return possibleMoves;
}