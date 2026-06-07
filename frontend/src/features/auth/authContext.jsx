import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { TOKEN_STORAGE_KEYS } from "../../lib/constants.js";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "./authService.js";


export const AuthContext = createContext(null);

function readStoredUser() {
  const storedUser = localStorage.getItem(TOKEN_STORAGE_KEYS.user);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEYS.access));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEYS.refresh));
  const [user, setUser] = useState(readStoredUser);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(accessToken));

  const persistSession = useCallback(({ access, refresh, profile }) => {
    localStorage.setItem(TOKEN_STORAGE_KEYS.access, access);
    localStorage.setItem(TOKEN_STORAGE_KEYS.refresh, refresh);
    localStorage.setItem(TOKEN_STORAGE_KEYS.user, JSON.stringify(profile));
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(profile);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.access);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.refresh);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.user);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const onLogout = () => clearSession();
    window.addEventListener("hisabsathi:logout", onLogout);
    return () => window.removeEventListener("hisabsathi:logout", onLogout);
  }, [clearSession]);

  useEffect(() => {
    async function bootstrap() {
      if (!accessToken) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const profile = await getCurrentUser();
        localStorage.setItem(TOKEN_STORAGE_KEYS.user, JSON.stringify(profile));
        setUser(profile);
      } catch {
        clearSession();
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrap();
  }, [accessToken, clearSession]);

  const login = useCallback(async ({ identifier, password }) => {
    const tokens = await loginUser({ username: identifier, password });
    const profile = await getCurrentUser();
    persistSession({ access: tokens.access, refresh: tokens.refresh, profile });
    return profile;
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    persistSession({ access: data.access, refresh: data.refresh, profile: data });
    return data;
  }, [persistSession]);

  const logout = useCallback(async () => {
    try {
      await logoutUser(refreshToken);
    } finally {
      clearSession();
    }
  }, [clearSession, refreshToken]);

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isBootstrapping,
      login,
      logout,
      refreshToken,
      register,
      setUser,
      user,
    }),
    [accessToken, refreshToken, user, isBootstrapping, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
