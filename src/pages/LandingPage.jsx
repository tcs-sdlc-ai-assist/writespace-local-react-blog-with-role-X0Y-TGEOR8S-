import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getSession } from '../utils/storage.js';
import { getPosts } from '../utils/storage.js';

export function LandingPage() {
  const session = getSession();
  const latestPosts = getPosts().slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="text-6xl select-none">✍️</div>
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Your space to write,{' '}
            <span className="text-pink-200">share & inspire</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-xl leading-relaxed">
            WriteSpace is a modern blogging platform where ideas come to life.
            Publish your thoughts, discover great stories, and connect with a
            community of passionate writers.
          </p>
          <div className="flex items-center gap-4 mt-2">
            {session ? (
              <Link
                to="/blogs"
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-indigo-50 transition-colors"
              >
                Go to Blogs
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-indigo-50 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/blogs"
                  className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-colors"
                >
                  Browse Blogs
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
            Everything you need to share your story
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            A clean, distraction-free platform built for writers who care about
            their craft.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 border-t-4 border-indigo-400">
              <div className="text-4xl select-none">📝</div>
              <h3 className="text-lg font-bold text-gray-800">
                Effortless Writing
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                A simple, intuitive editor lets you focus on what matters most —
                your words. No clutter, no distractions.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 border-t-4 border-violet-400">
              <div className="text-4xl select-none">🌍</div>
              <h3 className="text-lg font-bold text-gray-800">
                Share with the World
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Publish your posts instantly and reach readers from around the
                globe. Your ideas deserve an audience.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 border-t-4 border-pink-400">
              <div className="text-4xl select-none">🛡️</div>
              <h3 className="text-lg font-bold text-gray-800">
                Safe & Managed
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                A dedicated admin dashboard keeps the community healthy. Edit or
                remove content with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Latest from the community
              </h2>
              <Link
                to="/blogs"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  currentUser={null}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-gray-800 text-gray-400 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg select-none">
              ✍️ WriteSpace
            </span>
            <span className="text-gray-500 text-sm">
              — A place for every story.
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <Link
              to="/blogs"
              className="hover:text-white transition-colors"
            >
              Blogs
            </Link>
            <Link
              to="/login"
              className="hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:text-white transition-colors"
            >
              Register
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}