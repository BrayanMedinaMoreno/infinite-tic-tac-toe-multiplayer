import { create } from 'zustand';

export type Player = 'X' | 'O';

export interface Move {
  id: string;
  x: number;
  y: number;
  player: Player;
  timestamp: number;
}

interface GameState {
  moves: Move[];
  currentPlayer: Player;
  winner: Player | null;
  winningLine: { x: number; y: number }[] | null;
  gridSize: number;
  myRole: Player | null; // Null means spectator or local mode unassigned
  
  setMyRole: (role: Player | null) => void;
  setGridSize: (size: number) => void;
  placeMoveLocally: (x: number, y: number) => Move | null;
  receiveMove: (move: Move) => void;
  resetGame: (newSize?: number) => void;
}

// Helper to check win
function checkWin(moves: Move[], player: Player): { x: number; y: number }[] | null {
  const playerMoves = moves.filter(m => m.player === player);
  const grid = new Set(playerMoves.map(m => `${m.x},${m.y}`));

  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

  for (const move of playerMoves) {
    for (const [dx, dy] of directions) {
      const line = [{ x: move.x, y: move.y }];
      for (let i = 1; i < 3; i++) {
        const nx = move.x + dx * i;
        const ny = move.y + dy * i;
        if (grid.has(`${nx},${ny}`)) {
          line.push({ x: nx, y: ny });
        } else {
          break;
        }
      }
      if (line.length === 3) {
        return line;
      }
    }
  }
  return null;
}

export function getValidCells(moves: Move[], gridSize: number): {x: number, y: number}[] {
  const valid = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!moves.some(m => m.x === x && m.y === y)) {
        valid.push({ x, y });
      }
    }
  }
  return valid;
}

export const useGameStore = create<GameState>((set, get) => ({
  moves: [],
  currentPlayer: 'X',
  winner: null,
  winningLine: null,
  gridSize: 3,
  myRole: null,

  setMyRole: (role) => set({ myRole: role }),
  
  setGridSize: (size) => set({ gridSize: size }),

  placeMoveLocally: (x, y) => {
    const { moves, currentPlayer, winner, myRole, gridSize } = get();
    if (winner) return null;
    
    // Only allow moves if it's our turn
    if (myRole !== null && currentPlayer !== myRole) return null;
    
    if (moves.some(m => m.x === x && m.y === y)) return null;

    // Check bounds constraints (fixed grid)
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return null;

    return {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      player: currentPlayer,
      timestamp: Date.now()
    };
  },

  receiveMove: (newMove) => {
    const { moves } = get();
    if (moves.some(m => m.id === newMove.id)) return;

    let newMoves = [...moves, newMove];
    const playerMoves = newMoves.filter(m => m.player === newMove.player);
    if (playerMoves.length > 3) {
      playerMoves.sort((a, b) => a.timestamp - b.timestamp);
      const oldestId = playerMoves[0].id;
      newMoves = newMoves.filter(m => m.id !== oldestId);
    }

    const winningLine = checkWin(newMoves, newMove.player);
    const nextPlayer = newMove.player === 'X' ? 'O' : 'X';

    set({
      moves: newMoves,
      currentPlayer: nextPlayer,
      winner: winningLine ? newMove.player : null,
      winningLine
    });
  },

  resetGame: (newSize) => {
    set((state) => ({ 
      moves: [], 
      currentPlayer: 'X', 
      winner: null, 
      winningLine: null,
      gridSize: newSize !== undefined ? newSize : state.gridSize
    }));
  }
}));
