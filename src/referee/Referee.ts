import { PieceType, TeamType, Piece, Position } from "../Constants";

export default class Referee
{
    tileIsOccupied(
        xPosition: number, 
        yPosition: number, 
        boardstate: Piece[]
        ): boolean
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

    tileIsOccupiedByOpponent(
        xPosition: number,
        yPosition: number,
        boardState: Piece[],
        team: TeamType
        ): boolean
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

    isEnPassantMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType, 
        team: TeamType,
        boardState: Piece[]
        )
    {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;
        
        if (type === PieceType.PAWN)
        {
            if ((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection)
            {
                const piece = boardState.find(p => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant);
                if (piece)
                {
                    return true;
                }
            }
        }
        return false;
    }

    isValidMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType, 
        team: TeamType,
        boardState: Piece[]
        )
    {
        // PAWN RULES
        if (type === PieceType.PAWN)
        {    
            // create variables to work out which side is moving (pawnDirection = 1 if white, -1 if black)
            // specialRow is when the pawns are on the initial row, meaning they can move 2 spaces
            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

            // MOVEMENT LOGIC
            if (initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2 * pawnDirection)
            {
                // second if condition makes it so pawns cannot jump over pieces
                if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState) 
                && !this.tileIsOccupied(desiredPosition.x, desiredPosition.y - pawnDirection, boardState))
                {
                    return true;
                }
            }
            else if (initialPosition.x === desiredPosition.x 
                && desiredPosition.y - initialPosition.y === pawnDirection) 
            {
                if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
                {
                    return true;
                } 
            }
            // ATTACKING LOGIC
            else if (desiredPosition.x - initialPosition.x === -1 
                && desiredPosition.y - initialPosition.y === pawnDirection)
            {
                // taking to diagonally left
                if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
                {
                    return true;
                }
            }
            else if (desiredPosition.x - initialPosition.x === 1 
                && desiredPosition.y - initialPosition.y === pawnDirection)
            {
                // taking diagonally right
                if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
                {
                    return true;
                }
            }
        } 
        // ROOK/QUEEN STRAIGHT RULES
        if (type === PieceType.ROOK
            || type === PieceType.QUEEN)
        {
            // VERTICAL MOVEMENT LOGIC
            if (initialPosition.x === desiredPosition.x 
                && initialPosition.y !== desiredPosition.y)
            {
                let direction = (desiredPosition.y < initialPosition.y) ? -1 : 1;

                for (let i = 1; i <= Math.abs(desiredPosition.y - initialPosition.y) - 1; i++)
                {
                    if (this.tileIsOccupied(desiredPosition.x, initialPosition.y + (i * direction), boardState))
                    {
                        return false;
                    } 
                }
                if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
                {
                    return true;
                }
                // VERTICAL ATTACKING LOGIC
                else if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
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
                    if (this.tileIsOccupied(initialPosition.x + (i * direction), desiredPosition.y, boardState))
                    {
                        return false;
                    } 
                }
                if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
                {
                    return true;
                }
                // HORIZONTAL ATTACKING LOGIC
                else if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
                {
                    return true;
                }
            }
        }
        // KNIGHT RULES
        if (type === PieceType.KNIGHT)
        {
            // MOVEMENT LOGIC
            if ((Math.abs(desiredPosition.x - initialPosition.x) === 1 && Math.abs(desiredPosition.y - initialPosition.y) === 2)
            || (Math.abs(desiredPosition.x - initialPosition.x) === 2 && Math.abs(desiredPosition.y - initialPosition.y) === 1))
            {
                // ATTACKING LOGIC
                if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
                {
                    return true;
                }
                else if (this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }
        // BISHOP/QUEEN DIAGONAL RULES
        if (type === PieceType.BISHOP
            || type === PieceType.QUEEN)
            {
                // MOVEMENT RULES (\ DIRECTION)
                if (initialPosition.x + initialPosition.y === desiredPosition.x + desiredPosition.y)
                {
                    let direction = (desiredPosition.y < initialPosition.y) ? -1 : 1;

                    for (let i = 1; i <= Math.abs(desiredPosition.y - initialPosition.y) - 1; i++)
                    {
                        if (this.tileIsOccupied(initialPosition.x - (i * direction), initialPosition.y + (i * direction), boardState))
                        {
                            return false;
                        } 
                    }
                    if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
                    {
                        return true;
                    }
                    // ATTACKING LOGIC (\ DIRECTION)
                    else if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
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
                        if (this.tileIsOccupied(initialPosition.x + (i * direction), initialPosition.y + (i * direction), boardState))
                        {
                            return false;
                        } 
                    }
                    if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
                    {
                        return true;
                    }
                    // ATTACKING LOGIC (/ DIRECTION)
                    else if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
                    {
                        return true;
                    }
                }
            }
            // KING RULES
            if (type === PieceType.KING)
            {
                if ((Math.abs(initialPosition.x - desiredPosition.x) === 0 && Math.abs(initialPosition.y - desiredPosition.y) === 1)
                || (Math.abs(initialPosition.x - desiredPosition.x) === 1 && Math.abs(initialPosition.y - desiredPosition.y) === 0)
                || (Math.abs(initialPosition.x - desiredPosition.x) === 1 && Math.abs(initialPosition.y - desiredPosition.y) === 1))
                {
                    if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState))
                    {
                        return true;
                    }
                    // ATTACKING LOGIC
                    else if (this.tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team))
                    {
                        return true;
                    }
                }
            }

        return false;
    }

}