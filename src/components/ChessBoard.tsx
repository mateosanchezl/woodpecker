import { Chessboard } from "react-chessboard";
import { Chess, Move } from "chess.js";

interface ChessBoardProps {
  fen: string;
  onMove: (move: Move | null) => void;
  boardWidth?: number;
  boardOrientation?: "white" | "black";
}

export default function ChessBoard({
  fen,
  onMove,
  boardWidth = 1000,
  boardOrientation = "white",
}: ChessBoardProps) {
  const chess = new Chess(fen);

  const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
    try {
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      onMove(move);
      return true;
    } catch (error) {
      onMove(null);
      return false;
    }
  };

  return (
    <Chessboard
      position={fen}
      onPieceDrop={onDrop}
      boardWidth={boardWidth}
      boardOrientation={boardOrientation}
    />
  );
}
