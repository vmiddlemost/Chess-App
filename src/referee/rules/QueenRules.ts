import { Piece, Position, TeamType } from "../../Constants";
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
