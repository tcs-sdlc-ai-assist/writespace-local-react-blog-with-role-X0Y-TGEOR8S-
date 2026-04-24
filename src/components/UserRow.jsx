import { getAvatar } from './Avatar.jsx';

export function UserRow({ user, currentUser, onDelete }) {
  const isHardcodedAdmin = user.id === '0' || user.username === 'admin';
  const isSelf = currentUser && currentUser.userId === user.id;
  const cannotDelete = isHardcodedAdmin || isSelf;

  const deleteTitle = isHardcodedAdmin
    ? 'Cannot delete the admin account'
    : isSelf
    ? 'Cannot delete your own account'
    : 'Delete user';

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {getAvatar(user.role)}
          <div>
            <div className="text-sm font-semibold text-gray-800">
              {user.displayName}
            </div>
            <div className="text-xs text-gray-400">@{user.username}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {user.role === 'admin' ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
            Admin
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
            User
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{formattedDate}</td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => !cannotDelete && onDelete && onDelete(user)}
          disabled={cannotDelete}
          title={deleteTitle}
          aria-label={deleteTitle}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            cannotDelete
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}