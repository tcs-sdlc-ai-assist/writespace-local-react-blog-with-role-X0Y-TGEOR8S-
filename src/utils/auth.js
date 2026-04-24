import {
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
} from './storage.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';
const ADMIN_SESSION = {
  userId: '0',
  username: 'admin',
  displayName: 'Admin',
  role: 'admin',
};

export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    saveSession(ADMIN_SESSION);
    return { success: true, session: ADMIN_SESSION };
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid credentials.' };
  }

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };

  saveSession(session);
  return { success: true, session };
}

export function register(displayName, username, password) {
  if (!displayName || !username || !password) {
    return { success: false, error: 'All fields are required.' };
  }

  if (username === ADMIN_USERNAME) {
    return { success: false, error: 'Username is already taken.' };
  }

  const users = getUsers();
  const exists = users.some((u) => u.username === username);
  if (exists) {
    return { success: false, error: 'Username is already taken.' };
  }

  const newUser = {
    id: crypto.randomUUID(),
    displayName,
    username,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);

  const session = {
    userId: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    role: newUser.role,
  };

  saveSession(session);
  return { success: true, session };
}

export function logout() {
  clearSession();
}

export function isAuthenticated() {
  const session = getSession();
  return session !== null;
}

export function getRole() {
  const session = getSession();
  if (!session) return null;
  return session.role;
}