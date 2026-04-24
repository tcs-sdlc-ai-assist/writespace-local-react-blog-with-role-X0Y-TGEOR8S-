# Changelog

All notable changes to this project will be documented in this file.

---

## [1.0.0] - 2024-01-01

### Added

#### Public Landing Page (SCRUM-17813)
- Introduced a public-facing marketing / hero page at `/`
- Hero section with gradient background, tagline, and call-to-action buttons
- Features section highlighting Effortless Writing, Share with the World, and Safe & Managed
- Latest from the community section displaying the 3 most recent posts (read-only)
- Public navigation bar with Login and Register links
- Footer with site branding, navigation links, and copyright notice
- Guests are redirected to `/login` or `/register` from protected routes

#### Authentication — Login & Registration (SCRUM-17813)
- Login page at `/login` with username and password fields
- Registration page at `/register` with display name, username, password, and confirm password fields
- Hard-coded admin account (`admin` / `admin`) with immediate access to the admin dashboard
- Session persistence via `localStorage` under the key `writespace_session`
- Automatic redirect to `/blogs` (users) or `/admin` (admins) after successful authentication
- Automatic redirect away from `/login` and `/register` for already-authenticated users
- Inline validation error messages for missing fields, mismatched passwords, and duplicate usernames

#### Role-Based Access Control (SCRUM-17813)
- `ProtectedRoute` component guarding all authenticated routes
- Unauthenticated visitors are redirected to `/login`
- `adminOnly` prop on `ProtectedRoute` redirects non-admin users to `/blogs`
- Two roles supported: `user` and `admin`
- Role-aware avatar helper (`👑` for admins, `📖` for users)
- Role badge displayed in the authenticated navigation bar

#### Blog CRUD (SCRUM-17814)
- Authenticated blog feed at `/blogs` showing all published posts in a responsive grid
- `BlogCard` component with colour-coded top border, excerpt, author avatar, and date
- Pencil icon shortcut on cards for authors and admins to jump directly to the edit form
- Dedicated create / edit page at `/blog/new` and `/blog/:id/edit` (`WriteBlog`)
- Full post reading view at `/blog/:id` (`ReadBlog`) with Edit and Delete action buttons
- Inline modal on the `/blogs` feed for quick create and edit without leaving the page
- Character counter on the content textarea
- Authors may only edit or delete their own posts; admins may edit or delete any post
- Access-denied screen shown when a non-owner attempts to reach another user's edit URL
- Post-not-found screen for deleted or non-existent post IDs
- All posts persisted to `localStorage` under the key `writespace_posts`, sorted newest-first

#### Admin Dashboard (SCRUM-17815)
- Admin dashboard at `/admin` accessible only to users with the `admin` role
- Overview stat cards: Total Posts, Total Users, Admins, Regular Users
- Quick action buttons: Write a Post, Manage Users
- Recent Posts section displaying the 5 latest posts with per-card Delete Post button
- Admins can edit any post via the pencil icon on any `BlogCard`

#### User Management (SCRUM-17815)
- User management table at `/admin/users` listing all registered accounts
- Hard-coded admin row always shown at the top of the table (non-deletable)
- Add User modal allowing admins to create accounts with any role (`user` or `admin`)
- Delete user action (🗑️) with confirmation dialog
- Built-in admin account and the currently logged-in admin are protected from deletion
- User count summary displayed above the table

#### localStorage Persistence
- `writespace_session` — stores the active user session
- `writespace_users` — stores the array of registered user accounts
- `writespace_posts` — stores the array of published blog posts
- Graceful silent failure when `localStorage` is unavailable or quota is exceeded

#### UI & Styling
- Tailwind CSS v3 utility-first styling throughout
- Fully responsive layouts (mobile → tablet → desktop grid)
- Consistent design language: `rounded-2xl` cards, `shadow`, indigo/violet/pink accent palette
- Focus-visible ring styles on all interactive elements for keyboard accessibility
- `select-none` on decorative emoji to prevent accidental text selection
- Smooth `transition-colors` on all hover states

#### Deployment
- `vercel.json` rewrite rule directing all routes to `index.html` for client-side routing
- Compatible with any static host that supports SPA fallback (Netlify, GitHub Pages, etc.)

---

## [Unreleased]

- No unreleased changes at this time.