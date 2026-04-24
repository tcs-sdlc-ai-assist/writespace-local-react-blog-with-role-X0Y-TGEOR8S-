import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getPosts, savePosts, getSession } from '../utils/storage.js';

export function ReadBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const session = getSession();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);
    if (!found) {
      setNotFound(true);
    } else {
      setPost(found);
    }
  }, [id]);

  function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const allPosts = getPosts();
    const updated = allPosts.filter((p) => p.id !== id);
    savePosts(updated);
    navigate('/blogs');
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-5 px-4">
          <div className="text-7xl select-none">🔍</div>
          <h2 className="text-2xl font-bold text-gray-700">Post not found</h2>
          <p className="text-gray-400 text-sm text-center max-w-sm">
            The post you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate('/blogs')}
            className="mt-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Back to Blogs
          </button>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading…</div>
        </main>
      </div>
    );
  }

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Blogs
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight leading-snug">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {getAvatar(post.authorRole || 'user')}
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-gray-800">
                    {post.authorName}
                  </span>
                  <span className="text-xs text-gray-400">{formattedDate}</span>
                </div>
              </div>

              {canEdit && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/blog/${post.id}/edit`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
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
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </main>
    </div>
  );
}