# WriteSpace Blog

A modern, lightweight blogging platform built with React 18 and Vite. WriteSpace lets community members publish posts, discover stories, and gives admins full control over content and users — all powered by localStorage (no backend required).

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Library | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS v3 |
| Persistence | Browser localStorage |
| Language | JavaScript (ES6+ / JSX) |

---

## Folder Structure

```
writespace-blog/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── package.json
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Avatar.jsx          # Role-based avatar helper
    │   ├── BlogCard.jsx        # Blog post card with edit shortcut
    │   ├── Navbar.jsx          # Authenticated navigation bar
    │   ├── PublicNavbar.jsx    # Public / unauthenticated navigation bar
    │   ├── ProtectedRoute.jsx  # Route guard (auth + admin-only)
    │   ├── StatCard.jsx        # Dashboard statistic card
    │   └── UserRow.jsx         # User table row with delete action
    ├── pages/
    │   ├── LandingPage.jsx     # Public marketing / hero page
    │   ├── LoginPage.jsx       # Sign-in form
    │   ├── RegisterPage.jsx    # Account creation form
    │   ├── Home.jsx            # Authenticated blog feed
    │   ├── WriteBlog.jsx       # Create / edit post page
    │   ├── ReadBlog.jsx        # Full post reading view
    │   ├── AdminDashboard.jsx  # Admin overview & quick actions
    │   └── UserManagement.jsx  # Admin user CRUD table
    └── utils/
        ├── auth.js             # login / register / logout helpers
        └── storage.js          # localStorage read/write helpers
```

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
```

Output is placed in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## Usage Guide

### Guest (unauthenticated)

| Action | Where |
|---|---|
| View the landing / marketing page | `/` |
| Browse the latest 3 community posts (read-only) | `/` → Latest from the community |
| Navigate to login | `/login` |
| Navigate to registration | `/register` |

### User (authenticated, role: `user`)

| Action | Where |
|---|---|
| View all published blog posts | `/blogs` |
| Create a new post | `/blogs` → **New Post** button |
| Edit own post | Click the ✏️ pencil icon on your card, or open the post at `/blog/:id` → **Edit** |
| Delete own post | Open the post at `/blog/:id` → **Delete** |
| Read any post in full | Click a blog card → `/blog/:id` |
| Logout | Navbar → **Logout** |

> Users can only edit or delete posts they authored. Attempting to access `/blog/:id/edit` for another user's post shows an **Access denied** screen.

### Admin (authenticated, role: `admin`)

All user capabilities, plus:

| Action | Where |
|---|---|
| Access the admin dashboard | Navbar → **Admin Dashboard** → `/admin` |
| View platform statistics | `/admin` → Overview cards |
| Edit **any** post | Click ✏️ on any card or open `/blog/:id` → **Edit** |
| Delete **any** post | `/admin` → Recent Posts → **Delete Post**, or `/blog/:id` → **Delete** |
| Navigate to user management | `/admin` → **Manage Users** → `/admin/users` |
| View all registered users | `/admin/users` |
| Create a new user (any role) | `/admin/users` → **Add User** |
| Delete a user | `/admin/users` → 🗑️ icon on the user row |

> The built-in `admin` account and the currently logged-in admin cannot be deleted.

#### Default Admin Credentials

```
Username: admin
Password: admin
```

---

## localStorage Schema

All data is stored in the browser's `localStorage` under the following keys:

### `writespace_session`

Stores the currently authenticated user's session.

```json
{
  "userId": "string",
  "username": "string",
  "displayName": "string",
  "role": "admin | user"
}
```

### `writespace_users`

Array of registered user accounts (excludes the hard-coded admin).

```json
[
  {
    "id": "uuid-string",
    "displayName": "string",
    "username": "string",
    "password": "string (plain-text)",
    "role": "admin | user",
    "createdAt": "ISO 8601 date string"
  }
]
```

### `writespace_posts`

Array of published blog posts, sorted newest-first on read.

```json
[
  {
    "id": "uuid-string",
    "title": "string",
    "content": "string",
    "createdAt": "ISO 8601 date string",
    "authorId": "string",
    "authorName": "string",
    "authorRole": "admin | user"
  }
]
```

> **Note:** Passwords are stored in plain text in localStorage. This project is intended for demonstration purposes only and should not be used in production without a proper authentication backend.

---

## Deployment

The project includes a `vercel.json` that rewrites all routes to `index.html`, enabling client-side routing on Vercel.

```bash
# Deploy with Vercel CLI
vercel
```

For other static hosts (Netlify, GitHub Pages, etc.), configure your host to serve `index.html` for all routes.

---

## License

Private