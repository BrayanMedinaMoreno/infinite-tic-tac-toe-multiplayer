import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuth(data.access, username);
        navigate('/'); // Redirect to the game room
      } else {
        alert(data.detail || 'Login failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-teal-500 hover:bg-teal-400 text-white p-3 rounded font-bold transition-all">
            Enter Game
          </button>
        </form>
      </div>
    </div>
  );
}
