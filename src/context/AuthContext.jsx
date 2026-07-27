import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = 'auth_token';

export const AuthProvider = ({ children }) => {
  const convex = useConvex();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);
    convex
      .query(api.users.getMe, { token })
      .then((u) => {
        clearTimeout(timeout);
        if (u) setUser(u);
        else localStorage.removeItem(TOKEN_KEY);
      })
      .catch(() => {
        clearTimeout(timeout);
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, [convex]);

  const login = useCallback(
    async (email, password) => {
      const result = await convex.mutation(api.users.loginUser, { email, password });
      localStorage.setItem(TOKEN_KEY, result.token);
      setUser(result.user);
    },
    [convex]
  );

  const register = useCallback(
    async (name, email, password) => {
      const result = await convex.mutation(api.users.registerUser, { name, email, password });
      localStorage.setItem(TOKEN_KEY, result.token);
      setUser(result.user);
      // Seed default categories for new user
      convex.mutation(api.categories.seedIfEmpty, {}).catch(() => {});
    },
    [convex]
  );

  const logout = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await convex.mutation(api.users.logoutUser, { token });
      } catch (e) {
        // ignore
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, [convex]);

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
