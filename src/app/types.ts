// types.d.ts
export interface Puzzle {
  id: string;
  fen: string;
  solution: string[];
  rating: number;
  popularity: number;
  themes: string[];
  cyclesCompleted: number;
  times: number[] | null;
}
