import { getAvatar } from './Avatar.jsx';

export function BlogCard({ post, currentUser, onEdit, index = 0 }) {
  const borderColors = [
    'border-indigo-400',
    'border-violet-400',
    'border-pink-400',
    'border-blue-400',
    'border-emerald-400',
    'border-amber-400',
  ];
  const accentBorder = borderColors[index % borderColors.length];

  const canEdit =
    currentUser &&
    (currentUser.role === 'admin' || currentUser.userId === post.authorId);

  const excerpt =
    post.content.length > 120
      ? post.content.slice(0, 120).trimEnd() + '…'
      : post.content;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`bg-white rounded-2xl shadow hover:shadow-md transition-shadow p-6 flex flex-col gap-3 border-t-4 ${accentBorder}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold text-gray-800 leading-snug line-clamp-2 flex-1">
          {post.title}
        </h2>
        {canEdit && (
          <button
            onClick={() => onEdit && onEdit(post)}
            className="text-gray-400 hover:text-indigo-500 transition-colors flex-shrink-0 mt-0.5"
            title="Edit post"
            aria-label="Edit post"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-gray-500 text-sm leading-relaxed flex-1">{excerpt}</p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {getAvatar(post.authorRole || 'user')}
          <span className="text-sm text-gray-600 font-medium">
            {post.authorName}
          </span>
        </div>
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>
    </div>
  );
}