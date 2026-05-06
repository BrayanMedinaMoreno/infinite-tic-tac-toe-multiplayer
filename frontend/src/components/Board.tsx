import { useGameStore } from '../store/gameStore';

interface BoardProps {
  onPlayMove?: (move: any) => void;
  onReset?: () => void;
}

export default function Board({ onPlayMove, onReset }: BoardProps) {
  const { moves, placeMoveLocally, currentPlayer, winner, winningLine, gridSize } = useGameStore();

  const grid = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      grid.push({ x, y });
    }
  }

  const columns = gridSize;

  // We want to highlight the oldest move for the current player so they know it will disappear
  const currentPlayerMoves = moves.filter(m => m.player === currentPlayer).sort((a, b) => a.timestamp - b.timestamp);
  const willDisappearId = currentPlayerMoves.length === 3 && !winner ? currentPlayerMoves[0].id : null;

  const handleCellClick = (x: number, y: number) => {
    const move = placeMoveLocally(x, y);
    if (move && onPlayMove) {
      onPlayMove(move);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-sm px-4">
        <div className={`text-xl font-bold ${currentPlayer === 'X' ? 'text-blue-400' : 'text-gray-500'}`}>Player X</div>
        <div className={`text-xl font-bold ${currentPlayer === 'O' ? 'text-red-400' : 'text-gray-500'}`}>Player O</div>
      </div>

      <div 
        className="grid gap-2 bg-gray-800 p-4 rounded-xl shadow-2xl transition-all duration-300"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {grid.map(cell => {
          const move = moves.find(m => m.x === cell.x && m.y === cell.y);
          const isWinning = winningLine?.some(w => w.x === cell.x && w.y === cell.y);
          const isWillDisappear = move?.id === willDisappearId;

          return (
            <div
              key={`${cell.x},${cell.y}`}
              onClick={() => handleCellClick(cell.x, cell.y)}
              className={`
                w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-4xl font-black rounded-lg cursor-pointer
                transition-all duration-300 ease-in-out
                ${move ? 'bg-gray-700' : 'bg-gray-700 hover:bg-gray-600 active:scale-95'}
                ${isWinning ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
                ${isWillDisappear ? 'opacity-40 scale-90' : 'opacity-100'}
              `}
            >
              {move && (
                <span className={`
                  transform transition-all duration-300
                  ${move.player === 'X' ? 'text-blue-400' : 'text-red-400'}
                  ${isWinning ? 'scale-125' : 'scale-100'}
                `}>
                  {move.player}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {winner && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <h2 className="text-3xl font-bold text-yellow-400">Player {winner} Wins!</h2>
          {onReset && (
            <button 
              onClick={onReset}
              className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
            >
              Play Again
            </button>
          )}
        </div>
      )}
      {!winner && moves.length === 0 && (
        <p className="text-gray-400 animate-pulse">Click any square to start.</p>
      )}
    </div>
  );
}
