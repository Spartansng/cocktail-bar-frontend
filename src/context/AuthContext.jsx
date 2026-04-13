import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { login as apiLogin } from '../api/client';

const AuthContext = createContext(null);

function loadStoredAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    return { token, user: JSON.parse(user) };
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth);

  const login = useCallback(async (identifiant, password) => {
    const data = await apiLogin(identifiant, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setAuth({ token: data.token, user: data.user });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
  }, []);

  const value = useMemo(() => ({
    user: auth.user,
    token: auth.token,
    login,
    logout,
    isAdmin: auth.user?.role === 'admin',
    isStaff: auth.user?.role === 'staff' || auth.user?.role === 'admin',
  }), [auth, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
