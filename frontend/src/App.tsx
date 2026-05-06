import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import GameRoom from './pages/GameRoom';
import { ErrorBoundary } from './ErrorBoundary';

function App() {
  const { token, username, logout } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <nav className="p-4 bg-gray-950 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500">
            Tres en Raya Dinámico
          </h1>
          <div className="flex gap-4 items-center">
            {token ? (
              <>
                <span className="text-gray-300">Welcome, {username}</span>
                <button 
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-all text-sm font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-teal-400 hover:text-teal-300 transition-colors">Login</Link>
                <Link to="/register" className="bg-teal-500 hover:bg-teal-400 px-3 py-1 rounded text-white font-bold transition-all">Register</Link>
              </>
            )}
          </div>
        </nav>

        <main className="p-4">
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
                  {token ? (
                    <GameRoom />
                  ) : (
                    <h2 className="text-2xl text-gray-400">Please login to play</h2>
                  )}
                </div>
              } />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;

