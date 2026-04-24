import { Link, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/storage.js';
import { logout } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

export function Navbar() {
  const navigate = useNavigate();
  const session = getSession();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bg-white shadow border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/blogs"
            className="text-xl font-bold text-indigo-600 tracking-tight select-none"
          >
            ✍️ WriteSpace
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/blogs"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
            >
              Blogs
            </Link>
            {session && session.role === 'admin' && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
              {getAvatar(session.role)}
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-gray-800">
                  {session.displayName}
                </span>
                <span className="text-xs text-gray-400 capitalize">
                  {session.role}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}