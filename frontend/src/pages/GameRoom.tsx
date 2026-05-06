import { useEffect, useState, useRef } from 'react';
import useWebSocketDefault from 'react-use-websocket';
import { useAuthStore } from '../store/authStore';
import { useGameStore, getValidCells } from '../store/gameStore';
import Board from '../components/Board';
import Leaderboard from '../components/Leaderboard';
import type { Player } from '../store/gameStore';

const useWebSocket = (useWebSocketDefault as any)?.default || useWebSocketDefault;

export default function GameRoom() {
  const { token } = useAuthStore();
  const { moves, currentPlayer, winner, placeMoveLocally, receiveMove, gridSize, setGridSize, myRole, setMyRole, resetGame } = useGameStore();
  const [isVsBot, setIsVsBot] = useState(false);
  const [serverRole, setServerRole] = useState<Player | null>(null);
  const reportedWinner = useRef<string | null>(null);
  
  const socketUrl = `ws://localhost:8000/ws/game/global/`;
  
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      const data = lastJsonMessage as any;
      if (data.action === 'assign_role') {
        setServerRole(data.role);
        if (!isVsBot) setMyRole(data.role);
      } else if (data.action === 'place_move' && data.move) {
        if (!isVsBot) receiveMove(data.move);
      } else if (data.action === 'reset_game') {
        if (!isVsBot) resetGame(data.size);
      }
    }
  }, [lastJsonMessage, receiveMove, setMyRole, isVsBot, resetGame]);

  // Mode Switch logic
  useEffect(() => {
    if (isVsBot) {
      setMyRole('X');
    } else {
      setMyRole(serverRole);
    }
  }, [isVsBot, serverRole, setMyRole]);

  // Record Game Result
  useEffect(() => {
    if (winner && !isVsBot && myRole && reportedWinner.current !== winner) {
      reportedWinner.current = winner;
      const isWin = (myRole === winner);
      const isLoss = (myRole !== winner);
      
      let result = '';
      if (isWin) result = 'win';
      else if (isLoss) result = 'loss';

      if (result) {
        fetch('http://localhost:8000/api/users/record-game/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ result })
        }).catch(err => console.error('Error recording game:', err));
      }
    } else if (!winner) {
      reportedWinner.current = null; // Reset when game resets
    }
  }, [winner, isVsBot, myRole, token]);

  // AI Bot Logic
  useEffect(() => {
    if (isVsBot) {
      if (currentPlayer === 'O' && !winner) {
        const timer = setTimeout(() => {
          const validCells = getValidCells(moves, gridSize);
          if (validCells.length > 0) {
            const randomCell = validCells[Math.floor(Math.random() * validCells.length)];
            placeMoveLocally(randomCell.x, randomCell.y);
            // We do not broadcast bot moves to the server
          }
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [isVsBot, currentPlayer, winner, moves, gridSize, placeMoveLocally]);

  const handleSendMove = (move: any) => {
    // Only broadcast if playing online
    if (!isVsBot) {
      sendJsonMessage({
        action: 'place_move',
        move
      });
    }
  };

  const handleReset = (size: number) => {
    if (!isVsBot) {
      sendJsonMessage({ action: 'reset_game', size });
    }
    resetGame(size);
  };

  if (!token) return <div className="text-center text-red-500">Not authenticated</div>;

  return (
    <div className="flex flex-col items-center justify-center py-4 px-4 w-full max-w-4xl mx-auto">
      
      {/* Game Mode Selector */}
      <div className="flex bg-gray-800 p-1 rounded-lg mb-6 shadow-md w-full max-w-md">
        <button 
          onClick={() => {
            setIsVsBot(false);
            handleReset(3);
          }}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-md font-bold transition-all ${!isVsBot ? 'bg-teal-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <span>🌐</span> Play Online
        </button>
        <button 
          onClick={() => {
            setIsVsBot(true);
            handleReset(3);
          }}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-md font-bold transition-all ${isVsBot ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <span>🤖</span> Play vs AI
        </button>
      </div>

      <div className="mb-4 flex flex-col items-center gap-4 w-full">
        {/* Grid Size Selector */}
        <div className="flex gap-2">
          <span className="text-gray-400 font-bold self-center mr-2">Board Size:</span>
          {[3, 4, 5].map((size) => (
            <button
              key={size}
              onClick={() => handleReset(size)}
              className={`px-3 py-1 rounded font-bold transition-colors ${gridSize === size ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {size}x{size}
            </button>
          ))}
        </div>

        <div className="text-gray-400 text-sm">
          {!isVsBot ? (
            <>
              Status: 
              <span className={`ml-2 font-bold ${readyState === 1 ? 'text-green-500' : 'text-yellow-500'}`}>
                {readyState === 1 ? 'Connected' : 'Connecting...'}
              </span>
              <div className="mt-2 text-center">
                You are playing as: <span className={`font-black text-lg ${myRole === 'X' ? 'text-blue-400' : myRole === 'O' ? 'text-red-400' : 'text-gray-500'}`}>{myRole || 'Spectator'}</span>
              </div>
            </>
          ) : (
            <div className="mt-2 text-center text-indigo-400 font-bold">
              Bot is playing as Player O
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full flex justify-center mb-8">
        <Board onPlayMove={handleSendMove} onReset={() => handleReset(gridSize)} />
      </div>

      {/* Leaderboard Section */}
      <Leaderboard />
    </div>
  );
}
