import { useState } from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getPosts, savePosts, getSession } from '../utils/storage.js';

export function Home() {
  const session = getSession();
  const [posts, setPosts] = useState(() => getPosts());
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  function openCreateModal() {
    setEditingPost(null);
    setTitle('');
    setContent('');
    setError('');
    setShowModal(true);
  }

  function openEditModal(post) {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingPost(null);
    setTitle('');
    setContent('');
    setError('');
  }

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

    if (editingPost) {
      const updated = allPosts.map((p) =>
        p.id === editingPost.id
          ? { ...p, title: title.trim(), content: content.trim() }
          : p
      );
      savePosts(updated);
      setPosts(getPosts());
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
      setPosts(getPosts());
    }

    closeModal();
  }

  function handleDelete(post) {
    const allPosts = getPosts();
    const updated = allPosts.filter((p) => p.id !== post.id);
    savePosts(updated);
    setPosts(getPosts());
  }

  const currentUser = session
    ? { userId: session.userId, role: session.role }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Community Blogs
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {posts.length === 0
                ? 'No posts yet. Be the first to write!'
                : `${posts.length} post${posts.length !== 1 ? 's' : ''} published`}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="text-7xl select-none">📭</div>
            <h2 className="text-2xl font-bold text-gray-700">No posts yet</h2>
            <p className="text-gray-400 text-sm max-w-sm text-center">
              The community hasn't shared anything yet. Write the first post and
              inspire others!
            </p>
            <button
              onClick={openCreateModal}
              className="mt-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Write the first post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onEdit={openEditModal}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 flex flex-col gap-5 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingPost ? 'Edit Post' : 'New Post'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
                  rows={6}
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
                  {editingPost ? 'Save Changes' : 'Publish Post'}
                </button>
                {editingPost && (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this post?'
                        )
                      ) {
                        handleDelete(editingPost);
                        closeModal();
                      }
                    }}
                    className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-500 font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}