import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getPosts, savePosts, getUsers, getSession } from '../utils/storage.js';

export function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();
  const [posts, setPosts] = useState(() => getPosts());

  const users = getUsers();
  const totalPosts = posts.length;
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role !== 'admin').length;

  const recentPosts = posts.slice(0, 5);

  const currentUser = session
    ? { userId: session.userId, role: session.role }
    : null;

  function handleEdit(post) {
    navigate(`/blog/${post.id}/edit`);
  }

  function handleDelete(post) {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const allPosts = getPosts();
    const updated = allPosts.filter((p) => p.id !== post.id);
    savePosts(updated);
    setPosts(getPosts());
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-indigo-100 mt-1 text-sm">
            Manage your WriteSpace community from one place.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 flex flex-col gap-10">
        {/* Stats */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Posts"
              value={totalPosts}
              icon="📝"
              color="border-indigo-400"
            />
            <StatCard
              label="Total Users"
              value={totalUsers}
              icon="👥"
              color="border-violet-400"
            />
            <StatCard
              label="Admins"
              value={adminCount}
              icon="👑"
              color="border-pink-400"
            />
            <StatCard
              label="Regular Users"
              value={userCount}
              icon="📖"
              color="border-emerald-400"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/blog/new')}
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
              Write a Post
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl shadow transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Manage Users
            </button>
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-700">Recent Posts</h2>
            <button
              onClick={() => navigate('/blogs')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View all →
            </button>
          </div>

          {recentPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl shadow">
              <div className="text-6xl select-none">📭</div>
              <h3 className="text-xl font-bold text-gray-700">No posts yet</h3>
              <p className="text-gray-400 text-sm text-center max-w-sm">
                No posts have been published yet. Be the first to write one!
              </p>
              <button
                onClick={() => navigate('/blog/new')}
                className="mt-1 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                Write the first post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post, index) => (
                <div key={post.id} className="flex flex-col gap-2">
                  <BlogCard
                    post={post}
                    currentUser={currentUser}
                    onEdit={handleEdit}
                    index={index}
                  />
                  <button
                    onClick={() => handleDelete(post)}
                    className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete Post
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}