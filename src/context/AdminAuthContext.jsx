import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let message = 'حصل خطأ، حاول تاني';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        message = 'الإيميل أو الباسورد غلط';
      } else if (error.code === 'auth/user-not-found') {
        message = 'مفيش حساب بالإيميل ده';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'محاولات كتير غلط، حاول بعد شوية';
      }
      return { success: false, message };
    }
  };

  const logout = () => signOut(auth);

  return (
    <AdminAuthContext.Provider value={{ user, isAuthed: !!user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);