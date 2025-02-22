"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress as ShadProgress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import ChessBoard from "./ChessBoard";
import { loadProgress, saveProgress, Progress, PuzzleAttempt } from "../lib/storage";
import { Chess, Move } from "chess.js";
import { Puzzle } from "@/app/types";
import { toast } from "sonner";

export default function PuzzleTrainer() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [chess, setChess] = useState<Chess | null>(null);
  const [moveIndex, setMoveIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>("");
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [userColor, setUserColor] = useState<"white" | "black">("white");

  // Load puzzles
  useEffect(() => {
    fetch("/puzzles.json")
      .then((res) => res.json())
      .then((data: Puzzle[]) => setPuzzles(data))
      .catch((err) => console.error("Error loading puzzles:", err));
  }, []);

  // Initialize chess, timer, and user's color when puzzles or current index changes
  useEffect(() => {
    if (puzzles.length > 0) {
      const currentPuzzle = puzzles[progress.currentIndex];
      const initialChess = new Chess(currentPuzzle.fen);

      // Compute starting turn from the FEN (the FEN format is "FEN ... turn castling ...")
      const startingTurn = currentPuzzle.fen.split(" ")[1]; // "w" or "b"
      // Since we auto-play the opponent's move (solution[0]), the user's color is opposite.
      const calculatedUserColor = startingTurn === "w" ? "black" : "white";
      setUserColor(calculatedUserColor);

      // Auto-play opponent's first move (solution[0])
      initialChess.move(currentPuzzle.solution[0]);
      setChess(initialChess);
      // Set moveIndex to 1 so the user's expected move is solution[1]
      setMoveIndex(1);
      setTimer(0);
      if (timerInterval) clearInterval(timerInterval);
      const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
      setTimerInterval(interval);
      setFeedbackMsg("");
      return () => clearInterval(interval);
    }
  }, [progress.currentIndex, puzzles]);

  // Persist progress
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  if (puzzles.length === 0) {
    return <div className="p-4">Loading puzzles...</div>;
  }

  const currentPuzzle = puzzles[progress.currentIndex];
  const solution: { from: string; to: string }[] = currentPuzzle.solution.map((move) => ({
    from: move.slice(0, 2),
    to: move.slice(2, 4),
  }));

  const onMove = (move: Move | null): void => {
    if (!move) {
      setFeedbackMsg("Invalid move.");
      return;
    }
    // Compare user move to the expected move (starting at index 1)
    if (move.from === solution[moveIndex].from && move.to === solution[moveIndex].to) {
      const newChess = new Chess(chess!.fen());
      newChess.move(move);
      setChess(newChess);
      setMoveIndex(moveIndex + 1);
      if (moveIndex + 1 < solution.length) {
        // After a short delay, automatically play the opponent's move (if exists)
        setTimeout(() => {
          const appMove = solution[moveIndex + 1];
          newChess.move(appMove);
          setChess(new Chess(newChess.fen()));
          // Increment move index by one more to expect the next user move
          setMoveIndex((prev) => prev + 1);
          setFeedbackMsg("");
        }, 500);
      } else {
        // Puzzle complete logic
        toast("Puzzle solved!", { style: { backgroundColor: "green", color: "white" } });

        clearInterval(timerInterval!);
        const attempt: PuzzleAttempt = { cycle: progress.currentCycle, time: timer, success: true };
        const puzzleId = currentPuzzle.id;
        setProgress((prev) => {
          const newPuzzleAttempts = { ...prev.puzzleAttempts };
          if (!newPuzzleAttempts[puzzleId]) newPuzzleAttempts[puzzleId] = [];
          newPuzzleAttempts[puzzleId].push(attempt);
          const nextIndex = prev.currentIndex + 1;
          const nextCycle = nextIndex >= puzzles.length ? prev.currentCycle + 1 : prev.currentCycle;
          const newIndex = nextIndex >= puzzles.length ? 0 : nextIndex;
          return {
            ...prev,
            puzzleAttempts: newPuzzleAttempts,
            currentIndex: newIndex,
            currentCycle: nextCycle,
            completedCycles: nextIndex >= puzzles.length ? prev.currentCycle : prev.completedCycles,
          };
        });
      }
    } else {
      setFeedbackMsg("Incorrect move. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-fit">
      {/* Main Board Area */}
      <div className="flex-1 p-5">
        <Card className="p-10">
          {chess && (
            <ChessBoard
              fen={chess.fen()}
              onMove={onMove}
              boardWidth={650}
              boardOrientation={userColor}
            />
          )}
          <div className="mt-4 space-y-2">
            <ShadProgress value={(progress.currentIndex / puzzles.length) * 100} />
            <p className="text-lg">Timer: {timer}s</p>
            <p className="text-sm">
              Cycle: {progress.currentCycle} | Puzzle: {progress.currentIndex + 1} /{" "}
              {puzzles.length}
            </p>
            {feedbackMsg && <p className="text-lg text-red-500">{feedbackMsg}</p>}
          </div>
        </Card>
      </div>

      {/* Sidebar (Desktop) */}
      <div className="w-100 p-4 hidden md:block">
        <ScrollArea className="h-[calc(100vh-2rem)]">
          {puzzles.map((puzzle, idx) => {
            const attempts = progress.puzzleAttempts[puzzle.id] || [];
            const currentAttempt = attempts.find((a) => a.cycle === progress.currentCycle);
            const status =
              idx === progress.currentIndex
                ? "Current"
                : currentAttempt
                ? currentAttempt.success
                  ? "Solved"
                  : "Failed"
                : "Unsolved";
            return (
              <Card key={puzzle.id} className="p-2 mb-2">
                <div className="flex justify-between items-center">
                  <span>
                    {puzzle.id} ({puzzle.rating})
                  </span>
                  <Badge>{status}</Badge>
                </div>
                <div className="mt-1">
                  {puzzle.themes.map((theme) => (
                    <Badge key={theme} variant="secondary" className="mr-1">
                      {theme}
                    </Badge>
                  ))}
                </div>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setShowSolutions((prev) => ({
                        ...prev,
                        [puzzle.id]: !prev[puzzle.id],
                      }))
                    }
                  >
                    {showSolutions[puzzle.id] ? "Hide Solution" : "Show Solution"}
                  </Button>
                  {showSolutions[puzzle.id] && (
                    <ul className="mt-2 list-disc pl-5 text-sm">
                      {puzzle.solution.map((move, i) => (
                        <li key={i}>{move}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            );
          })}
        </ScrollArea>
      </div>

      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden fixed bottom-4 right-4">
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <ScrollArea className="h-full">
            {puzzles.map((puzzle, idx) => {
              const attempts = progress.puzzleAttempts[puzzle.id] || [];
              const currentAttempt = attempts.find((a) => a.cycle === progress.currentCycle);
              const status =
                idx === progress.currentIndex
                  ? "Current"
                  : currentAttempt
                  ? currentAttempt.success
                    ? "Solved"
                    : "Failed"
                  : "Unsolved";
              return (
                <Card key={puzzle.id} className="p-2 mb-2">
                  <div className="flex justify-between">
                    <span>
                      {puzzle.id} ({puzzle.rating})
                    </span>
                    <Badge>{status}</Badge>
                  </div>
                  <div className="mt-1">
                    {puzzle.themes.map((theme) => (
                      <Badge key={theme} variant="secondary" className="mr-1">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </Card>
              );
            })}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
