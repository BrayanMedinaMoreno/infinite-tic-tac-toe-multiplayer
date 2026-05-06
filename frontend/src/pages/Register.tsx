import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        alert('Registration successful! You can now login.');
        navigate('/login');
      } else {
        const data = await res.json();
        alert('Error: ' + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            className="p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-teal-600 hover:bg-teal-500 text-white p-3 rounded font-bold transition-all">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
