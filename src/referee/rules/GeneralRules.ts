import { TeamType } from "../../Constants";
import { Piece } from "../../models/Piece";

export const tileIsOccupied = (
    xPosition: number, 
    yPosition: number, 
    boardstate: Piece[]
    ): boolean =>
    {
        // tileIsOccupied is a method which scans through the array of all pieces currently on the board and
        // checks if the tile which the player wishes to move to is already occupied by one of these pieces,
        // returning true if it is occupied
        const piece = boardstate.find(p => p.position.x === xPosition && p.position.y === yPosition);

        if (piece)
        {
            return true;
        } else {
            return false;
        }
    }

export const tileIsOccupiedByOpponent = (
    xPosition: number,
    yPosition: number,
    boardState: Piece[],
    team: TeamType
    ): boolean =>
    {
        // tileIsOccupied is a method which scans through the array of all pieces currently on the board and
        // checks if the tile which the player wishes to move to is occupied by an OPPONENT'S piece,
        // returning true if it is occupied by an OPPONENT'S piece.
        // This method is only used for ATTACKING LOGIC, not movement.
        const piece = boardState.find((p) => p.position.x === xPosition && p.position.y === yPosition && p.team !== team);

        if (piece)
        {
            return true
        } else
        {
            return false
        }
    }