import { useEffect, useRef, useState } from "react";
import { PieceType, TeamType, initialBoardState, samePosition } from "../../Constants";
import Chessboard from "../Chessboard/Chessboard";
import { getPossiblePawnMoves, pawnMove } from "../../referee/rules/PawnRules";
import { getPossibleRookMoves, rookMove } from "../../referee/rules/RookRules";
import { getPossibleKnightMoves, knightMove } from "../../referee/rules/KnightRules";
import { bishopMove, getPossibleBishopMoves } from "../../referee/rules/BishopRules";
import { getPossibleQueenMoves, queenMove } from "../../referee/rules/QueenRules";
import { getPossibleKingMoves, kingMove } from "../../referee/rules/Kingrules";
import { Piece, Position } from "../../models";

export default function Referee() {
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        updatePossibleMoves();
    }, [])

    function updatePossibleMoves() {
        setPieces((currentPieces) => {
            return currentPieces.map(p => {
                p.possibleMoves = getValidMoves(p, currentPieces);
                return p;
            });
        });
    }
    function playMove(playedPiece: Piece, destination: Position): boolean {
        const enPassantMove = isEnPassantMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.team,
        );

        const validMove = isValidMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.team,
        );

        const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

        if (enPassantMove) {
            const updatedPieces = pieces.reduce((results, piece) => {
                if (samePosition(piece.position, playedPiece.position)) {
                    piece.enPassant = false;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    results.push(piece);
                } else if (!samePosition(piece.position, new Position( destination.x, destination.y - pawnDirection ))) {
                    if (piece.type === PieceType.PAWN) {
                        piece.enPassant = false;
                    }
                    results.push(piece);
                }

                return results;
            }, [] as Piece[])

            setPieces(updatedPieces);

        } else if (validMove) {
            // UPDATES PIECE POSITION
            // If piece is attacked, it is removed
            const updatedPieces = pieces.reduce((results, piece) => {
                if (samePosition(piece.position, playedPiece.position)) {
                    // SPECIAL MOVE 
                    piece.enPassant =
                        Math.abs(playedPiece.position.y - destination.y) === 2 &&
                        piece.type === PieceType.PAWN;

                    piece.position.x = destination.x;
                    piece.position.y = destination.y;

                    let promotionRow = piece.team === TeamType.OUR ? 7 : 0;
                    if (destination.y === promotionRow && piece.type === PieceType.PAWN) {
                        modalRef.current?.classList.remove("hidden");
                        setPromotionPawn(piece);
                    }

                    results.push(piece);
                } else if (!samePosition(piece.position, new Position( destination.x, destination.y ))) {
                    if (piece.type === PieceType.PAWN) {
                        piece.enPassant = false;
                    }
                    results.push(piece);
                }

                return results;
            }, [] as Piece[]);

            setPieces(updatedPieces);
        } else {
            return false;
        }
        return true;
    }

    function isValidMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType,
        team: TeamType,
    ) {
        let validMove = false;
        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, pieces)
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, pieces)
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, pieces)
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, pieces)
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, pieces)
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, pieces)
                break;
        }
        return validMove;
    }

    function isEnPassantMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType,
        team: TeamType,
    ) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if (type === PieceType.PAWN) {
            if ((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection) {
                const piece = pieces.find(p => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant);
                if (piece) {
                    return true;
                }
            }
        }
        return false;
    }

    function getValidMoves(
        piece: Piece,
        boardState: Piece[]
    ): Position[] {
        switch (piece.type) {
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, boardState);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, boardState);
            case PieceType.KING:
                return getPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }

    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) {
            return;
        }
        const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, promotionPawn.position)) {
                piece.type = pieceType;
                const teamType = (piece.team === TeamType.OUR) ? "w" : "b";
                switch (piece.type) {
                    case 'bishop':
                        piece.image = `assets/images/bishop_${teamType}.png`;
                        break;
                    case 'knight':
                        piece.image = `assets/images/knight_${teamType}.png`;
                        break;
                    case 'rook':
                        piece.image = `assets/images/rook_${teamType}.png`;
                        break;
                    case 'queen':
                        piece.image = `assets/images/queen_${teamType}.png`;
                        break;
                    default:
                        break;
                }
            }
            results.push(piece);
            return results;
        }, [] as Piece[])

        setPieces(updatedPieces);

        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return promotionPawn?.team === TeamType.OUR ? "w" : "b";
    }

    return (
        <>
            <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
                <div className="modal-body">
                    <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`} />
                </div>
            </div>
            <Chessboard updatePossibleMoves={updatePossibleMoves}
                playMove={playMove}
                pieces={pieces} />
        </>
    )
}