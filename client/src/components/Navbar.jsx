import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell, Menu } from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have logged out.');
    navigate('/login');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-danger';
      case 'faculty':
        return 'badge-primary';
      default:
        return 'badge-success';
    }
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', padding: '0.4rem' }}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <span
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em'
          }}
        >
          Institutional Portal
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
              {user.role}
            </span>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'right',
                lineHeight: 1.2
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {user.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user.department}
              </span>
            </div>

            <Link
              to="/profile"
              className="btn btn-secondary btn-sm"
              title="View Profile"
              style={{ padding: '0.45rem', borderRadius: '50%' }}
            >
              <User size={18} />
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm"
              title="Logout"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

