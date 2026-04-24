import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { getPosts, savePosts, getSession } from '../utils/storage.js';

export function WriteBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const session = getSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        setNotFound(true);
        return;
      }

      const canEdit =
        session &&
        (session.role === 'admin' || session.userId === post.authorId);

      if (!canEdit) {
        setForbidden(true);
        return;
      }

      setTitle(post.title);
      setContent(post.content);
    }
  }, [id, isEditing, session]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!content.trim()) {
      setError('Content is required.');
      return;
    }

    const allPosts = getPosts();

    if (isEditing) {
      const updated = allPosts.map((p) =>
        p.id === id
          ? { ...p, title: title.trim(), content: content.trim() }
          : p
      );
      savePosts(updated);
    } else {
      const newPost = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        authorId: session.userId,
        authorName: session.displayName,
        authorRole: session.role,
      };
      savePosts([newPost, ...allPosts]);
    }

    navigate('/blogs');
  }

  function handleCancel() {
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

  if (forbidden) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-5 px-4">
          <div className="text-7xl select-none">🚫</div>
          <h2 className="text-2xl font-bold text-gray-700">Access denied</h2>
          <p className="text-gray-400 text-sm text-center max-w-sm">
            You don't have permission to edit this post.
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            {isEditing ? 'Edit Post' : 'New Post'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEditing
              ? 'Update your post below and save your changes.'
              : 'Share your thoughts with the WriteSpace community.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="post-title"
                className="text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title…"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="post-content"
                  className="text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <span className="text-xs text-gray-400">
                  {content.length} characters
                </span>
              </div>
              <textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts with the world…"
                rows={10}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                <span className="select-none">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                {isEditing ? 'Save Changes' : 'Publish Post'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}