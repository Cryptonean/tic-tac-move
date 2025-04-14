"use client";
import React, { JSX, useState } from "react";

const winningCombos: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diags
];

const checkWin = (board: (string | null)[], player: string): boolean => {
  return winningCombos.some((combo) =>
    combo.every((index) => board[index] === player)
  );
};

export default function MovableTicTacToe(): JSX.Element {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [xCount, setXCount] = useState(0);
  const [oCount, setOCount] = useState(0);

  const handleClick = (index: number): void => {
    if (winner) return;

    // Phase 1: Placing X or O (up to 3 each)
    if (xCount < 3 || oCount < 3) {
      if (board[index] === null) {
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        if (currentPlayer === "X") setXCount((prev) => prev + 1);
        if (currentPlayer === "O") setOCount((prev) => prev + 1);

        if (checkWin(newBoard, currentPlayer)) {
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
        }
      }
      return;
    }

    // Phase 2: Moving pieces
    if (selectedIndex === null) {
      if (board[index] === currentPlayer) {
        setSelectedIndex(index);
      }
    } else {
      if (board[index] === null) {
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        newBoard[selectedIndex] = null;
        setBoard(newBoard);
        setSelectedIndex(null);

        if (checkWin(newBoard, currentPlayer)) {
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
        }
      } else if (board[index] === currentPlayer) {
        setSelectedIndex(index); // change selection
      } else {
        setSelectedIndex(null); // cancel
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Movable Tic Tac Toe</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`w-20 h-20 border-2 text-3xl font-bold flex items-center justify-center
              ${selectedIndex === idx ? "bg-yellow-200" : "bg-white"}
              ${
                cell === "X"
                  ? "text-blue-600"
                  : cell === "O"
                  ? "text-red-600"
                  : "text-gray-400"
              }`}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <div className="mt-4 text-xl font-semibold">{winner} wins!</div>
      )}
      {!winner && <div className="mt-2">Current Turn: {currentPlayer}</div>}
    </div>
  );
}
