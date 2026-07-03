import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('الباسورد غلط، حاول تاني');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--black)', padding: 20,
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
        borderRadius: 'var(--radius-lg)', padding: 36, width: '100%', maxWidth: 360,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Lock size={28} color="var(--gold)" />
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)' }}>لوحة تحكم Alnazer</h2>
        </div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          autoFocus
          style={{
            padding: '12px 16px', background: 'var(--dark)', border: '1px solid var(--dark-border)',
            borderRadius: 'var(--radius-sm)', color: 'var(--white)', fontSize: '.9rem',
          }}
        />
        {error && <p style={{ color: '#e94848', fontSize: '.82rem', fontFamily: 'var(--font-arabic)' }}>{error}</p>}
        <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
          دخول
        </button>
      </form>
    </div>
  );
}