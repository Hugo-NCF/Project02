import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { userApi } from "../services/api";

const AuthContext = createContext(null);

const USE_MOCK_AUTH =
  import.meta.env.VITE_USE_MOCK_AUTH === "true" ||
  import.meta.env.VITE_FIREBASE_API_KEY === "placeholder_api_key";

const MOCK_USERS_KEY = "campus_careers_mock_users";
const MOCK_CURRENT_USER_KEY = "campus_careers_mock_current_user";
const ROLE_MAP_KEY = "campus_careers_user_roles";

function getStoredRoles() {
  try {
    return JSON.parse(localStorage.getItem(ROLE_MAP_KEY) || "{}");
  } catch {
    return {};
  }
}

function setStoredRole(email, roleData) {
  const map = getStoredRoles();
  map[email] = roleData;
  localStorage.setItem(ROLE_MAP_KEY, JSON.stringify(map));
}

function getMockUsers() {
  try {
    return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveMockUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK_AUTH) {
      const stored = localStorage.getItem(MOCK_CURRENT_USER_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const roles = getStoredRoles();
        const roleData = roles[firebaseUser.email] || { role: "seeker", name: firebaseUser.displayName };
        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: roleData.name || firebaseUser.displayName,
          role: roleData.role,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function register({ name, email, password, role }) {
    if (USE_MOCK_AUTH) {
      const users = getMockUsers();
      if (users[email]) {
        throw new Error("An account with this email already exists.");
      }
      users[email] = { password, name, role };
      saveMockUsers(users);
      const user = { uid: `mock_${Date.now()}`, email, name, role };
      localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
      return user;
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    setStoredRole(email, { name, role });
    await userApi.sync({ name, email, role }).catch(() => {});
    const user = {
      uid: credential.user.uid,
      email: credential.user.email,
      name,
      role,
    };
    setCurrentUser(user);
    return user;
  }

  async function login({ email, password }) {
    if (USE_MOCK_AUTH) {
      const users = getMockUsers();
      const record = users[email];
      if (!record || record.password !== password) {
        throw new Error("Invalid email or password.");
      }
      const user = { uid: `mock_${email}`, email, name: record.name, role: record.role };
      localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
      return user;
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    const roles = getStoredRoles();
    const roleData = roles[email] || { role: "seeker", name: credential.user.displayName };
    const user = {
      uid: credential.user.uid,
      email: credential.user.email,
      name: roleData.name || credential.user.displayName,
      role: roleData.role,
    };
    setCurrentUser(user);
    return user;
  }

  async function logout() {
    if (USE_MOCK_AUTH) {
      localStorage.removeItem(MOCK_CURRENT_USER_KEY);
      setCurrentUser(null);
      return;
    }
    await signOut(auth);
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    loading,
    isMockAuth: USE_MOCK_AUTH,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
