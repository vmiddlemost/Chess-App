import { PieceType, TeamType, Piece } from "../components/Chessboard/Chessboard";

export default class Referee
{
    tileIsOccupied(
        xPosition: number, 
        yPosition: number, 
        boardstate: Piece[]
        ): boolean
        {
            const piece = boardstate.find(p => p.xPosition === xPosition && p.yPosition === yPosition);

            if (piece)
            {
                return true;
            } else {
                return false;
            }
        }

    tileIsOccupiedByOpponent(
        xPosition: number,
        yPosition: number,
        boardState: Piece[],
        team: TeamType
        ): boolean
        {
            const piece = boardState.find((p) => p.xPosition === xPosition && p.yPosition === yPosition && p.team !== team);

            if (piece)
            {
                return true
            } else
            {
                return false
            }
        }

    isEnPassantMove(
        previousXPosition: number, 
        previousYPosition: number, 
        xPosition: number, 
        yPosition: number, 
        type: PieceType, 
        team: TeamType,
        boardState: Piece[]
        )
    {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;
        
        if (type === PieceType.PAWN)
        {
            if ((xPosition - previousXPosition === -1 || xPosition - previousXPosition === 1) && yPosition - previousYPosition === pawnDirection)
            {
                const piece = boardState.find(p => p.xPosition === xPosition && p.yPosition === yPosition - pawnDirection && p.enPassant);
                if (piece)
                {
                    return true;
                }
            }
        }
        return false;
    }

    isValidMove(
        previousXPosition: number, 
        previousYPosition: number, 
        xPosition: number, 
        yPosition: number, 
        type: PieceType, 
        team: TeamType,
        boardState: Piece[]
        )
    {
        // PAWN RULES
        if (type === PieceType.PAWN)
        {
            // console.log("x=",xPosition);
            // console.log("p_x=",previousXPosition);
            // console.log("y=",yPosition);
            // console.log("p_y=",previousYPosition);
            
            // create variables to work out which side is moving (pawnDirection = 1 if white, -1 if black)
            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

            // MOVEMENT LOGIC
            if (previousXPosition === xPosition && previousYPosition === specialRow && yPosition - previousYPosition === 2*pawnDirection)
            {
                if (!this.tileIsOccupied(xPosition, yPosition, boardState) && !this.tileIsOccupied(xPosition, yPosition - pawnDirection, boardState))
                {
                    return true;
                }
            } else if (previousXPosition === xPosition && yPosition - previousYPosition === pawnDirection) 
            {
                if (!this.tileIsOccupied(xPosition, yPosition, boardState))
                {
                    return true;
                } 
            }
            // ATTACKING LOGIC
            else if (xPosition - previousXPosition === -1 && yPosition - previousYPosition === pawnDirection)
            {
                // taking to diagonally left
                if (this.tileIsOccupiedByOpponent(xPosition, yPosition, boardState, team))
                {
                    return true;
                }
            }
            else if (xPosition - previousXPosition === 1 && yPosition - previousYPosition === pawnDirection)
            {
                // taking diagonally right
                if (this.tileIsOccupiedByOpponent(xPosition, yPosition, boardState, team))
                {
                    return true;
                }
            }
        } 

        return false;
    }
}