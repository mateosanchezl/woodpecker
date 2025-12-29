# Chess Puzzle Trainer

# LAUNCHED!
## I recently launched [Peck Chess](https://peckchess.com), a deployed version of what this app aimed to deliver with many more features and a more polished experience!

This is a chess puzzle trainer application built with Next.js and shadcn/ui. It implements the **Woodpecker Method**, a technique designed to improve chess skills by repeatedly solving a set of puzzles. The app adopts a local-first approach, storing all progress data in the browser's local storage, making it easy to use without requiring a backend server.

## Features

- Loads chess puzzles from a local JSON file (`public/puzzles.json`).
- Uses `react-chessboard` for an interactive chess interface and `chess.js` for game logic.
- Persists progress data in local storage, including:
  - Current puzzle index
  - Number of cycles completed
  - Time taken for each puzzle attempt
- Displays a main board area with:
  - A chessboard for solving puzzles
  - Progress indicators
  - A timer
  - Toast notifications for feedback on moves
- Includes a sidebar with:
  - A list of puzzles
  - Status indicators (e.g., "Solved", "Failed", "Unsolved")
  - Puzzle themes and ratings

## Prerequisites

To run the app locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (version 6 or higher)

## Installation

Follow these steps to set up the app on your local machine:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/chess-puzzle-trainer.git
   ```

   Replace `yourusername` with the actual GitHub username or repository URL.

2. **Navigate to the project directory**:

   ```bash
   cd chess-puzzle-trainer
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the App

Once the installation is complete, you can start the app with the following steps:

- **Start the development server**:

  ```bash
  npm run dev
  ```

- **Access the app**:
  Open your browser and go to `http://localhost:3000`.

The app should now be running locally, and you can start solving chess puzzles!

## Puzzles Data

The app loads puzzles from a file located at `public/puzzles.json`. This file contains an array of puzzle objects, each with the following structure:

- `id`: Unique identifier for the puzzle.
- `fen`: FEN string representing the starting chess position.
- `solution`: Array of moves in algebraic notation (e.g., `["e2e4", "e7e5"]`).
- `rating`: Difficulty rating of the puzzle.
- `popularity`: Popularity score of the puzzle.
- `themes`: Array of themes or tags (e.g., `["fork", "middlegame"]`).
- `cyclesCompleted`: Number of times the puzzle has been solved in a cycle.
- `times`: Array of times taken to solve the puzzle in each attempt.

You can edit this file to add, remove, or modify puzzles as desired.

## Technology Stack

The app is built using the following technologies:

- [Next.js](https://nextjs.org/): React framework for building the app.
- [TypeScript](https://www.typescriptlang.org/): Type safety for JavaScript.
- [Tailwind CSS](https://tailwindcss.com/): Styling the app.
- [shadcn/ui](https://ui.shadcn.com/): Pre-built, customizable UI components.
- [react-chessboard](https://www.npmjs.com/package/react-chessboard): Chessboard visualization.
- [chess.js](https://github.com/jhlywa/chess.js): Chess logic and move validation.

## Resetting Progress

Since progress is stored in local storage, you can reset it by clearing the relevant data:

- Open your browser's developer tools (e.g., press `F12`).
- Go to the **Application** tab.
- Under **Local Storage**, find and delete the entry for `chessPuzzleProgress`.

Alternatively, run this command in the browser console:

```javascript
localStorage.removeItem("chessPuzzleProgress");
```

## License

This project is licensed under the MIT License.

---

This README provides a clear explanation of what the chess puzzle trainer app does—helping users improve their chess skills using the Woodpecker Method—and detailed instructions for running it locally. It also includes additional helpful information about the app's features, data structure, and technology stack.
