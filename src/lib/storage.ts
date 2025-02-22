export interface PuzzleAttempt {
  cycle: number;
  time: number;
  success: boolean;
}

export interface Progress {
  completedCycles: number;
  currentCycle: number;
  currentIndex: number;
  puzzleAttempts: Record<string, PuzzleAttempt[]>;
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem("chessPuzzleProgress", JSON.stringify(progress));
}

export function loadProgress(): Progress {
  const progress = localStorage.getItem("chessPuzzleProgress");
  return progress
    ? JSON.parse(progress)
    : {
        completedCycles: 0,
        currentCycle: 0,
        currentIndex: 0,
        puzzleAttempts: {},
      };
}

export function resetProgress(): void {
  localStorage.removeItem("chessPuzzleProgress");
}
