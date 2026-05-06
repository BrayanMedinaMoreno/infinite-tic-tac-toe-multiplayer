import { useEffect, useState } from 'react';

interface LeaderboardUser {
  id: number;
  username: string;
  wins: number;
  losses: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/users/leaderboard/');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Poll the leaderboard every 10 seconds to keep it fresh
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mt-8 mb-12">
      <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700">
        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500 mb-6 flex items-center justify-center gap-2">
          <span>🏆</span> Global Leaderboard <span>🏆</span>
        </h3>
        
        {loading ? (
          <div className="text-center text-gray-400 py-4 animate-pulse">Loading scores...</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Rank</th>
                  <th className="p-4 font-semibold">Player</th>
                  <th className="p-4 font-semibold text-center text-teal-400">Wins</th>
                  <th className="p-4 font-semibold text-center text-red-400">Losses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="p-4 font-bold text-gray-500">
                      #{index + 1}
                      {index === 0 && <span className="ml-2">👑</span>}
                      {index === 1 && <span className="ml-2">🥈</span>}
                      {index === 2 && <span className="ml-2">🥉</span>}
                    </td>
                    <td className="p-4 font-bold text-white">{user.username}</td>
                    <td className="p-4 text-center font-bold text-teal-400">{user.wins}</td>
                    <td className="p-4 text-center font-bold text-red-400">{user.losses}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No players ranked yet. Be the first to win!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
