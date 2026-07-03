import { createContext, useContext, useState, useCallback } from 'react';

const AdminAuthContext = createContext(null);

// ⚠️ باسورد مؤقت للتجربة — لما نيجي نعمل باك اند حقيقي هنبدله بـ Firebase Auth
const ADMIN_PASSWORD = 'alnazer2026';
const AUTH_KEY = 'alnazer_admin_auth';

export function AdminAuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  });

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1');
      setIsAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthed(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthed, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);