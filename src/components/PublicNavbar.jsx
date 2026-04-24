import { Link } from 'react-router-dom';

export function PublicNavbar() {
  return (
    <nav className="bg-white shadow border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight select-none">
          ✍️ WriteSpace
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-colors px-4 py-1.5 rounded-lg shadow-sm"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}